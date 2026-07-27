import express from 'express';

const app = express();
app.use(express.json());

let authCtrl = null;
let authJwt = null;

async function loadAuth() {
  if (authCtrl) return true;
  try {
    const ctrl = await import('../../server/controllers/authController.js');
    authCtrl = ctrl;
    const jwt = await import('../../server/utils/jwt.js');
    authJwt = jwt;
    console.log('[Auth] Auth modules loaded successfully');
    return true;
  } catch (err) {
    console.error('[Auth] Failed to load auth modules:', err.message);
    console.error('[Auth] Stack:', err.stack);
    return false;
  }
}

function authHandler(handlerName) {
  return async (req, res) => {
    if (!(await loadAuth())) {
      return res.status(500).json({ success: false, message: 'Auth system failed to initialize.' });
    }
    try {
      authCtrl[handlerName](req, res);
    } catch (err) {
      console.error('[Auth] Handler error:', err);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  };
}

app.get('/api/auth/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'auth',
    env: {
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasJwtSecret: !!process.env.JWT_SECRET,
    }
  });
});

app.get('/api/auth/test-email', async (_req, res) => {
  const diagnostics = {
    hasResendKey: !!process.env.RESEND_API_KEY,
    resendKeyPrefix: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 7) + '...' : 'MISSING',
    emailFrom: process.env.EMAIL_FROM || 'info@incuxaieducationtrust.org',
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasJwtSecret: !!process.env.JWT_SECRET,
  };

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ success: false, message: 'RESEND_API_KEY is not set in Vercel env vars', diagnostics });
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: `IncuXAI Education Trust <${process.env.EMAIL_FROM || 'info@incuxaieducationtrust.org'}>`,
      to: 'sravanpasam74@gmail.com',
      subject: 'Test Email | IncuXAI Education Trust',
      html: '<h1>Test</h1><p>If you see this, Resend is working.</p>',
    });

    if (result.error) {
      return res.status(500).json({ success: false, message: 'Resend API error', error: result.error, diagnostics });
    }

    return res.json({ success: true, message: 'Test email sent to sravanpasam74@gmail.com!', resendId: result.data?.id, diagnostics });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, diagnostics });
  }
});

app.post('/api/auth/send-otp', authHandler('sendOtp'));
app.post('/api/auth/verify-otp', authHandler('verifyOtp'));
app.post('/api/auth/register', authHandler('register'));
app.post('/api/auth/login', authHandler('login'));
app.post('/api/auth/reset-password', authHandler('resetPassword'));
app.post('/api/auth/setup-db', authHandler('setupDb'));

app.get('/api/auth/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }
  const token = authHeader.split(' ')[1];
  if (!(await loadAuth())) {
    return res.status(500).json({ success: false, message: 'Auth system failed to initialize.' });
  }
  const decoded = authJwt.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
  req.user = decoded;
  try {
    authCtrl.getMe(req, res);
  } catch (err) {
    console.error('[Auth] getMe error:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

export default function handler(req, res) {
  return app(req, res);
}
