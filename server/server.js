import app from './app.js';

// ─── Environment Validation ───────────────────────────────────────────────────
const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'RESEND_API_KEY', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error('[Server] Missing required environment variables:', missing.join(', '));
  console.error('[Server] Copy .env.example to .env and fill in values.');
  process.exit(1);
}

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.AUTH_PORT || 3002;

app.listen(PORT, () => {
  console.log(`[Auth Server] Running on http://localhost:${PORT}`);
  console.log(`[Auth Server] Health check: http://localhost:${PORT}/api/health`);
  console.log(`[Auth Server] Send OTP: POST http://localhost:${PORT}/api/auth/send-otp`);
  console.log(`[Auth Server] Verify OTP: POST http://localhost:${PORT}/api/auth/verify-otp`);
});
