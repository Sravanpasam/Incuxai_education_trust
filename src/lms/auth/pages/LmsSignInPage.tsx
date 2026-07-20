import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../../auth/services/authService';
import { useLmsAuth } from '../context/LmsAuthContext';

export default function LmsSignInPage() {
  const navigate = useNavigate();
  const { login } = useLmsAuth();
  const [workEmail, setWorkEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!workEmail.trim() || !password.trim()) {
      showToast('error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await loginUser(workEmail.trim().toLowerCase(), password);
      if (res.success && res.token && res.user) {
        showToast('success', 'Signed in to Learning Hub!');
        login(res.token, res.user.email, res.user.name, res.user.id);
        setTimeout(() => navigate('/course-dashboard'), 800);
      } else {
        showToast('error', res.message || 'Invalid work email or password.');
      }
    } catch (err: any) {
      if (err?.name === 'TypeError' && err?.message?.includes('Failed to fetch')) {
        showToast('error', 'Cannot reach the authentication server. Make sure the server is running (npm run dev:server).');
      } else {
        showToast('error', 'Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <style>{`
        @keyframes lmsSpin{to{transform:rotate(360deg)}}
      `}</style>
      <button onClick={() => navigate('/')} style={s.backBtn}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back to Home
      </button>
      <div style={s.card}>
        <div style={s.header}>
          <div style={s.brandIcon}>I</div>
          <h1 style={s.title}>IncuXAI Learning Hub</h1>
          <p style={s.subtitle}>Sign in to continue your course</p>
        </div>

        <form onSubmit={handleSubmit} style={s.form}>
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

          <label style={{ ...s.label, marginTop: '1rem' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={s.input}
            disabled={loading}
          />

          <button type="submit" style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={s.spin} /> Signing in...
              </span>
            ) : 'Sign In'}
          </button>

          <p style={s.footer}>
            Don't have an account?{' '}
            <Link to="/lms/sign-up" style={s.link}>Sign Up</Link>
          </p>
        </form>
      </div>

      {toast && (
        <div style={{ ...s.toast, background: toast.type === 'success' ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.12)', borderColor: toast.type === 'success' ? 'rgba(22,163,74,0.3)' : 'rgba(220,38,38,0.3)' }}>
          <span style={{ color: toast.type === 'success' ? '#4ade80' : '#f87171', fontWeight: 600, fontSize: '0.85rem' }}>
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
    maxWidth: '420px',
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
  brandIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #9B7A3E, #7D6334)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontWeight: 800,
    fontSize: '1.3rem',
    margin: '0 auto 14px',
    boxShadow: '0 4px 14px rgba(155, 122, 62, 0.35)',
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
    borderTopColor: '#ffffff', borderRadius: '50%', animation: 'lmsSpin 0.6s linear infinite',
  },
  footer: { textAlign: 'center', fontSize: '0.85rem', color: '#64748b', marginTop: '1.2rem' },
  link: { color: '#9B7A3E', fontWeight: 600, textDecoration: 'none' },
  toast: {
    position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
    padding: '12px 24px', borderRadius: '10px', border: '1px solid',
    backdropFilter: 'blur(12px)', zIndex: 9999, maxWidth: '90vw', textAlign: 'center',
  },
};
