import { createAndStoreOTP, verifyOTP, cleanupExpiredOTPs } from '../services/otpService.js';
import { sendOtpEmail } from '../services/emailService.js';
import { generateToken } from '../utils/jwt.js';

/**
 * POST /api/auth/send-otp
 *
 * Flow:
 *  1. Validate email (middleware already ran validateWorkEmail)
 *  2. Generate OTP → hash → store in Supabase
 *  3. Send OTP via Resend
 *  4. Return success
 */
export async function sendOtp(req, res) {
  try {
    const { email, name } = req.body;

    // 1. Create and store OTP
    const { otp, error: otpError } = await createAndStoreOTP(email);
    if (otpError) {
      return res.status(429).json({ success: false, message: otpError });
    }

    // 2. Send email
    const emailResult = await sendOtpEmail(email, otp, name || '');
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.',
      });
    }

    // 3. Cleanup expired OTPs in the background (non-blocking)
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
 *
 * Flow:
 *  1. Receive email + otp
 *  2. Find latest OTP record
 *  3. Check expiry, compare hash
 *  4. Mark verified / delete record
 *  5. Generate JWT
 *  6. Return token
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

    // 1. Verify OTP
    const { valid, reason } = await verifyOTP(email, otp.trim());

    if (!valid) {
      return res.status(400).json({ success: false, message: reason });
    }

    // 2. Generate JWT
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
