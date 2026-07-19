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
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
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
