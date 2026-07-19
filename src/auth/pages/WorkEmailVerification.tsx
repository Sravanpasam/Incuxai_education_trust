import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateWorkEmail } from '../validation/emailValidation';
import { sendOtp } from '../services/authService';

export default function WorkEmailVerification() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const navigate = useNavigate();

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const { valid, error } = validateWorkEmail(email);
    if (!valid) {
      showToast('error', error!);
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp(email.trim().toLowerCase());

      if (res.success) {
        showToast('success', res.message);
        localStorage.setItem('pending_auth_email', email.trim().toLowerCase());
        setTimeout(() => navigate('/verify-otp'), 1000);
      } else {
        showToast('error', res.message);
      }
    } catch {
      showToast('error', 'Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.logoWrap}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="8" fill="#e94560"/>
              <path d="M10 18l5 5 11-11" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={s.title}>Verify Your Work Email</h1>
          <p style={s.subtitle}>We'll send a verification code to your business email</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={s.form}>
          <label style={s.label}>Work Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            style={s.input}
            autoFocus
            disabled={loading}
          />
          <p style={s.hint}>
            Only work/business emails are accepted. Personal emails (Gmail, Yahoo, Outlook, etc.) are not allowed.
          </p>

          <button type="submit" style={{ ...s.button, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? (
              <span style={s.spinnerRow}>
                <span style={s.spinner} />
                Sending...
              </span>
            ) : (
              'Verify Email'
            )}
          </button>
        </form>
      </div>

      {/* Toast */}
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
  logoWrap: { marginBottom: '12px' },
  title: { margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: 800 },
  subtitle: { margin: '8px 0 0', color: '#a8a8b3', fontSize: '0.85rem' },
  form: { padding: '2rem' },
  label: { display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.85rem', color: '#1e293b' },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '1rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
  },
  hint: { marginTop: '6px', fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 },
  button: {
    width: '100%',
    marginTop: '1.5rem',
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
  spinnerRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
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
