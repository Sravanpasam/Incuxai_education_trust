const API_BASE = import.meta.env.VITE_AUTH_API_URL || '';

interface ApiOk {
  success: true;
  message: string;
  token?: string;
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

export async function sendOtp(email: string): Promise<ApiResponse> {
  return request('/api/auth/send-otp', { email });
}

export async function verifyOtp(email: string, otp: string): Promise<ApiResponse> {
  return request('/api/auth/verify-otp', { email, otp });
}
