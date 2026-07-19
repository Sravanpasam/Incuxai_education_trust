import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CourseDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={s.page}>
      {/* Top Nav */}
      <nav style={s.nav}>
        <div style={s.navLeft}>
          <span style={s.logo}>IncuXai</span>
          <span style={s.navTitle}>HR Course Dashboard</span>
        </div>
        <div style={s.navRight}>
          <span style={s.userName}>{user?.name || user?.email}</span>
          <button onClick={handleLogout} style={s.logoutBtn}>Sign Out</button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={s.container}>
        {/* Welcome Banner */}
        <div style={s.banner}>
          <div>
            <h1 style={s.bannerTitle}>Welcome, {user?.name || 'Learner'}!</h1>
            <p style={s.bannerSub}>Your AI for HR learning journey starts here</p>
          </div>
          <div style={s.bannerIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
        </div>

        {/* Course Cards */}
        <div style={s.grid}>
          <div style={s.card} onClick={() => {}}>
            <div style={{ ...s.cardIcon, background: '#eef2ff' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <h3 style={s.cardTitle}>AI for HR</h3>
            <p style={s.cardDesc}>Learn how AI is transforming Human Resources \u2014 from recruitment to employee engagement.</p>
            <div style={s.cardMeta}>
              <span style={s.badge}>In Progress</span>
              <span style={s.metaText}>12 Modules</span>
            </div>
          </div>

          <div style={{ ...s.card, opacity: 0.55, cursor: 'not-allowed' }}>
            <div style={{ ...s.cardIcon, background: '#fef3c7' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h3 style={s.cardTitle}>AI for Teachers</h3>
            <p style={s.cardDesc}>Coming soon \u2014 AI-powered tools for educators to personalize learning experiences.</p>
            <div style={s.cardMeta}>
              <span style={{ ...s.badge, background: '#fef3c7', color: '#92400e' }}>Coming Soon</span>
            </div>
          </div>

          <div style={{ ...s.card, opacity: 0.55, cursor: 'not-allowed' }}>
            <div style={{ ...s.cardIcon, background: '#fce7f3' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3 style={s.cardTitle}>AI for Police</h3>
            <p style={s.cardDesc}>Coming soon \u2014 AI applications in law enforcement and public safety.</p>
            <div style={s.cardMeta}>
              <span style={{ ...s.badge, background: '#fce7f3', color: '#9d174d' }}>Coming Soon</span>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div style={s.profileSection}>
          <h2 style={s.sectionTitle}>Your Profile</h2>
          <div style={s.profileGrid}>
            <div style={s.profileItem}>
              <span style={s.profileLabel}>Work Email</span>
              <span style={s.profileValue}>{user?.email}</span>
            </div>
            <div style={s.profileItem}>
              <span style={s.profileLabel}>Name</span>
              <span style={s.profileValue}>{user?.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f1f5f9' },
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0.8rem 2rem', background: 'linear-gradient(135deg, #0c1628 0%, #16213e 100%)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)', position: 'sticky', top: 0, zIndex: 100,
  },
  navLeft: { display: 'flex', alignItems: 'center', gap: '1rem' },
  logo: { color: '#C5A059', fontWeight: 800, fontSize: '1.2rem' },
  navTitle: { color: '#fff', fontSize: '0.9rem', fontWeight: 500, opacity: 0.8 },
  navRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  userName: { color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600 },
  logoutBtn: {
    padding: '6px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(220,38,38,0.8)', color: '#fff', fontSize: '0.82rem', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
  },
  container: { maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem' },
  banner: {
    background: 'linear-gradient(135deg, #0c1628 0%, #1e3a5f 100%)',
    borderRadius: '16px', padding: '2rem 2.5rem', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem',
  },
  bannerTitle: { margin: 0, color: '#fff', fontSize: '1.5rem', fontWeight: 800 },
  bannerSub: { margin: '6px 0 0', color: '#a8a8b3', fontSize: '0.9rem' },
  bannerIcon: { opacity: 0.3 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' },
  card: {
    background: '#fff', borderRadius: '14px', padding: '1.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  cardIcon: {
    width: '48px', height: '48px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem',
  },
  cardTitle: { margin: '0 0 0.5rem', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' },
  cardDesc: { margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 },
  cardMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' },
  badge: {
    padding: '4px 10px', borderRadius: '20px', background: '#dcfce7',
    color: '#166534', fontSize: '0.72rem', fontWeight: 600,
  },
  metaText: { fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 },
  profileSection: {
    background: '#fff', borderRadius: '14px', padding: '1.5rem 2rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  sectionTitle: { margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' },
  profileGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  profileItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  profileLabel: { fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.5px' },
  profileValue: { fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 },
};
