import { Router } from 'express';
import { sendOtp, verifyOtp, register, login, getMe, setupDb } from '../controllers/authController.js';
import { validateWorkEmail } from '../middleware/validateWorkEmail.js';
import { verifyToken } from '../utils/jwt.js';

const router = Router();

/**
 * POST /api/auth/send-otp
 */
router.post('/send-otp', validateWorkEmail, sendOtp);

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
 * Authenticates with work email + password.
 */
router.post('/login', login);

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
