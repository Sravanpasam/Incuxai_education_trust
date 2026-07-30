import { Router } from 'express';
import { sendOtp, verifyOtp, register, login, resetPassword, getMe, setupDb, resendOtp, sendPersonalOtp } from '../controllers/authController.js';
import { verifyToken } from '../utils/jwt.js';

const router = Router();

/**
 * POST /api/auth/send-otp
 */
router.post('/send-otp', sendOtp);

/**
 * POST /api/auth/resend-otp
 * Dedicated resend endpoint for dual-email verification.
 * No validateWorkEmail middleware — personal emails are valid here.
 */
router.post('/resend-otp', resendOtp);

/**
 * POST /api/auth/send-personal-otp
 * Sends a brand-new OTP to the personal email.
 * Completely independent from the work email resend flow.
 * No validateWorkEmail middleware — personal emails are valid here.
 */
router.post('/send-personal-otp', sendPersonalOtp);

/**
 * POST /api/auth/verify-otp
 */
router.post('/verify-otp', verifyOtp);

/**
 * POST /api/auth/register
 * Creates a new user after OTP verification.
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Authenticates with personal email + password.
 */
router.post('/login', login);

/**
 * POST /api/auth/reset-password
 * Resets password after OTP verification.
 */
router.post('/reset-password', resetPassword);

/**
 * POST /api/auth/setup-db
 * Creates the users table if it does not exist.
 * Call once after deploying, or the server auto-runs on startup.
 */
router.post('/setup-db', setupDb);

/**
 * GET /api/auth/me
 * Returns current user from JWT (requires Authorization header).
 */
router.get('/me', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
  req.user = decoded;
  next();
}, getMe);

export default router;
