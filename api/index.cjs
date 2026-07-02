require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const mysql = require('mysql2/promise');

const app = express();
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:8000'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Set' : 'Missing');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', key: process.env.RAZORPAY_KEY_ID ? 'configured' : 'missing' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'IncuXai Payment Backend is running. Frontend should be on port 3000.' });
});

// Get Registration details
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

    // Amount logic: 5500 INR for all, discount to 5000 if valid coupon
    let baseAmount = 5500;
    
    const coupon = req.query.coupon ? req.query.coupon.trim().toUpperCase() : '';
    const validCoupons = ['YASH500', 'RAVI500', 'SRI500', 'SIRI500', 'VAMSI500', 'PREET500', 'INCUX500', 'BINDHU500', 'HARINI500', 'DEVA500', 'SAI500', 'CHANDU500'];
    
    if (validCoupons.includes(coupon)) {
      baseAmount = 5000;
    }

    // Add 2% platform fee
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

// Create Order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    console.log('Create order request:', { amount, currency, receipt });

    if (!amount || amount < 100) {
      return res.status(400).json({ error: 'Amount must be at least 100 paise (₹1)' });
    }

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    });

    console.log('Order created:', order.id);
    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error('Create order error:', err.message || err);
    res.status(500).json({ error: err.message || 'Failed to create order' });
  }
});

// Verify Payment Signature and update DB
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, reg_code, amount_paid } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !reg_code) {
      return res.status(400).json({ error: 'Missing payment verification fields' });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      console.log('Payment verified:', razorpay_payment_id);

      // Generate a success token (like PHP logic)
      const successToken = crypto.randomBytes(32).toString('hex');
      const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

      // Update Database
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
      console.log('Signature mismatch');
      res.status(400).json({ status: 'failure', error: 'Invalid payment signature' });
    }
  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Razorpay backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;
