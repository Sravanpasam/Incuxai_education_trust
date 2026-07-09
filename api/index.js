import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import mysql from 'mysql2/promise';
import { verifyToken } from './trustToken.js';

const app = express();
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5000', 'https://www.incuxaieducationtrust.org', 'https://incuxai.com', 'https://incuxaicademy.incuxai.com'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Raw body parser for Razorpay webhook signature verification
app.use('/api/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Set' : 'Missing');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Database Connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'incuxai_website',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database tables
async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trust_transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        transaction_id VARCHAR(255) UNIQUE NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        amount INT NOT NULL,
        course_id VARCHAR(255),
        razorpay_order_id VARCHAR(255),
        razorpay_payment_id VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        success_token VARCHAR(255),
        token_expires_at DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('[Database] trust_transactions table initialized successfully');
  } catch (err) {
    console.error('[Database] Failed to initialize trust_transactions table:', err);
  }
}
initDb();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', key: process.env.RAZORPAY_KEY_ID ? 'configured' : 'missing' });
});

// Root route
app.get('/api', (req, res) => {
  res.json({ message: 'IncuXai Payment Backend is running. Frontend should be on port 3000.' });
});

// ── NEW SECURE EDUCATION TRUST CHANNELS ─────────────────────────────────────

// 1. Verify checkout token sent from Incux Academy
app.post('/api/verify-checkout-token', async (req, res) => {
  const { token } = req.body;
  const secret = process.env.TRUST_SHARED_SECRET;
  
  if (!token) {
    return res.status(400).json({ error: 'Checkout token is required' });
  }
  
  const payload = verifyToken(token, secret);
  if (!payload) {
    return res.status(400).json({ error: 'Invalid or expired payment session' });
  }
  
  res.json({ status: 'success', payload });
});

// 2. Create Razorpay order dynamically from verified token details
app.post('/api/create-trust-order', async (req, res) => {
  try {
    const { token } = req.body;
    const secret = process.env.TRUST_SHARED_SECRET;
    
    if (!token) {
      return res.status(400).json({ error: 'Checkout token is required' });
    }
    
    const payload = verifyToken(token, secret);
    if (!payload) {
      return res.status(400).json({ error: 'Invalid checkout token' });
    }
    
    const amountInPaise = Math.round(payload.amount * 100);
    if (amountInPaise < 100) {
      return res.status(400).json({ error: 'Amount must be at least ₹1.00' });
    }

    const orderReceipt = `trust_${payload.transaction_id.slice(-10)}_${Date.now() % 100000}`;
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: orderReceipt,
      notes: {
        source: 'incuxai_education_trust',
        transaction_id: payload.transaction_id,
        user_id: payload.user_id,
        course_id: payload.course_id
      }
    });

    // Record or update transaction in SQL
    await pool.query(
      `INSERT INTO trust_transactions 
       (transaction_id, user_id, amount, course_id, razorpay_order_id, status)
       VALUES (?, ?, ?, ?, ?, 'pending')
       ON DUPLICATE KEY UPDATE razorpay_order_id = ?`,
      [payload.transaction_id, payload.user_id, payload.amount, payload.course_id, order.id, order.id]
    );

    console.log('[TrustOrder] Razorpay order recorded:', order.id);
    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error('[TrustOrder] Error generating payment order:', err.message || err);
    res.status(500).json({ error: err.message || 'Failed to create payment order' });
  }
});

// 3. Verify payment signature locally and issue short-lived success token
app.post('/api/verify-trust-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, token } = req.body;
    const secret = process.env.TRUST_SHARED_SECRET;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !token) {
      return res.status(400).json({ error: 'Missing signature verification parameters' });
    }

    const payload = verifyToken(token, secret);
    if (!payload) {
      return res.status(400).json({ error: 'Invalid checkout token context' });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.warn('[TrustVerify] Signature mismatch');
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Generate short-lived success reference token (5 mins TTL)
    const successToken = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query(
      `UPDATE trust_transactions 
       SET status = 'completed',
           razorpay_payment_id = ?,
           success_token = ?,
           token_expires_at = ?
       WHERE transaction_id = ?`,
      [razorpay_payment_id, successToken, expiry, payload.transaction_id]
    );

    console.log('[TrustVerify] Verified payment success for transaction:', payload.transaction_id);
    res.json({
      status: 'success',
      success_token: successToken
    });
  } catch (err) {
    console.error('[TrustVerify] Verification DB update error:', err);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// 4. Backend-to-backend transaction query called by Incux Academy backend
app.post('/api/verify-transaction', async (req, res) => {
  const { reference } = req.body;
  
  if (!reference) {
    return res.status(400).json({ error: 'Reference code is required' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT transaction_id, user_id, amount, course_id, token_expires_at 
       FROM trust_transactions 
       WHERE success_token = ? AND status = 'completed' LIMIT 1`,
      [reference]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Transaction reference not found or unpaid' });
    }

    const tx = rows[0];
    const expiresAt = new Date(tx.token_expires_at);
    if (expiresAt < new Date()) {
      return res.status(400).json({ error: 'Verification reference has expired' });
    }

    // Invalidate token so it can only be query-verified once (safety against replay attacks)
    await pool.query(
      `UPDATE trust_transactions SET success_token = NULL WHERE success_token = ?`,
      [reference]
    );

    console.log('[TrustVerify] Backend-to-backend query success for transaction:', tx.transaction_id);
    res.json({
      status: 'success',
      transaction_id: tx.transaction_id,
      user_id: tx.user_id,
      amount: tx.amount,
      course_id: tx.course_id
    });
  } catch (err) {
    console.error('[TrustVerify] Backend-to-backend verification error:', err);
    res.status(500).json({ error: 'Internal verification query error' });
  }
});

// ── LEGACY IIT VISIT ROUTING (DO NOT BREAK EXISTING FUNCTIONALITY) ─────────

app.get('/api/get-registration/:reg_code', async (req, res) => {
  try {
    const { reg_code } = req.params;
    const [rows] = await pool.query(
      "SELECT id, full_name, email, phone, status, payment_status FROM iit_visit_registrations WHERE registration_code = ? LIMIT 1",
      [reg_code]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    const candidate = rows[0];
    if (candidate.payment_status === 'completed') {
      return res.status(400).json({ error: 'Payment already completed for this registration' });
    }

    let baseAmount = 5000;

    // If incuxai-web already calculated the discounted amount, use it directly
    const amountPaise = parseInt(req.query.amount_paise);
    if (amountPaise && amountPaise >= 100) {
      // Use the pre-calculated amount from incuxai-web (coupon already applied there)
      res.json({
        name: candidate.full_name,
        email: candidate.email,
        phone: candidate.phone,
        amount: amountPaise,
      });
      return;
    }

    // Fallback: no amount_paise provided, use default base + 2% fee
    const finalAmount = baseAmount + (baseAmount * 0.02);
    const amountInPaise = Math.round(finalAmount * 100);

    res.json({
      name: candidate.full_name,
      email: candidate.email,
      phone: candidate.phone,
      amount: amountInPaise,
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    if (!amount || amount < 100) {
      return res.status(400).json({ error: 'Amount must be at least 100 paise' });
    }

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    });

    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create order' });
  }
});

app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, reg_code, amount_paid } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !reg_code) {
      return res.status(400).json({ error: 'Missing payment verification fields' });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      const successToken = crypto.randomBytes(32).toString('hex');
      const expiry = new Date(Date.now() + 5 * 60 * 1000);

      await pool.query(
        `UPDATE iit_visit_registrations 
         SET payment_status = 'completed',
             completed_at = NOW(),
             razorpay_order_id = ?,
             razorpay_payment_id = ?,
             amount_paid = ?,
             success_token = ?,
             token_used = 0,
             token_expires_at = ?
         WHERE registration_code = ?`,
        [razorpay_order_id, razorpay_payment_id, amount_paid, successToken, expiry, reg_code]
      );

      res.json({ 
        status: 'success', 
        message: 'Payment verified successfully',
        success_token: successToken
      });
    } else {
      res.status(400).json({ status: 'failure', error: 'Invalid payment signature' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

app.post('/api/webhook', async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
  if (!webhookSecret) {
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  const razorpaySignature = req.headers['x-razorpay-signature'];
  const rawBody = req.body;

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  let event;
  try {
    event = JSON.parse(rawBody.toString());
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity;
    const orderId = payment.order_id;
    const paymentId = payment.id;
    const amountPaid = payment.amount;

    try {
      // 1. Check in new trust_transactions table
      const [trustRows] = await pool.query(
        'SELECT transaction_id, status FROM trust_transactions WHERE razorpay_order_id = ? LIMIT 1',
        [orderId]
      );

      if (trustRows.length > 0) {
        const tx = trustRows[0];
        if (tx.status !== 'completed') {
          const successToken = crypto.randomBytes(32).toString('hex');
          const expiry = new Date(Date.now() + 5 * 60 * 1000);

          await pool.query(
            `UPDATE trust_transactions
             SET status = 'completed',
                 razorpay_payment_id = ?,
                 success_token = ?,
                 token_expires_at = ?
             WHERE razorpay_order_id = ? AND status != 'completed'`,
            [paymentId, successToken, expiry, orderId]
          );
          console.log('[Webhook] Updated trust_transactions payment success for order:', orderId);
        }
        return res.status(200).json({ status: 'success' });
      }

      // 2. Fallback: Check in legacy iit_visit_registrations table
      const [rows] = await pool.query(
        'SELECT registration_code, payment_status FROM iit_visit_registrations WHERE razorpay_order_id = ? LIMIT 1',
        [orderId]
      );

      if (rows.length === 0) {
        return res.status(200).json({ status: 'ignored' });
      }

      const reg = rows[0];
      if (reg.payment_status === 'completed') {
        return res.status(200).json({ status: 'already_completed' });
      }

      const successToken = crypto.randomBytes(32).toString('hex');
      const expiry = new Date(Date.now() + 5 * 60 * 1000);

      await pool.query(
        `UPDATE iit_visit_registrations
         SET payment_status      = 'completed',
             completed_at        = NOW(),
             razorpay_payment_id = ?,
             amount_paid         = ?,
             success_token       = ?,
             token_used          = 0,
             token_expires_at    = ?
         WHERE razorpay_order_id = ? AND payment_status != 'completed'`,
        [paymentId, amountPaid, successToken, expiry, orderId]
      );

      return res.status(200).json({ status: 'success' });
    } catch (err) {
      console.error('[Webhook] Database processing error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  res.status(200).json({ status: 'received' });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Razorpay backend running on http://localhost:${PORT}`);
  });
}

export default app;
