import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendOtp, verifyOtp, resetPassword } from '../../../auth/services/authService';
import ietLogo from '../../../../picss/iet logo.png';

const OTP_LENGTH = 6;
const OTP_TIMER = 180;

type Step = 'email' | 'otp' | 'new-password';

export default function LmsForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [workEmail, setWorkEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(OTP_TIMER);
  const [resendCd, setResendCd] = useState(60);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (step !== 'otp' || timer <= 0) return;
    const id = setInterval(() => setTimer((p) => (p <= 1 ? 0 : p - 1)), 1000);
    return () => clearInterval(id);
  }, [step, timer]);

  useEffect(() => {
    if (step !== 'otp' || resendCd <= 0) return;
    const id = setInterval(() => setResendCd((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [step, resendCd]);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 5000);
  };

  const handleBack = () => {
    if (step === 'otp') setStep('email');
    else if (step === 'new-password') setStep('otp');
    else navigate('/lms/sign-in');
  };

  const handleSendOtp = async () => {
    if (!workEmail.trim()) { showToast('error', 'Please enter your work email.'); return; }
    setLoading(true);
    try {
      const res = await sendOtp(workEmail.trim().toLowerCase());
      if (res.success) {
        showToast('success', res.message || 'OTP sent to your work email!');
        setTimer(OTP_TIMER);
        setResendCd(60);
        setOtp(Array(OTP_LENGTH).fill(''));
        setStep('otp');
      } else {
        showToast('error', res.message);
      }
    } catch {
      showToast('error', 'Cannot reach authentication server. Make sure it is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== OTP_LENGTH) { showToast('error', 'Please enter the complete 6-digit code.'); return; }
    setLoading(true);
    try {
      const otpRes = await verifyOtp(workEmail.trim().toLowerCase(), code);
      if (!otpRes.success) { showToast('error', otpRes.message); setLoading(false); return; }
      showToast('success', 'OTP verified! Set your new password.');
      setStep('new-password');
    } catch {
      showToast('error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) { showToast('error', 'Password must be at least 8 characters.'); return; }
    if (newPassword !== confirmPassword) { showToast('error', 'Passwords do not match.'); return; }
    setLoading(true);
    try {
      const res = await resetPassword(workEmail.trim().toLowerCase(), newPassword);
      if (res.success) {
        showToast('success', 'Password reset successfully! Redirecting to sign in...');
        setTimeout(() => navigate('/lms/sign-in'), 2000);
      } else {
        showToast('error', res.message);
      }
    } catch {
      showToast('error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendCd(60);
    setTimer(OTP_TIMER);
    setOtp(Array(OTP_LENGTH).fill(''));
    try {
      const res = await sendOtp(workEmail.trim().toLowerCase());
      if (res.success) showToast('success', `New code sent to ${workEmail}`);
      else showToast('error', res.message);
    } catch {
      showToast('error', 'Failed to resend code.');
    }
  };

  const handleDigit = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return;
    const n = [...otp]; n[i] = v.slice(-1); setOtp(n);
    if (v && i < OTP_LENGTH - 1) refs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const d = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const n = Array(OTP_LENGTH).fill('');
    d.split('').forEach((c, i) => { n[i] = c; });
    setOtp(n);
    if (d.length) refs.current[Math.min(d.length, OTP_LENGTH - 1)]?.focus();
  };

  const fmt = (sec: number) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;

  const pwStrong = newPassword.length >= 8 && /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) && /[0-9]/.test(newPassword) && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(newPassword);

  return (
    <div style={s.page}>
      <style>{`@keyframes fpSpin{to{transform:rotate(360deg)}}`}</style>
      <button onClick={handleBack} style={s.backBtn}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        {step === 'email' ? 'Back to Sign In' : 'Back'}
      </button>

      <div style={s.card}>
        <div style={s.header}>
          <img src={ietLogo} alt="IncuXAI Education Trust" style={{ height: '52px', width: 'auto', borderRadius: '10px', objectFit: 'contain', margin: '0 auto 12px', display: 'block' }} />
          <h1 style={s.title}>Reset Password</h1>
          <p style={s.subtitle}>
            {step === 'email' && 'Enter your work email to receive a verification code'}
            {step === 'otp' && `Enter the 6-digit code sent to ${workEmail}`}
            {step === 'new-password' && 'Create a strong new password'}
          </p>
        </div>

        {step === 'email' && (
          <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }} style={s.form}>
            <label style={s.label}>Work Email</label>
            <input
              type="email"
              value={workEmail}
              onChange={(e) => setWorkEmail(e.target.value)}
              placeholder="you@company.com"
              style={s.input}
              autoFocus
              disabled={loading}
            />
            <button type="submit" style={{ ...s.btn, opacity: loading || !workEmail.trim() ? 0.6 : 1 }} disabled={loading || !workEmail.trim()}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={s.spin} /> Sending...
                </span>
              ) : 'Send Verification Code'}
            </button>
            <p style={s.footer}>
              Remember your password? <Link to="/lms/sign-in" style={s.link}>Sign In</Link>
            </p>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} style={s.form}>
            <label style={s.label}>Enter 6-digit OTP</label>
            <div style={s.otpRow}>
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { refs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleDigit(i, e.target.value)}
                  onKeyDown={(e) => handleKey(i, e)}
                  onPaste={handlePaste}
                  style={{ ...s.otpBox, borderColor: d ? '#C5A059' : 'rgba(12,22,40,0.12)' }}
                  disabled={loading}
                />
              ))}
            </div>
            <div style={s.timerRow}>
              {timer > 0
                ? <>Code expires in <strong style={{ color: '#0c1628' }}>{fmt(timer)}</strong></>
                : <span style={{ color: '#EF4444', fontWeight: 600 }}>Code expired</span>}
            </div>
            <button type="submit" style={{ ...s.btn, opacity: loading || timer === 0 ? 0.6 : 1, marginTop: '1rem' }} disabled={loading || timer === 0}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={s.spin} /> Verifying...
                </span>
              ) : 'Verify Code'}
            </button>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
              <button type="button" onClick={handleResend} disabled={resendCd > 0}
                style={{ ...s.linkBtn, opacity: resendCd > 0 ? 0.5 : 1, cursor: resendCd > 0 ? 'not-allowed' : 'pointer' }}>
                {resendCd > 0 ? `Resend in ${fmt(resendCd)}` : 'Resend Code'}
              </button>
              <button type="button" onClick={() => setStep('email')} style={s.linkBtn}>Change Email</button>
            </div>
          </form>
        )}

        {step === 'new-password' && (
          <form onSubmit={handleResetPassword} style={s.form}>
            <label style={s.label}>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Create a strong password"
              style={s.input}
              autoFocus
              disabled={loading}
            />
            <label style={{ ...s.label, marginTop: '1rem' }}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              style={s.input}
              disabled={loading}
            />
            {newPassword.length > 0 && (
              <div style={s.pwCheck}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 12px' }}>
                  {[
                    { ok: newPassword.length >= 8, label: 'At least 8 characters' },
                    { ok: /[A-Z]/.test(newPassword), label: 'One uppercase letter' },
                    { ok: /[a-z]/.test(newPassword), label: 'One lowercase letter' },
                    { ok: /[0-9]/.test(newPassword), label: 'One number' },
                    { ok: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(newPassword), label: 'One special character' },
                  ].map((item) => (
                    <span key={item.label} style={{ fontSize: '0.72rem', color: item.ok ? '#16a34a' : '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontWeight: 700 }}>{item.ok ? '\u2713' : '\u25CB'}</span> {item.label}
                    </span>
                  ))}
                </div>
                {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                  <span style={{ fontSize: '0.72rem', color: '#EF4444', marginTop: 4, display: 'block' }}>Passwords do not match.</span>
                )}
              </div>
            )}
            <button type="submit" style={{ ...s.btn, opacity: loading || !pwStrong || newPassword !== confirmPassword ? 0.6 : 1, marginTop: '1rem' }}
              disabled={loading || !pwStrong || newPassword !== confirmPassword}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={s.spin} /> Resetting...
                </span>
              ) : 'Reset Password'}
            </button>
          </form>
        )}
      </div>

      {toast && (
        <div style={{ ...s.toast, background: toast.type === 'success' ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.12)', borderColor: toast.type === 'success' ? 'rgba(22,163,74,0.3)' : 'rgba(220,38,38,0.3)' }}>
          <span style={{ color: toast.type === 'success' ? '#16a34a' : '#EF4444', fontWeight: 600, fontSize: '0.85rem' }}>
            {toast.type === 'success' ? '\u2713' : '\u2715'} {toast.msg}
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8f7f3',
    padding: '1rem',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  backBtn: {
    position: 'fixed',
    top: '1.5rem',
    left: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 18px',
    background: '#ffffff',
    border: '1px solid rgba(12, 22, 40, 0.12)',
    borderRadius: '99px',
    color: '#0c1628',
    fontSize: '0.85rem',
    fontWeight: 600,
    fontFamily: 'Inter, sans-serif',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 10px rgba(12,22,40,0.05)',
    zIndex: 10,
  },
  card: {
    width: '100%',
    maxWidth: '480px',
    background: '#ffffff',
    borderRadius: '16px',
    border: '1px solid rgba(12, 22, 40, 0.08)',
    boxShadow: '0 12px 40px rgba(12, 22, 40, 0.08)',
    overflow: 'hidden',
  },
  header: {
    background: 'linear-gradient(135deg, #0c1628 0%, #1e3a5f 100%)',
    padding: '2.5rem 2rem 2rem',
    textAlign: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  title: { margin: 0, color: '#ffffff', fontSize: '1.35rem', fontWeight: 700, fontFamily: 'Plus Jakarta Sans, sans-serif' },
  subtitle: { margin: '8px 0 0', color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem' },
  form: { padding: '1.8rem 2rem 2rem' },
  label: { display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.82rem', color: '#1e293b' },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1.5px solid rgba(12, 22, 40, 0.12)',
    borderRadius: '10px',
    fontSize: '0.92rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
    background: '#f8f7f3',
    color: '#0c1628',
  },
  btn: {
    width: '100%',
    marginTop: '1.5rem',
    padding: '13px',
    background: 'linear-gradient(135deg, #9B7A3E, #7D6334)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '99px',
    fontSize: '0.95rem',
    fontWeight: 700,
    fontFamily: 'Inter, sans-serif',
    cursor: 'pointer',
    boxShadow: '0 6px 20px -4px rgba(155, 122, 62, 0.35)',
  },
  spin: {
    width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#ffffff', borderRadius: '50%', animation: 'fpSpin 0.6s linear infinite',
  },
  otpRow: { display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '0.5rem' },
  otpBox: {
    width: '48px', height: '56px', textAlign: 'center', fontSize: '1.5rem', fontWeight: 700,
    fontFamily: "'Courier New', monospace", border: '1.5px solid rgba(12, 22, 40, 0.12)', borderRadius: '10px',
    outline: 'none', background: '#f8f7f3', color: '#0c1628',
  },
  timerRow: { textAlign: 'center', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' },
  pwCheck: {
    padding: '12px 14px',
    background: '#f8f7f3',
    border: '1px solid rgba(12, 22, 40, 0.08)',
    borderRadius: '8px',
    marginTop: '0.75rem',
  },
  footer: { textAlign: 'center', fontSize: '0.85rem', color: '#64748b', marginTop: '1.2rem' },
  link: { color: '#9B7A3E', fontWeight: 600, textDecoration: 'none' },
  linkBtn: {
    background: 'none', border: 'none', color: '#9B7A3E', fontWeight: 600,
    fontSize: '0.85rem', fontFamily: 'Inter, sans-serif', textDecoration: 'underline', cursor: 'pointer',
  },
  toast: {
    position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
    padding: '12px 24px', borderRadius: '10px', border: '1px solid',
    backdropFilter: 'blur(12px)', zIndex: 9999, maxWidth: '90vw', textAlign: 'center',
  },
};
