import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyOtp, sendOtp } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const OTP_LENGTH = 6;
const OTP_TIMER = 180;

export default function VerifyOTP() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [timer, setTimer] = useState(OTP_TIMER);
  const [resendCd, setResendCd] = useState(60);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { verify } = useAuth();

  const email = localStorage.getItem('pending_auth_email') || '';

  useEffect(() => {
    if (!email) navigate('/verify-email');
  }, [email, navigate]);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((p) => (p <= 1 ? 0 : p - 1)), 1000);
    return () => clearInterval(id);
  }, [timer]);

  useEffect(() => {
    if (resendCd <= 0) return;
    const id = setInterval(() => setResendCd((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [resendCd]);

  const show = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 5000);
  };

  const digit = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return;
    const n = [...otp];
    n[i] = v.slice(-1);
    setOtp(n);
    if (v && i < OTP_LENGTH - 1) refs.current[i + 1]?.focus();
  };

  const key = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const paste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const d = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const n = Array(OTP_LENGTH).fill('');
    d.split('').forEach((c, i) => { n[i] = c; });
    setOtp(n);
    if (d.length) refs.current[Math.min(d.length, OTP_LENGTH - 1)]?.focus();
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== OTP_LENGTH) { show('error', 'Please enter the complete 6-digit code.'); return; }
    setLoading(true);
    try {
      const res = await verifyOtp(email, code);
      if (res.success && res.token) {
        show('success', 'Verified! Redirecting...');
        verify(res.token, email);
        setTimeout(() => navigate('/dashboard'), 1200);
      } else {
        show('error', res.message);
      }
    } catch {
      show('error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setResendCd(60);
    setTimer(OTP_TIMER);
    setOtp(Array(OTP_LENGTH).fill(''));
    try {
      const res = await sendOtp(email);
      if (res.success) show('success', `New code sent to ${email}`);
      else show('error', res.message);
    } catch {
      show('error', 'Failed to resend code.');
    }
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.header}>
          <div style={s.iconWrap}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="#9B7A3E"/>
              <rect x="6" y="10" width="8" height="12" rx="2" fill="#fff"/>
              <rect x="18" y="10" width="8" height="12" rx="2" fill="#fff"/>
            </svg>
          </div>
          <h1 style={s.title}>Verify OTP</h1>
          <p style={s.subtitle}>Enter the 6-digit code sent to</p>
          <p style={s.email}>{email}</p>
        </div>

        <form onSubmit={submit} style={s.form}>
          <div style={s.otpRow}>
            {otp.map((d, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => digit(i, e.target.value)}
                onKeyDown={(e) => key(i, e)}
                onPaste={paste}
                style={{ ...s.otpBox, borderColor: d ? '#9B7A3E' : '#e2e8f0' }}
                disabled={loading}
              />
            ))}
          </div>

          <div style={s.timerRow}>
            {timer > 0
              ? <>Code expires in <strong>{fmt(timer)}</strong></>
              : <span style={{ color: '#dc2626', fontWeight: 600 }}>Code expired</span>}
          </div>

          <button type="submit" style={{ ...s.btn, opacity: loading || timer === 0 ? 0.6 : 1 }} disabled={loading || timer === 0}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={s.spin} /> Verifying...
              </span>
            ) : 'Verify OTP'}
          </button>

          <div style={s.links}>
            <button type="button" onClick={resend} disabled={resendCd > 0}
              style={{ ...s.linkBtn, opacity: resendCd > 0 ? 0.5 : 1, cursor: resendCd > 0 ? 'not-allowed' : 'pointer' }}>
              {resendCd > 0 ? `Resend in ${fmt(resendCd)}` : 'Resend Code'}
            </button>
            <button type="button" onClick={() => navigate('/verify-email')} style={s.linkBtn}>
              Change Email
            </button>
          </div>
        </form>
      </div>

      {toast && (
        <div style={{ ...s.toast, background: toast.type === 'success' ? '#f0fdf4' : '#fef2f2', borderColor: toast.type === 'success' ? '#bbf7d0' : '#fecaca' }}>
          <span style={{ color: toast.type === 'success' ? '#16a34a' : '#dc2626', fontWeight: 600, fontSize: '0.85rem' }}>
            {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
          </span>
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0c1628 0%, #1e3a5f 100%)',
    padding: '1rem',
    position: 'relative',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    overflow: 'hidden',
  },
  header: {
    background: 'linear-gradient(135deg, #0c1628 0%, #16213e 100%)',
    padding: '2.5rem 2rem 2rem',
    textAlign: 'center',
  },
  iconWrap: { marginBottom: '10px' },
  title: { margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: 800 },
  subtitle: { margin: '8px 0 0', color: '#a8a8b3', fontSize: '0.85rem' },
  email: { margin: '2px 0 0', color: '#e94560', fontSize: '0.9rem', fontWeight: 700 },
  form: { padding: '2rem' },
  otpRow: { display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '1rem' },
  otpBox: {
    width: '48px',
    height: '56px',
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 700,
    fontFamily: "'Courier New', monospace",
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    outline: 'none',
    background: '#f8fafc',
  },
  timerRow: { textAlign: 'center', fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' },
  btn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #9B7A3E 0%, #7D6334 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: 700,
    fontFamily: 'Inter, sans-serif',
    cursor: 'pointer',
  },
  spin: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
  },
  links: { display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#9B7A3E',
    fontWeight: 600,
    fontSize: '0.85rem',
    fontFamily: 'Inter, sans-serif',
    textDecoration: 'underline',
  },
  toast: {
    position: 'fixed',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '12px 24px',
    borderRadius: '10px',
    border: '1px solid',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    zIndex: 9999,
    maxWidth: '90vw',
    textAlign: 'center',
  },
};
