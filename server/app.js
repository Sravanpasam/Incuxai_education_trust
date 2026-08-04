import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────────────
const defaultOrigins = ['https://www.incuxaieducationtrust.org', 'https://incuxaieducationtrust.org'];
const envOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
const allowedOrigins = [...new Set([...envOrigins, ...defaultOrigins])];

function isAllowed(origin) {
  if (allowedOrigins.includes(origin)) return true;
  // Allow any localhost / 127.0.0.1 port for local dev (vite binds 0.0.0.0)
  try {
    const u = new URL(origin);
    const host = u.hostname;
    return host === 'localhost' || host === '127.0.0.1';
  } catch {
    return false;
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || isAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many OTP requests. Please wait before trying again.' },
});

app.use('/api/', generalLimiter);
app.use('/api/auth/send-otp', otpLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'auth-server', timestamp: new Date().toISOString() });
});

// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ─── Centralized Error Handler ────────────────────────────────────────────────
app.use(errorHandler);

export default app;
