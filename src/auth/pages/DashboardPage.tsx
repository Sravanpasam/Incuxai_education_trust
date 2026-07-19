import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => { logout(); nav('/verify-email'); };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.header}>
          <div style={s.avatar}>{user?.email?.[0]?.toUpperCase() || 'U'}</div>
          <h1 style={s.title}>Welcome!</h1>
          <p style={s.email}>{user?.email}</p>
        </div>
        <div style={s.body}>
          <div style={s.statusBox}>
            <div style={s.dot} />
            <span style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.9rem' }}>Authenticated</span>
          </div>
          <div style={s.row}><span style={s.lbl}>Verified At</span><span style={s.val}>{user?.verifiedAt ? new Date(user.verifiedAt).toLocaleString() : 'N/A'}</span></div>
          <div style={s.row}><span style={s.lbl}>Session</span><span style={s.val}>Active (24h)</span></div>
        </div>
        <div style={{ padding: '0 2rem 2rem' }}>
          <button onClick={handleLogout} style={s.logout}>Logout</button>
        </div>
      </div>
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
  },
  card: { width: '100%', maxWidth: '480px', background: '#fff', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', overflow: 'hidden' },
  header: { background: 'linear-gradient(135deg, #0c1628 0%, #16213e 100%)', padding: '2.5rem 2rem', textAlign: 'center' },
  avatar: { width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #e94560, #c62a40)', color: '#fff', fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' },
  title: { margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: 700 },
  email: { margin: '6px 0 0', color: '#a8a8b3', fontSize: '0.85rem' },
  body: { padding: '2rem' },
  statusBox: { display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, marginBottom: '1.5rem' },
  dot: { width: 10, height: 10, borderRadius: '50%', background: '#16a34a' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' },
  lbl: { color: '#64748b', fontSize: '0.85rem' },
  val: { color: '#1e293b', fontWeight: 600, fontSize: '0.85rem' },
  logout: { width: '100%', padding: 12, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 10, fontSize: '0.9rem', fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer' },
};
