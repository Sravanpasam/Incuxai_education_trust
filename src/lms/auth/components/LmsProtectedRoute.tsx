import { Navigate } from 'react-router-dom';
import { useLmsAuth } from '../context/LmsAuthContext';

export default function LmsProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useLmsAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f1117', color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem' }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/lms/sign-in" replace />;
  }

  return <>{children}</>;
}
