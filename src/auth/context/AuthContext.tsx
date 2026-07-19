import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthUser {
  id?: string;
  email: string;
  name: string;
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, email: string, name: string, id?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'incuxai_auth_token';
const USER_KEY = 'incuxai_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const raw = localStorage.getItem(USER_KEY);
      if (token && raw) {
        const parsed = JSON.parse(raw);
        setUser({ email: parsed.email, name: parsed.name, token, id: parsed.id });
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, email: string, name: string, id?: string) => {
    const u: AuthUser = { email, name, token, id };
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify({ email, name, id }));
    setUser(u);
    // Sync with existing corporate_course flow
    localStorage.setItem('corp_otp_verified', 'true');
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('corp_otp_verified');
    localStorage.removeItem('pending_corp_registration');
    localStorage.removeItem('pending_auth_email');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
