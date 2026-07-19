import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/context/AuthContext';
import ProtectedRoute from './auth/components/ProtectedRoute';
import WorkEmailVerification from './auth/pages/WorkEmailVerification';
import VerifyOTP from './auth/pages/VerifyOTP';
import DashboardPage from './auth/pages/DashboardPage';
import CourseDashboard from './auth/pages/CourseDashboard';
import SignUpPage from './auth/pages/SignUpPage';
import SignInPage from './auth/pages/SignInPage';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

window.addEventListener('error', (event) => {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 2rem; background: #fffbeb; border: 2px solid #f59e0b; color: #78350f; font-family: system-ui; border-radius: 16px; margin: 2rem;">
        <h2>System Diagnostics Alert</h2>
        <pre style="background: rgba(0,0,0,0.04); padding: 1rem; border-radius: 8px; font-size: 0.82rem; overflow-x: auto;">${event.message}\n${event.error?.stack || ''}</pre>
        <button onclick="localStorage.clear(); location.reload();" style="margin-top:1rem;padding:0.5rem 1rem;background:#d97706;color:#fff;border:none;border-radius:8px;cursor:pointer;">Reset App</button>
      </div>`;
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/verify-email" element={<WorkEmailVerification />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/course-dashboard" element={<ProtectedRoute><CourseDashboard /></ProtectedRoute>} />
            <Route path="*" element={<App />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
