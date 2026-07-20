import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function SignInPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
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
        showToast('success', 'Login successful!');
        login(res.token, res.user.email, res.user.name, res.user.id);
        localStorage.setItem('corp_otp_verified', 'true');
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
      <button onClick={() => navigate('/')} style={s.backBtn}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back to Home
      </button>
      <div style={s.card}>
        <div style={s.header}>
          <div style={s.iconWrap}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="8" fill="#e94560"/>
              <rect x="10" y="10" width="16" height="12" rx="2" fill="#fff"/>
              <path d="M14 26h8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 style={s.title}>Welcome Back</h1>
          <p style={s.subtitle}>Sign in to your HR Course account</p>
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
            <Link to="/sign-up" style={s.link}>Sign Up</Link>
          </p>
        </form>
      </div>

      {toast && (
        <div style={{ ...s.toast, background: toast.type === 'success' ? '#f0fdf4' : '#fef2f2', borderColor: toast.type === 'success' ? '#bbf7d0' : '#fecaca' }}>
          <span style={{ color: toast.type === 'success' ? '#16a34a' : '#dc2626', fontWeight: 600, fontSize: '0.85rem' }}>
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
    background: 'linear-gradient(135deg, #0c1628 0%, #1e3a5f 100%)',
    padding: '1rem',
  },
  backBtn: {
    position: 'fixed',
    top: '1.5rem',
    left: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px',
    color: 'rgba(255,255,255,0.8)',
    fontSize: '0.85rem',
    fontWeight: 600,
    fontFamily: 'Inter, sans-serif',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.2s',
    zIndex: 10,
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
  iconWrap: { marginBottom: '12px' },
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
  btn: {
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
  spin: {
    width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite',
  },
  footer: { textAlign: 'center', fontSize: '0.85rem', color: '#64748b', marginTop: '1.2rem' },
  link: { color: '#9B7A3E', fontWeight: 600, textDecoration: 'underline' },
  toast: {
    position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
    padding: '12px 24px', borderRadius: '10px', border: '1px solid',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 9999, maxWidth: '90vw', textAlign: 'center',
  },
};
