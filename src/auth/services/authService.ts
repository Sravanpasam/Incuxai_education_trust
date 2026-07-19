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

async function request(path: string, body: Record<string, string>): Promise<ApiResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err: any) {
    if (err?.name === 'TypeError' && err?.message?.includes('Failed to fetch')) {
      return { success: false, message: 'Cannot reach the authentication server. Make sure the auth server is running on port 3002 (run: npm run dev:server).' };
    }
    return { success: false, message: 'Network error. Please check your connection and try again.' };
  }
  if (!res.ok) {
    try {
      const data: ApiResponse = await res.json();
      return data;
    } catch {
      return { success: false, message: `Server returned error ${res.status}. Please try again.` };
    }
  }
  const data: ApiResponse = await res.json();
  return data;
}

async function requestAuth(path: string, method: string, body?: Record<string, string>): Promise<any> {
  const token = localStorage.getItem('incuxai_auth_token');
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

export async function sendOtp(email: string): Promise<ApiResponse> {
  return request('/api/auth/send-otp', { email });
}

export async function verifyOtp(email: string, otp: string): Promise<ApiResponse> {
  return request('/api/auth/verify-otp', { email, otp });
}

export async function registerUser(data: {
  fullName: string;
  personalEmail: string;
  phone: string;
  workEmail: string;
  companyName: string;
  location: string;
  role: string;
  password: string;
}): Promise<ApiResponse> {
  return request('/api/auth/register', {
    fullName: data.fullName,
    personalEmail: data.personalEmail,
    phone: data.phone,
    workEmail: data.workEmail,
    companyName: data.companyName,
    location: data.location,
    role: data.role,
    password: data.password,
  });
}

export async function loginUser(workEmail: string, password: string): Promise<ApiResponse> {
  return request('/api/auth/login', { workEmail, password });
}

export async function getMe(): Promise<any> {
  return requestAuth('/api/auth/me', 'GET');
}
