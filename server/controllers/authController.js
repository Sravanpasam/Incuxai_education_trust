import { createAndStoreOTP, verifyOTP, cleanupExpiredOTPs } from '../services/otpService.js';
import { sendOtpEmail } from '../services/emailService.js';
import { createUser, findUserByEmail, findUserByPersonalEmail, verifyPassword, updatePassword } from '../services/userService.js';
import { generateToken } from '../utils/jwt.js';
import { ensureUsersTable } from '../migration/ensureUsersTable.js';

/**
 * POST /api/auth/send-otp
 * Handles both initial send and resend with dual-email logic.
 *
 * Flow:
 *  - resendCount 0-2 → OTP sent to work email (if available) else personal email
 *  - resendCount >= 3 → auto-switch to personal email
 *  - forcePersonal=true → always sends to personal email (dedicated button)
 *
 * OTP is ALWAYS stored against the personal email so verification is consistent.
 * The email is sent to the destination email (work or personal).
 */
export async function sendOtp(req, res) {
  try {
    const { email, name, personalEmail, workEmail, resendCount, forcePersonal } = req.body;

    console.log('[AuthController] sendOtp — request received');
    console.log('[AuthController] sendOtp — body:', JSON.stringify({ email, personalEmail, workEmail, resendCount, forcePersonal }));

    const personal = (personalEmail || email || '').trim().toLowerCase();
    const work = workEmail ? workEmail.trim().toLowerCase() : '';
    const count = typeof resendCount === 'number' ? resendCount : 0;

    if (!personal) {
      console.log('[AuthController] sendOtp — REJECTED: no email');
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    console.log('[AuthController] sendOtp — personal:', personal, 'work:', work || '(none)', 'count:', count);

    // Determine destination email based on resend logic:
    // - count 0-2 → work email (if available)
    // - count >= 3 → auto-switch to personal email
    // - forcePersonal → always personal
    let destinationEmail;
    let emailType;

    if (forcePersonal) {
      destinationEmail = personal;
      emailType = 'personal';
      console.log('[AuthController] sendOtp — forcePersonal mode');
    } else if (work && count < 3) {
      destinationEmail = work;
      emailType = 'work';
      console.log('[AuthController] sendOtp — sending to work email (count:', count, ')');
    } else {
      // No work email, or count >= 3 — send to personal
      destinationEmail = personal;
      emailType = 'personal';
      console.log('[AuthController] sendOtp — sending to personal email (work:', work || 'none', 'count:', count, ')');
    }

    // Check user doesn't already exist (by personal email)
    const existing = await findUserByPersonalEmail(personal);
    if (existing) {
      console.log('[AuthController] sendOtp — REJECTED: email already registered');
      return res.status(409).json({ success: false, message: 'An account with this email already exists. Please sign in instead.' });
    }

    // OTP is always stored against the personal email for consistent verification
    console.log('[AuthController] sendOtp — storing OTP for personal email:', personal);
    const { otp, error: otpError } = await createAndStoreOTP(personal);
    if (otpError) {
      console.log('[AuthController] sendOtp — OTP generation FAILED:', otpError);
      return res.status(429).json({ success: false, message: otpError });
    }

    // Send email to the destination address
    console.log('[AuthController] sendOtp — sending email to', emailType + ':', destinationEmail);
    const emailResult = await sendOtpEmail(destinationEmail, otp, name || '');
    if (!emailResult.success) {
      console.log('[AuthController] sendOtp — Email send FAILED:', emailResult.error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.',
      });
    }

    console.log('[AuthController] sendOtp — Email sent SUCCESSFULLY to:', destinationEmail);
    cleanupExpiredOTPs().catch(() => {});

    return res.status(200).json({
      success: true,
      emailType,
      resendCount: count + 1,
      message: `Verification code sent to ${emailType === 'work' ? 'your work email' : 'your personal email'}`,
    });
  } catch (err) {
    console.error('[AuthController] sendOtp — UNEXPECTED ERROR:', err.stack || err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

/**
 * POST /api/auth/resend-otp
 * Legacy — kept for LmsSignUpPage backward compatibility.
 */
export async function resendOtp(req, res) {
  try {
    const { workEmail, personalEmail, resendCount, name } = req.body;

    console.log('[AuthController] resendOtp — request received:', JSON.stringify({ workEmail, personalEmail, resendCount }));

    if (!workEmail || typeof workEmail !== 'string') {
      return res.status(400).json({ success: false, message: 'Work email is required.' });
    }

    const normalizedWork = workEmail.trim().toLowerCase();
    const normalizedPersonal = personalEmail ? personalEmail.trim().toLowerCase() : '';
    const count = typeof resendCount === 'number' ? resendCount : 0;

    // OTP is ALWAYS stored against personal email for consistent verification
    const storeEmail = normalizedPersonal || normalizedWork;

    let destinationEmail;
    let emailType;

    if (count >= 3 && normalizedPersonal && normalizedPersonal !== normalizedWork) {
      // count >= 3: send to personal email
      destinationEmail = normalizedPersonal;
      emailType = 'personal';
      console.log('[AuthController] resendOtp — sending to personal email (count:', count, ')');
    } else {
      // count 0-2: send to work email
      destinationEmail = normalizedWork;
      emailType = 'work';
      console.log('[AuthController] resendOtp — sending to work email (count:', count, ')');
    }

    console.log('[AuthController] resendOtp — storing OTP against:', storeEmail, 'sending to:', destinationEmail);

    const { otp, error: otpError } = await createAndStoreOTP(storeEmail);
    if (otpError) {
      console.log('[AuthController] resendOtp — OTP FAILED:', otpError);
      return res.status(429).json({ success: false, message: otpError });
    }

    console.log('[AuthController] resendOtp — OTP generated, sending email to:', destinationEmail);
    const emailResult = await sendOtpEmail(destinationEmail, otp, name || '');

    if (!emailResult.success) {
      console.log('[AuthController] resendOtp — Email FAILED:', emailResult.error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.',
      });
    }

    console.log('[AuthController] resendOtp — Email sent SUCCESSFULLY to:', destinationEmail);
    cleanupExpiredOTPs().catch(() => {});

    return res.status(200).json({
      success: true,
      recipient: emailType,
      resendCount: count + 1,
      message: emailType === 'personal'
        ? 'OTP resent to your Personal Email.'
        : 'OTP resent to your Work Email.',
    });
  } catch (err) {
    console.error('[AuthController] resendOtp — UNEXPECTED ERROR:', err.stack || err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

/**
 * POST /api/auth/send-personal-otp
 * Legacy — kept for LmsSignUpPage backward compatibility.
 */
export async function sendPersonalOtp(req, res) {
  try {
    const { personalEmail, workEmail, name } = req.body;

    if (!personalEmail || typeof personalEmail !== 'string') {
      return res.status(400).json({ success: false, message: 'Personal email is required.' });
    }

    const normalizedPersonal = personalEmail.trim().toLowerCase();
    const normalizedWork = workEmail ? workEmail.trim().toLowerCase() : '';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedPersonal)) {
      return res.status(400).json({ success: false, message: 'Invalid personal email format.' });
    }

    if (normalizedWork && normalizedPersonal === normalizedWork) {
      return res.status(400).json({ success: false, message: 'Personal email must be different from your work email.' });
    }

    const { otp, error: otpError } = await createAndStoreOTP(normalizedPersonal);
    if (otpError) {
      return res.status(429).json({ success: false, message: otpError });
    }

    const emailResult = await sendOtpEmail(normalizedPersonal, otp, name || '');
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP to personal email. Please try again.',
      });
    }

    cleanupExpiredOTPs().catch(() => {});

    return res.status(200).json({
      success: true,
      recipient: 'personal',
      message: `OTP sent to your personal email (${normalizedPersonal})`,
    });
  } catch (err) {
    console.error('[AuthController] sendPersonalOtp error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

/**
 * POST /api/auth/verify-otp
 * Verifies OTP, creates the user, and returns a JWT + user data.
 */
export async function verifyOtp(req, res) {
  try {
    const { email, otp, name, personalEmail, phone, company, role, workEmail, password } = req.body;

    console.log('[AuthController] verifyOtp — request received:', JSON.stringify({
      email, personalEmail, workEmail, name, company, role,
      hasOtp: !!otp, otpLength: otp?.length, hasPassword: !!password,
    }));

    if (!otp || typeof otp !== 'string' || otp.length !== 6) {
      console.log('[AuthController] verifyOtp — REJECTED: invalid OTP format');
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 6-digit OTP.',
      });
    }

    const targetEmail = personalEmail || email;
    if (!targetEmail) {
      console.log('[AuthController] verifyOtp — REJECTED: no email');
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    console.log('[AuthController] verifyOtp — validating OTP for:', targetEmail);
    const { valid, reason } = await verifyOTP(targetEmail, otp.trim());
    if (!valid) {
      console.log('[AuthController] verifyOtp — OTP validation FAILED:', reason);
      return res.status(400).json({ success: false, message: reason });
    }
    console.log('[AuthController] verifyOtp — OTP validation PASSED');

    console.log('[AuthController] verifyOtp — creating user account...');
    const { user, error } = await createUser({
      name: name,
      personalEmail: targetEmail,
      phone: phone || '',
      workEmail: workEmail || null,
      password: password,
      company: company || null,
      role: role || null,
    });

    if (error) {
      console.log('[AuthController] verifyOtp — user creation FAILED:', error);
      return res.status(400).json({ success: false, message: error });
    }

    if (!user) {
      console.log('[AuthController] verifyOtp — user creation returned no data');
      return res.status(500).json({ success: false, message: 'Account creation failed. No user data returned.' });
    }

    console.log('[AuthController] verifyOtp — user created successfully:', user.id);

    const token = generateToken({
      userId: user.id,
      email: user.personal_email,
      name: user.full_name,
      registeredAt: user.created_at,
    });

    console.log('[AuthController] verifyOtp — success, returning token');

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.personal_email,
        role: user.role,
      },
      message: 'Account created successfully!',
    });
  } catch (err) {
    console.error('[AuthController] verifyOtp — UNEXPECTED ERROR:', err.stack || err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

/**
 * POST /api/auth/register
 * Legacy — kept for LmsSignUpPage backward compatibility.
 */
export async function register(req, res) {
  try {
    const { fullName, personalEmail, phone, workEmail, password, company, role } = req.body;

    if (!fullName || !personalEmail || !phone || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
    }

    const existing = await findUserByPersonalEmail(personalEmail);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists. Please sign in.' });
    }

    const { user, error } = await createUser({
      name: fullName,
      personalEmail,
      phone,
      workEmail,
      password,
      company,
      role,
    });

    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    if (!user) {
      console.log('[AuthController] register — user creation returned no data');
      return res.status(500).json({ success: false, message: 'Account creation failed. No user data returned.' });
    }

    const token = generateToken({
      userId: user.id,
      email: user.personal_email,
      name: user.full_name,
      registeredAt: user.created_at,
    });

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.personal_email,
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
 * Authenticates with personal email OR work email + password.
 */
export async function login(req, res) {
  try {
    const { workEmail, personalEmail, email, password } = req.body;
    const loginEmail = (personalEmail || email || workEmail || '').trim().toLowerCase();

    if (!loginEmail || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    console.log('[AuthController] login — searching for:', loginEmail);
    const user = await findUserByEmail(loginEmail);
    if (!user) {
      console.log('[AuthController] login — user NOT FOUND:', loginEmail);
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    console.log('[AuthController] login — user found:', user.id, '| verified:', user.work_email_verified, '| has password hash:', !!user.password_hash);

    if (user.work_email_verified === false) {
      console.log('[AuthController] login — REJECTED: email not verified');
      return res.status(403).json({ success: false, message: 'Please verify your email before signing in.' });
    }

    const match = await verifyPassword(password, user.password_hash);
    if (!match) {
      console.log('[AuthController] login — REJECTED: wrong password');
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    console.log('[AuthController] login — password verified, generating token');
    const token = generateToken({
      userId: user.id,
      email: user.personal_email,
      name: user.full_name,
      registeredAt: user.created_at,
    });

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.personal_email,
        role: user.role,
      },
      message: 'Login successful',
    });
  } catch (err) {
    console.error('[AuthController] login — UNEXPECTED ERROR:', err.stack || err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

/**
 * POST /api/auth/reset-password
 * Resets user password after OTP verification (by personal email).
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
 * Returns current user profile from JWT.
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
        email: user.personal_email,
        phone: user.phone_number,
        company: user.company_name,
        role: user.role,
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
