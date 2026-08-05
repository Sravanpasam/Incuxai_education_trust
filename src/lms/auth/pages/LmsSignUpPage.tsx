import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ietLogo from '../../../../picss/iet logo.png';
import { validateWorkEmail } from '../../../auth/validation/emailValidation';
import { validateCompanyEmail } from '../../../auth/validation/companyEmailValidation';
import { registerUser } from '../../../auth/services/authService';
import { useLmsAuth } from '../context/LmsAuthContext';
import { useAuth } from '../../../auth/context/AuthContext';
import RegistrationSuccessPopup from '../../../auth/components/RegistrationSuccessPopup';
import { HR_ROLES } from '../../../auth/constants/hrRoles';

interface FormErrors {
  fullName?: string;
  workEmail?: string;
  personalEmail?: string;
  phone?: string;
  companyName?: string;
  location?: string;
  role?: string;
  password?: string;
  confirmPassword?: string;
}

interface PwChecks {
  length: boolean;
  upper: boolean;
  lower: boolean;
  number: boolean;
  special: boolean;
}

function getPasswordChecks(pw: string): PwChecks {
  return {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pw),
  };
}

function isPasswordStrong(pw: string): boolean {
  const c = getPasswordChecks(pw);
  return c.length && c.upper && c.lower && c.number && c.special;
}

export default function LmsSignUpPage() {
  const navigate = useNavigate();
  const { login: lmsLogin } = useLmsAuth();
  const { login: mainLogin } = useAuth();
  const [showPopup, setShowPopup] = useState(false);

  const handleBack = () => navigate('/');

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const [form, setForm] = useState({
    fullName: '',
    workEmail: '',
    personalEmail: '',
    phone: '',
    companyName: '',
    location: '',
    role: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 5000);
  };

  const validateInfo = (): boolean => {
    const e: FormErrors = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required.';
    if (!form.workEmail.trim()) {
      e.workEmail = 'Work email is required.';
    } else {
      const { valid, error } = validateWorkEmail(form.workEmail);
      if (!valid) {
        e.workEmail = error;
      } else {
        const companyCheck = validateCompanyEmail(form.workEmail, form.companyName);
        if (!companyCheck.valid) e.workEmail = companyCheck.error;
      }
    }
    if (!form.personalEmail.trim()) {
      e.personalEmail = 'Personal email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.personalEmail)) {
      e.personalEmail = 'Invalid email format.';
    }
    if (!form.phone.trim()) {
      e.phone = 'Phone number is required.';
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(form.phone)) {
      e.phone = 'Please enter a valid phone number.';
    }
    if (!form.companyName.trim()) e.companyName = 'Company name is required.';
    if (!form.location.trim()) e.location = 'Location is required.';
    if (!form.role) e.role = 'Please select your HR role.';
    if (!form.password) {
      e.password = 'Password is required.';
    } else if (!isPasswordStrong(form.password)) {
      e.password = 'Password does not meet all strength requirements.';
    }
    if (form.password !== form.confirmPassword) {
      e.confirmPassword = 'Passwords do not match.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreateAccount = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateInfo()) return;
    setLoading(true);
    try {
      const res = await registerUser({
        fullName: form.fullName.trim(),
        personalEmail: form.personalEmail.trim().toLowerCase(),
        phone: form.phone.trim(),
        workEmail: form.workEmail.trim().toLowerCase(),
        companyName: form.companyName.trim(),
        location: form.location.trim(),
        role: form.role,
        password: form.password,
      });

      if (res.success && res.token && res.user) {
        lmsLogin(res.token, res.user.email, res.user.name, res.user.id);
        mainLogin(res.token, res.user.email, res.user.name, res.user.id);
        setShowPopup(true);
      } else {
        showToast('error', res.message || 'Failed to create account. Please try again.');
      }
    } catch (err: any) {
      console.error('[LmsSignUp] register error:', err);
      showToast('error', err?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const pwChecks = getPasswordChecks(form.password);
  const pwItems: { key: keyof PwChecks; label: string }[] = [
    { key: 'length', label: 'At least 8 characters' },
    { key: 'upper', label: 'One uppercase letter (A-Z)' },
    { key: 'lower', label: 'One lowercase letter (a-z)' },
    { key: 'number', label: 'One number (0-9)' },
    { key: 'special', label: 'One special character (!@#$%^&*...)' },
  ];

  const handlePopupComplete = () => {
    setShowPopup(false);
    window.history.replaceState(null, '', '/course-dashboard');
    navigate('/course-dashboard', { replace: true });
  };

  return (
    <div style={s.page}>
      <style>{`
        @keyframes lmsSpin2{to{transform:rotate(360deg)}}
      `}</style>
      <button onClick={handleBack} style={s.backBtn}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back to Home
      </button>
      <div style={s.card}>
        <div style={s.header}>
          <img src={ietLogo} alt="IncuXAI Education Trust" style={{ height: '52px', width: 'auto', borderRadius: '10px', objectFit: 'contain', margin: '0 auto 12px', display: 'block' }} />
          <h1 style={s.title}>Join Learning Hub</h1>
          <p style={s.subtitle}>Create your account</p>
        </div>

        <form onSubmit={handleCreateAccount} style={s.form}>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Full Name *</label>
              <input type="text" value={form.fullName} onChange={(e) => update('fullName', e.target.value)}
                placeholder="John Doe" style={s.input} />
              {errors.fullName && <span style={s.error}>{errors.fullName}</span>}
            </div>
            <div style={s.field}>
              <label style={s.label}>Work Email *</label>
              <input type="email" value={form.workEmail} onChange={(e) => update('workEmail', e.target.value)}
                placeholder="you@company.com" style={s.input} />
              {errors.workEmail && <span style={s.error}>{errors.workEmail}</span>}
              <span style={s.hint}>Only work/business emails are accepted and must match your company.</span>
            </div>
          </div>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Personal Email *</label>
              <input type="email" value={form.personalEmail} onChange={(e) => update('personalEmail', e.target.value)}
                placeholder="john@gmail.com" style={s.input} />
              {errors.personalEmail && <span style={s.error}>{errors.personalEmail}</span>}
            </div>
            <div style={s.field}>
              <label style={s.label}>Phone Number *</label>
              <input type="text" value={form.phone} onChange={(e) => update('phone', e.target.value)}
                placeholder="+91 98765 43210" style={s.input} />
              {errors.phone && <span style={s.error}>{errors.phone}</span>}
            </div>
          </div>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Company Name *</label>
              <input type="text" value={form.companyName} onChange={(e) => update('companyName', e.target.value)}
                placeholder="e.g. Microsoft" style={s.input} />
              {errors.companyName && <span style={s.error}>{errors.companyName}</span>}
            </div>
            <div style={s.field}>
              <label style={s.label}>Location *</label>
              <input type="text" value={form.location} onChange={(e) => update('location', e.target.value)}
                placeholder="City, State" style={s.input} />
              {errors.location && <span style={s.error}>{errors.location}</span>}
            </div>
          </div>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Role *</label>
              <select value={form.role} onChange={(e) => update('role', e.target.value)} style={s.input}>
                <option value="">Select Your HR Role</option>
                {HR_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.role && <span style={s.error}>{errors.role}</span>}
            </div>
          </div>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Password *</label>
              <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)}
                placeholder="Create a strong password" style={s.input} />
              {errors.password && <span style={s.error}>{errors.password}</span>}
            </div>
            <div style={s.field}>
              <label style={s.label}>Confirm Password *</label>
              <input type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)}
                placeholder="Re-enter password" style={s.input} />
              {errors.confirmPassword && <span style={s.error}>{errors.confirmPassword}</span>}
            </div>
          </div>
          {form.password.length > 0 && (
            <div style={s.pwCheckBox}>
              <span style={{ fontWeight: 600, fontSize: '0.78rem', color: '#1e293b', marginBottom: 4, display: 'block' }}>
                Password Requirements
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 12px' }}>
                {pwItems.map((item) => (
                  <span key={item.key} style={{ fontSize: '0.72rem', color: pwChecks[item.key] ? '#16a34a' : '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{pwChecks[item.key] ? '\u2713' : '\u25CB'}</span>
                    {item.label}
                  </span>
                ))}
              </div>
              {form.confirmPassword.length > 0 && form.password !== form.confirmPassword && (
                <span style={{ fontSize: '0.72rem', color: '#f87171', marginTop: 4, display: 'block' }}>
                  Passwords do not match.
                </span>
              )}
            </div>
          )}
          <button type="submit" style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={s.spin} /> Creating Account...
              </span>
            ) : 'Create Account'}
          </button>
          <p style={s.footer}>
            Already have an account?{' '}
            <Link to="/lms/sign-in" style={s.link}>Sign In</Link>
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

      <RegistrationSuccessPopup
        visible={showPopup}
        onComplete={handlePopupComplete}
      />
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
    maxWidth: '600px',
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
  form: { padding: '1.5rem 2rem 2rem' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
  field: { display: 'flex', flexDirection: 'column' },
  label: { display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.8rem', color: '#1e293b' },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1.5px solid rgba(12, 22, 40, 0.12)',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
    background: '#f8f7f3',
    color: '#0c1628',
  },
  error: { fontSize: '0.72rem', color: '#EF4444', marginTop: '2px' },
  hint: { marginTop: '4px', fontSize: '0.72rem', color: '#64748b', lineHeight: 1.35 },
  pwCheckBox: {
    padding: '12px 14px',
    background: '#f8f7f3',
    border: '1px solid rgba(12, 22, 40, 0.08)',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  btn: {
    width: '100%',
    marginTop: '1.2rem',
    padding: '13px',
    background: 'linear-gradient(135deg, #9B7A3E, #7D6334)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '99px',
    fontSize: '1rem',
    fontWeight: 700,
    fontFamily: 'Inter, sans-serif',
    cursor: 'pointer',
    boxShadow: '0 6px 20px -4px rgba(155, 122, 62, 0.35)',
  },
  spin: {
    width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#ffffff', borderRadius: '50%', animation: 'lmsSpin2 0.6s linear infinite',
  },
  footer: { textAlign: 'center', fontSize: '0.85rem', color: '#64748b' },
  link: { color: '#9B7A3E', fontWeight: 600, textDecoration: 'none' },
  toast: {
    position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
    padding: '12px 24px', borderRadius: '10px', border: '1px solid',
    backdropFilter: 'blur(12px)', zIndex: 9999, maxWidth: '90vw', textAlign: 'center',
  },
};
