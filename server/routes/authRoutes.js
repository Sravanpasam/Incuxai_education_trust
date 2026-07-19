import { Router } from 'express';
import { sendOtp, verifyOtp } from '../controllers/authController.js';
import { validateWorkEmail } from '../middleware/validateWorkEmail.js';

const router = Router();

/**
 * POST /api/auth/send-otp
 * - Validates that the email is a work/business email
 * - Generates OTP, stores hashed version in Supabase
 * - Sends OTP email via Resend
 */
router.post('/send-otp', validateWorkEmail, sendOtp);

/**
 * POST /api/auth/verify-otp
 * - Accepts email + 6-digit OTP
 * - Verifies OTP hash, expiry, attempt limits
 * - Returns a signed JWT on success
 */
router.post('/verify-otp', verifyOtp);

export default router;
