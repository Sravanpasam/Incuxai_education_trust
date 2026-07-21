import { createAndStoreOTP, verifyOTP, cleanupExpiredOTPs } from '../services/otpService.js';
import { sendOtpEmail } from '../services/emailService.js';
import { createUser, findUserByEmail, verifyPassword, updatePassword } from '../services/userService.js';
import { generateToken } from '../utils/jwt.js';
import { ensureUsersTable } from '../migration/ensureUsersTable.js';

/**
 * POST /api/auth/send-otp
 */
export async function sendOtp(req, res) {
  try {
    const { email, name } = req.body;

    const { otp, error: otpError } = await createAndStoreOTP(email);
    if (otpError) {
      return res.status(429).json({ success: false, message: otpError });
    }

    const emailResult = await sendOtpEmail(email, otp, name || '');
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.',
      });
    }

    cleanupExpiredOTPs().catch(() => {});

    return res.status(200).json({
      success: true,
      message: `Verification code sent to ${email}`,
    });
  } catch (err) {
    console.error('[AuthController] sendOtp error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

/**
 * POST /api/auth/verify-otp
 */
export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!otp || typeof otp !== 'string' || otp.length !== 6) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 6-digit OTP.',
      });
    }

    const { valid, reason } = await verifyOTP(email, otp.trim());

    if (!valid) {
      return res.status(400).json({ success: false, message: reason });
    }

    const token = generateToken({ email, verified: true, verifiedAt: new Date().toISOString() });

    return res.status(200).json({
      success: true,
      token,
      message: 'OTP verified successfully',
    });
  } catch (err) {
    console.error('[AuthController] verifyOtp error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

/**
 * POST /api/auth/register
 * Creates a new user account after OTP verification.
 */
export async function register(req, res) {
  try {
    const { fullName, personalEmail, phone, workEmail, password } = req.body;

    if (!fullName || !personalEmail || !phone || !workEmail || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
    }

    const existing = await findUserByEmail(workEmail);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this work email already exists. Please sign in.' });
    }

    const { user, error } = await createUser({
      fullName, personalEmail, phone, workEmail, password,
      workEmailVerified: true,
    });

    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const token = generateToken({
      userId: user.id,
      email: user.work_email,
      name: user.full_name,
      registeredAt: user.created_at,
    });

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.work_email,
      },
      message: 'Account created successfully',
    });
  } catch (err) {
    console.error('[AuthController] register error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

/**
 * POST /api/auth/login
 * Authenticates a user with work email + password.
 */
export async function login(req, res) {
  try {
    const { workEmail, password } = req.body;

    if (!workEmail || !password) {
      return res.status(400).json({ success: false, message: 'Work email and password are required.' });
    }

    const user = await findUserByEmail(workEmail);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid work email or password.' });
    }

    if (user.work_email_verified === false) {
      return res.status(403).json({ success: false, message: 'Please verify your work email before signing in.' });
    }

    const match = await verifyPassword(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid work email or password.' });
    }

    const token = generateToken({
      userId: user.id,
      email: user.work_email,
      name: user.full_name,
      registeredAt: user.created_at,
    });

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.work_email,
      },
      message: 'Login successful',
    });
  } catch (err) {
    console.error('[AuthController] login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

/**
 * POST /api/auth/reset-password
 * Resets user password after OTP verification.
 */
export async function resetPassword(req, res) {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email and new password are required.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email.' });
    }

    const { success, error } = await updatePassword(email, newPassword);
    if (!success) {
      return res.status(500).json({ success: false, message: 'Failed to update password. Please try again.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now sign in with your new password.',
    });
  } catch (err) {
    console.error('[AuthController] resetPassword error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

/**
 * GET /api/auth/me
 * Returns the current user from the JWT.
 */
export async function getMe(req, res) {
  try {
    const user = await findUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.work_email,
        phone: user.phone_number,
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    console.error('[AuthController] getMe error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

/**
 * POST /api/auth/setup-db
 * Creates the users table if it does not exist.
 * Call this once after deploying, or the server will attempt it on startup.
 */
export async function setupDb(_req, res) {
  try {
    const ok = await ensureUsersTable();
    if (ok) {
      return res.status(200).json({ success: true, message: 'users table is ready.' });
    }
    return res.status(500).json({
      success: false,
      message: 'Could not auto-create users table. Please run the SQL manually in the Supabase SQL Editor.',
    });
  } catch (err) {
    console.error('[AuthController] setupDb error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}
