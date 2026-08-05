const API_BASE = import.meta.env.VITE_AUTH_API_URL || '';

interface ApiOk {
  success: true;
  message: string;
  token?: string;
  user?: { id: string; name: string; email: string };
}

interface ApiErr {
  success: false;
  message: string;
}

type ApiResponse = ApiOk | ApiErr;

async function post(path: string, body: Record<string, any>): Promise<ApiResponse> {
  try {
    const url = `${API_BASE}${path}`;
    console.log(`[AuthService] POST ${path}`, JSON.stringify({ ...body, password: body.password ? '***' : undefined }));
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    if (data && data.message) {
      console.log(`[AuthService] Response ${res.status}:`, JSON.stringify(data));
      return data;
    }
    console.log(`[AuthService] Response ${res.status} (no message):`, JSON.stringify(data));
    return { success: false, message: `Server error (${res.status}). Please try again.` };
  } catch (err) {
    console.error(`[AuthService] Fetch error for ${path}:`, err);
    return { success: false, message: 'Network error. Please try again.' };
  }
}

interface SendOtpSignup {
  name: string;
  personalEmail: string;
  phone: string;
  company: string;
  role: string;
  workEmail?: string;
  password: string;
}

interface SendOtpOptions {
  resendCount?: number;
  forcePersonal?: boolean;
}

export async function loginUser(workEmail: string, password: string): Promise<ApiResponse> {
  const cleanEmail = workEmail.trim().toLowerCase();
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personalEmail: cleanEmail, workEmail: cleanEmail, email: cleanEmail, password }),
    });
    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json().catch(() => null);
    if (errData && errData.message) {
      return errData;
    }
  } catch {}

  // Fallback to local storage only if the server could not be reached at all.
  // Never fabricate a successful login for unknown users (security).
  const users = getLocalUsers();
  const found = users.find((u) => u.workEmail?.toLowerCase() === cleanEmail || u.personalEmail?.toLowerCase() === cleanEmail);

  if (found) {
    if (found.password === password) {
      return {
        success: true,
        token: `local_token_${Date.now()}`,
        user: {
          id: found.id,
          name: found.fullName || found.name,
          email: found.workEmail || found.personalEmail,
        },
        message: 'Login successful',
      };
    } else {
      return { success: false, message: 'Invalid email or password.' };
    }
  }

  return { success: false, message: 'Cannot reach the authentication server. Please try again later.' };
}

/**
 * POST /api/auth/send-otp
 * Sends a 6-digit OTP to the appropriate email (work first, then personal).
 * Used for both initial send and resend.
 *
 * @param email - The personal email
 * @param signup - All signup form data
 * @param options - Optional settings: resendCount, forcePersonal
 */
export async function sendOtp(
  email: string,
  signup: SendOtpSignup,
  options?: SendOtpOptions
): Promise<ApiResponse> {
  return post('/api/auth/send-otp', {
    email,
    name: signup.name,
    personalEmail: signup.personalEmail,
    phone: signup.phone,
    company: signup.company,
    role: signup.role,
    workEmail: signup.workEmail,
    password: signup.password,
    resendCount: options?.resendCount ?? 0,
    forcePersonal: options?.forcePersonal ?? false,
  });
}

/**
 * POST /api/auth/verify-otp
 * Verifies the OTP and creates the user account in one step.
 * The backend returns a JWT token that can be used for auto-login.
 *
 * @param email - The personal email the OTP was sent to
 * @param otp - The 6-digit code
 * @param signup - All signup form data (inserted into users table on success)
 */
export async function verifyOtp(
  email: string,
  otp: string,
  signup?: {
    name: string;
    personalEmail: string;
    phone: string;
    company: string;
    role: string;
    workEmail?: string;
    password: string;
    emailType?: 'work' | 'personal';
  }
): Promise<ApiResponse> {
  return post('/api/auth/verify-otp', {
    email,
    otp,
    name: signup?.name ?? '',
    personalEmail: signup?.personalEmail ?? email,
    phone: signup?.phone ?? '',
    company: signup?.company ?? '',
    role: signup?.role ?? '',
    workEmail: signup?.workEmail,
    password: signup?.password ?? '',
    emailType: signup?.emailType ?? '',
  });
}

/**
 * GET /api/auth/me
 * Fetches current user profile using stored JWT token.
 */
export async function getMe(): Promise<any> {
  try {
    const token = localStorage.getItem('incuxai_auth_token');
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) return await res.json();
  } catch {}
  return { success: true, user: null };
}

// ─── Legacy exports kept for LmsSignUpPage backward compatibility ───

const LOCAL_USERS_KEY = 'lms_registered_users';

function getLocalUsers(): any[] {
  try { const raw = localStorage.getItem(LOCAL_USERS_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}

function saveLocalUser(user: any) {
  const users = getLocalUsers(); users.push(user); localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

export async function resendOtpApi(workEmail: string, personalEmail: string, _resendCount: number, name?: string): Promise<ApiResponse> {
  return post('/api/auth/resend-otp', {
    workEmail,
    personalEmail,
    resendCount: _resendCount,
    name: name || '',
  });
}

export async function sendPersonalOtpApi(workEmail: string, personalEmail: string, name?: string): Promise<ApiResponse> {
  return post('/api/auth/send-personal-otp', {
    workEmail,
    personalEmail,
    name: name || '',
  });
}

export async function registerUser(data: {
  fullName: string; personalEmail: string; phone: string; workEmail: string;
  companyName: string; location: string; role: string; password: string;
}): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
    const errData = await res.json().catch(() => null);
    if (errData && errData.message) return errData;
    return { success: false, message: `Registration failed (${res.status}). Please try again.` };
  } catch {
    return { success: false, message: 'Cannot reach the authentication server. Your account was not created. Please try again later.' };
  }
}

export async function resetPassword(email: string, newPassword: string): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/reset-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, newPassword }) });
    if (res.ok) return await res.json();
    const errData = await res.json().catch(() => null);
    if (errData && errData.message && res.status < 500) return errData;
  } catch {}
  const users = getLocalUsers();
  const idx = users.findIndex((u) => u.workEmail?.toLowerCase() === email.toLowerCase());
  if (idx >= 0) { users[idx].password = newPassword; localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users)); return { success: true, message: 'Password reset successfully.' }; }
  return { success: false, message: 'No account found with this email. Please register first.' };
}
