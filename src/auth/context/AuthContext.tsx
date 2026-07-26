import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthUser {
  id?: string;
  email: string;
  name: string;
  token: string;
  isPremium?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isPremium: boolean;
  login: (token: string, email: string, name: string, id?: string, isPremium?: boolean) => void;
  logout: () => void;
  setPremium: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'incuxai_auth_token';
const USER_KEY = 'incuxai_auth_user';
const PREMIUM_KEY = 'incuxai_user_premium';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(() => {
    try { return localStorage.getItem(PREMIUM_KEY) === 'true'; } catch { return false; }
  });

  useEffect(() => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const raw = localStorage.getItem(USER_KEY);
      if (token && raw) {
        const parsed = JSON.parse(raw);
        setUser({ email: parsed.email, name: parsed.name, token, id: parsed.id, isPremium: parsed.isPremium });
        if (parsed.isPremium !== undefined) {
          setIsPremium(parsed.isPremium);
          localStorage.setItem(PREMIUM_KEY, parsed.isPremium ? 'true' : 'false');
        }
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, email: string, name: string, id?: string, premium?: boolean) => {
    const u: AuthUser = { email, name, token, id, isPremium: premium };
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify({ email, name, id, isPremium: premium }));
    setUser(u);
    if (premium !== undefined) {
      setIsPremium(premium);
      localStorage.setItem(PREMIUM_KEY, premium ? 'true' : 'false');
    }
    // Sync with existing corporate_course flow
    localStorage.setItem('corp_otp_verified', 'true');
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(PREMIUM_KEY);
    localStorage.removeItem('corp_otp_verified');
    localStorage.removeItem('pending_corp_registration');
    localStorage.removeItem('pending_auth_email');
    setUser(null);
    setIsPremium(false);
  };

  const setPremium = (value: boolean) => {
    setIsPremium(value);
    localStorage.setItem(PREMIUM_KEY, value ? 'true' : 'false');
    if (user) {
      const updated = { ...user, isPremium: value };
      setUser(updated);
      localStorage.setItem(USER_KEY, JSON.stringify({ email: updated.email, name: updated.name, id: updated.id, isPremium: value }));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, isPremium, login, logout, setPremium }}
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
