import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ietLogo from '../../../../picss/iet logo.png';
import { validateWorkEmail } from '../../../auth/validation/emailValidation';
import { validateCompanyEmail } from '../../../auth/validation/companyEmailValidation';
import { sendOtp, verifyOtp, registerUser } from '../../../auth/services/authService';

const ROLES = ['Executive', 'Manager', 'Developer', 'Consultant', 'HR Manager', 'Team Lead', 'Other'];
const OTP_LENGTH = 6;
const OTP_TIMER = 180;

type Step = 'info' | 'otp';

interface FormErrors {
  fullName?: string;
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
  const [step, setStep] = useState<Step>('info');

  const handleBack = () => {
    if (step === 'otp') setStep('info');
    else navigate('/');
  };
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [workEmail, setWorkEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(OTP_TIMER);
  const [resendCd, setResendCd] = useState(60);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const [form, setForm] = useState({
    fullName: '',
    personalEmail: '',
    phone: '',
    companyName: '',
    location: '',
    role: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

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

  const validateInfo = (): boolean => {
    const e: FormErrors = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required.';
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
    if (!form.role) e.role = 'Please select a role.';
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

  const handleInfoSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateInfo()) return;
    setStep('otp');
  };

  const handleSendOtp = async () => {
    const { valid, error } = validateWorkEmail(workEmail);
    if (!valid) {
      showToast('error', error!);
      return;
    }
    const companyCheck = validateCompanyEmail(workEmail, form.companyName);
    if (!companyCheck.valid) {
      showToast('error', companyCheck.error!);
      return;
    }
    setLoading(true);
    try {
      const res = await sendOtp(workEmail.trim().toLowerCase());
      if (res.success) {
        showToast('success', res.message || 'OTP sent successfully!');
        setTimer(OTP_TIMER);
        setResendCd(60);
        setOtp(Array(OTP_LENGTH).fill(''));
      } else {
        showToast('error', res.message);
      }
    } catch (err: any) {
      if (err?.name === 'TypeError' && err?.message?.includes('Failed to fetch')) {
        showToast('error', 'Cannot reach the authentication server. Make sure the server is running (npm run dev:server).');
      } else {
        showToast('error', 'Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== OTP_LENGTH) {
      showToast('error', 'Please enter the complete 6-digit code.');
      return;
    }
    setLoading(true);
    try {
      const otpRes = await verifyOtp(workEmail.trim().toLowerCase(), code);
      if (!otpRes.success) {
        showToast('error', otpRes.message);
        setLoading(false);
        return;
      }
      const regRes = await registerUser({
        fullName: form.fullName,
        personalEmail: form.personalEmail,
        phone: form.phone,
        workEmail: workEmail.trim().toLowerCase(),
        companyName: form.companyName,
        location: form.location,
        role: form.role,
        password: form.password,
      });
      if (regRes.success) {
        showToast('success', 'Account created. Please sign in to continue.');
        setTimeout(() => navigate('/lms/sign-in'), 1500);
      } else {
        showToast('error', regRes.message || 'Failed to create account. Please try again.');
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
    const n = [...otp];
    n[i] = v.slice(-1);
    setOtp(n);
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

  return (
    <div style={s.page}>
      <style>{`
        @keyframes lmsSpin2{to{transform:rotate(360deg)}}
      `}</style>
      <button onClick={handleBack} style={s.backBtn}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        {step === 'otp' ? 'Back to Details' : 'Back to Home'}
      </button>
      <div style={s.card}>
        <div style={s.header}>
          <img src={ietLogo} alt="IncuXAI Education Trust" style={{ height: '52px', width: 'auto', borderRadius: '10px', objectFit: 'contain', margin: '0 auto 12px', display: 'block' }} />
          <h1 style={s.title}>Join Learning Hub</h1>
          <p style={s.subtitle}>
            {step === 'info'
              ? 'Step 1 of 2 \u2014 Enter your personal details'
              : 'Step 2 of 2 \u2014 Verify your work email'
            }
          </p>
        </div>

        {step === 'info' && (
          <form onSubmit={handleInfoSubmit} style={s.form}>
            <div style={s.row}>
              <div style={s.field}>
                <label style={s.label}>Full Name *</label>
                <input type="text" value={form.fullName} onChange={(e) => update('fullName', e.target.value)}
                  placeholder="John Doe" style={s.input} />
                {errors.fullName && <span style={s.error}>{errors.fullName}</span>}
              </div>
              <div style={s.field}>
                <label style={s.label}>Personal Email *</label>
                <input type="email" value={form.personalEmail} onChange={(e) => update('personalEmail', e.target.value)}
                  placeholder="john@gmail.com" style={s.input} />
                {errors.personalEmail && <span style={s.error}>{errors.personalEmail}</span>}
              </div>
            </div>
            <div style={s.row}>
              <div style={s.field}>
                <label style={s.label}>Phone Number *</label>
                <input type="text" value={form.phone} onChange={(e) => update('phone', e.target.value)}
                  placeholder="+91 98765 43210" style={s.input} />
                {errors.phone && <span style={s.error}>{errors.phone}</span>}
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
                <label style={s.label}>Company Name *</label>
                <input type="text" value={form.companyName} onChange={(e) => update('companyName', e.target.value)}
                  placeholder="e.g. Microsoft" style={s.input} />
                {errors.companyName && <span style={s.error}>{errors.companyName}</span>}
              </div>
              <div style={s.field}>
                <label style={s.label}>Role *</label>
                <select value={form.role} onChange={(e) => update('role', e.target.value)} style={s.input}>
                  <option value="">Select your role</option>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
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
                <span style={{ fontWeight: 600, fontSize: '0.78rem', color: '#e2e8f0', marginBottom: 4, display: 'block' }}>
                  Password Requirements
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 12px' }}>
                  {pwItems.map((item) => (
                    <span key={item.key} style={{ fontSize: '0.72rem', color: pwChecks[item.key] ? '#4ade80' : 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 4 }}>
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
            <button type="submit" style={{ ...s.btn, opacity: !isPasswordStrong(form.password) && form.password.length > 0 ? 0.5 : 1 }}>
              Continue
            </button>
            <p style={s.footer}>
              Already have an account?{' '}
              <Link to="/lms/sign-in" style={s.link}>Sign In</Link>
            </p>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} style={s.form}>
            <label style={s.label}>Work Email Address *</label>
            <input
              type="email"
              value={workEmail}
              onChange={(e) => setWorkEmail(e.target.value)}
              placeholder="you@company.com"
              style={s.input}
              autoFocus
              disabled={loading}
            />
            <p style={s.hint}>
              Only work/business emails are accepted. Your work email must match your company: <strong style={{ color: '#C5A059' }}>{form.companyName}</strong>
            </p>
            <button type="button" onClick={handleSendOtp}
              style={{ ...s.btn, opacity: loading || !workEmail.trim() ? 0.6 : 1, marginTop: '1rem' }}
              disabled={loading || !workEmail.trim()}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={s.spin} /> Sending...
                </span>
              ) : 'Send OTP'}
            </button>
            <div style={{ marginTop: '1.5rem' }}>
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
                    style={{ ...s.otpBox, borderColor: d ? '#C5A059' : 'rgba(255,255,255,0.08)' }}
                    disabled={loading}
                  />
                ))}
              </div>
              <div style={s.timerRow}>
                {timer > 0
                  ? <>Code expires in <strong style={{ color: '#e2e8f0' }}>{fmt(timer)}</strong></>
                  : <span style={{ color: '#f87171', fontWeight: 600 }}>Code expired</span>
                }
              </div>
            </div>
            <button type="submit" style={{ ...s.btn, opacity: loading || timer === 0 ? 0.6 : 1, marginTop: '1rem' }}
              disabled={loading || timer === 0}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={s.spin} /> Creating Account...
                </span>
              ) : 'Verify OTP & Create Account'}
            </button>
            <div style={s.links}>
              <button type="button" onClick={handleResend} disabled={resendCd > 0}
                style={{ ...s.linkBtn, opacity: resendCd > 0 ? 0.5 : 1, cursor: resendCd > 0 ? 'not-allowed' : 'pointer' }}>
                {resendCd > 0 ? `Resend in ${fmt(resendCd)}` : 'Resend Code'}
              </button>
              <button type="button" onClick={() => setStep('info')} style={s.linkBtn}>
                Edit Details
              </button>
            </div>
            <p style={{ ...s.footer, marginTop: '1rem' }}>
              Already have an account?{' '}
              <Link to="/lms/sign-in" style={s.link}>Sign In</Link>
            </p>
          </form>
        )}
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
  hint: { marginTop: '6px', fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4 },
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
  otpRow: { display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '0.5rem' },
  otpBox: {
    width: '48px', height: '56px', textAlign: 'center', fontSize: '1.5rem', fontWeight: 700,
    fontFamily: "'Courier New', monospace", border: '1.5px solid rgba(12, 22, 40, 0.12)', borderRadius: '10px',
    outline: 'none', background: '#f8f7f3', color: '#0c1628',
  },
  timerRow: { textAlign: 'center', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' },
  links: { display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' },
  linkBtn: {
    background: 'none', border: 'none', color: '#9B7A3E', fontWeight: 600,
    fontSize: '0.85rem', fontFamily: 'Inter, sans-serif', textDecoration: 'underline', cursor: 'pointer',
  },
  footer: { textAlign: 'center', fontSize: '0.85rem', color: '#64748b' },
  link: { color: '#9B7A3E', fontWeight: 600, textDecoration: 'none' },
  toast: {
    position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
    padding: '12px 24px', borderRadius: '10px', border: '1px solid',
    backdropFilter: 'blur(12px)', zIndex: 9999, maxWidth: '90vw', textAlign: 'center',
  },
};
