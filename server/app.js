import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import { readAllAppData, writeAppData } from './services/dataStore.js';
import { ensureAppDataTable } from './migration/ensureAppDataTable.js';
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

// ─── Persistent Data System (Supabase-backed) ────────────────────────────────
let dataReady = false;
async function ensureAppData() {
  if (dataReady) return true;
  try {
    await ensureAppDataTable();
    dataReady = true;
    return true;
  } catch (e) {
    console.error('[DataStore] Failed to init:', e.message);
    return false;
  }
}

// 1. Get full site state (all collections)
app.get('/api/sync-data', async (req, res) => {
  try {
    if (!(await ensureAppData())) {
      return res.status(500).json({ error: 'Data store failed to initialize.' });
    }
    const db = await readAllAppData();
    res.json(db);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Sync failed' });
  }
});

// 2. Bulk upsert collections (client pushes its localStorage snapshot)
app.post('/api/sync-data', async (req, res) => {
  try {
    if (!(await ensureAppData())) {
      return res.status(500).json({ error: 'Data store failed to initialize.' });
    }
    const collections = req.body && req.body.collections ? req.body.collections : req.body;
    if (!collections || typeof collections !== 'object') {
      return res.status(400).json({ error: 'Invalid data payload' });
    }
    const { error } = await writeAppData(collections);
    if (error) return res.status(500).json({ error: 'Failed to persist data' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Sync failed' });
  }
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ─── Centralized Error Handler ────────────────────────────────────────────────
app.use(errorHandler);

export default app;
