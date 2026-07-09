require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Set' : 'Missing');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', key: process.env.RAZORPAY_KEY_ID ? 'configured' : 'missing' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'IncuXai Payment Backend is running. Frontend should be on port 3000.' });
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

// Verify Payment Signature
app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification fields' });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      console.log('Payment verified:', razorpay_payment_id);
      res.json({ status: 'success', message: 'Payment verified successfully' });
    } else {
      console.log('Signature mismatch');
      res.status(400).json({ status: 'failure', error: 'Invalid payment signature' });
    }
  } catch (err) {
    console.error('Verify payment error:', err.message || err);
    res.status(500).json({ error: err.message || 'Payment verification failed' });
  }
});

// ===== PERSISTENT DATABASE SYSTEM =====
const DB_PATH = path.join(__dirname, 'database.json');

const defaultVols = [];

const defaultPass = [];

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      volunteers: defaultVols,
      volunteer_applications: [],
      volunteer_pass: defaultPass
    };
    writeDb(initialData);
    return initialData;
  }
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database.json:', err);
    return {
      volunteers: defaultVols,
      volunteer_applications: [],
      volunteer_pass: defaultPass
    };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing database.json:', err);
  }
}

// 1. Get database state
app.get('/api/sync-data', (req, res) => {
  try {
    const db = readDb();
    res.json(db);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Sync failed' });
  }
});

// 2. Submit volunteer application
app.post('/api/volunteer-applications', (req, res) => {
  try {
    const { name, phone, email, education, why } = req.body;
    if (!name || !phone || !email || !education || !why) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = readDb();
    const alreadyExists = db.volunteer_applications.some(a => a.email === email);
    if (alreadyExists) {
      return res.status(400).json({ error: 'An application with this email already exists!' });
    }

    db.volunteer_applications.push({
      name,
      phone,
      email,
      education,
      why,
      date: new Date().toLocaleDateString('en-IN')
    });

    writeDb(db);
    res.json({ success: true, message: 'Application submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to submit application' });
  }
});

// 3. Approve volunteer application
app.post('/api/approve-volunteer', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    const db = readDb();
    const appIndex = db.volunteer_applications.findIndex(a => a.email === email);
    if (appIndex === -1) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const app = db.volunteer_applications[appIndex];
    // Add to active volunteers if not already there
    if (!db.volunteers.some(v => v.email === email)) {
      db.volunteers.push({
        name: app.name,
        email: app.email,
        phone: app.phone,
        education: app.education,
        why: app.why,
        date: app.date,
        hours: 0,
        state: '',
        city: '',
        depts: []
      });
    }

    // Add credentials if not already there
    if (!db.volunteer_pass.some(p => p.email === email)) {
      db.volunteer_pass.push({
        email: app.email,
        password: 'volunteer123',
        name: app.name
      });
    }

    // Remove from applications
    db.volunteer_applications.splice(appIndex, 1);

    writeDb(db);
    res.json({ success: true, message: 'Volunteer approved successfully', approvedName: app.name });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to approve volunteer' });
  }
});

// 4. Reject volunteer application
app.post('/api/reject-volunteer', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    const db = readDb();
    const appIndex = db.volunteer_applications.findIndex(a => a.email === email);
    if (appIndex === -1) {
      return res.status(404).json({ error: 'Application not found' });
    }

    db.volunteer_applications.splice(appIndex, 1);
    writeDb(db);
    res.json({ success: true, message: 'Application rejected successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to reject volunteer' });
  }
});

// 5. Update volunteers profiles (e.g. from profile changes or updating hours)
app.post('/api/update-volunteers', (req, res) => {
  try {
    const { volunteers } = req.body;
    if (!volunteers || !Array.isArray(volunteers)) {
      return res.status(400).json({ error: 'Invalid volunteers list' });
    }

    const db = readDb();
    db.volunteers = volunteers;
    writeDb(db);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update volunteers' });
  }
});

// 6. Update volunteer credentials (e.g. password change)
app.post('/api/update-volunteer-pass', (req, res) => {
  try {
    const { volunteer_pass } = req.body;
    if (!volunteer_pass || !Array.isArray(volunteer_pass)) {
      return res.status(400).json({ error: 'Invalid credentials list' });
    }

    const db = readDb();
    db.volunteer_pass = volunteer_pass;
    writeDb(db);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update credentials' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Razorpay backend running on http://localhost:${PORT}`);
});
