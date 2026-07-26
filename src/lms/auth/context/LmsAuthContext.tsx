import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface LmsUser {
  id?: string;
  email: string;
  name: string;
  token: string;
  isPremium?: boolean;
}

interface LmsAuthContextType {
  user: LmsUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isPremium: boolean;
  login: (token: string, email: string, name: string, id?: string, isPremium?: boolean) => void;
  logout: () => void;
  setPremium: (value: boolean) => void;
}

const LmsAuthContext = createContext<LmsAuthContextType | undefined>(undefined);

const LMS_TOKEN_KEY = 'lms_auth_token';
const LMS_USER_KEY = 'lms_auth_user';
const LMS_PREMIUM_KEY = 'lms_user_premium';

export function LmsAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LmsUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(() => {
    try { return localStorage.getItem(LMS_PREMIUM_KEY) === 'true'; } catch { return false; }
  });

  useEffect(() => {
    try {
      const token = localStorage.getItem(LMS_TOKEN_KEY);
      const raw = localStorage.getItem(LMS_USER_KEY);
      if (token && raw) {
        const parsed = JSON.parse(raw);
        setUser({ email: parsed.email, name: parsed.name, token, id: parsed.id, isPremium: parsed.isPremium });
        if (parsed.isPremium !== undefined) {
          setIsPremium(parsed.isPremium);
          localStorage.setItem(LMS_PREMIUM_KEY, parsed.isPremium ? 'true' : 'false');
        }
      }
    } catch {
      localStorage.removeItem(LMS_TOKEN_KEY);
      localStorage.removeItem(LMS_USER_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, email: string, name: string, id?: string, premium?: boolean) => {
    const u: LmsUser = { email, name, token, id, isPremium: premium };
    localStorage.setItem(LMS_TOKEN_KEY, token);
    localStorage.setItem(LMS_USER_KEY, JSON.stringify({ email, name, id, isPremium: premium }));
    setUser(u);
    if (premium !== undefined) {
      setIsPremium(premium);
      localStorage.setItem(LMS_PREMIUM_KEY, premium ? 'true' : 'false');
    }
  };

  const logout = () => {
    localStorage.removeItem(LMS_TOKEN_KEY);
    localStorage.removeItem(LMS_USER_KEY);
    localStorage.removeItem(LMS_PREMIUM_KEY);
    localStorage.removeItem('lms_hr_progress');
    setUser(null);
    setIsPremium(false);
  };

  const setPremium = (value: boolean) => {
    setIsPremium(value);
    localStorage.setItem(LMS_PREMIUM_KEY, value ? 'true' : 'false');
    if (user) {
      const updated = { ...user, isPremium: value };
      setUser(updated);
      localStorage.setItem(LMS_USER_KEY, JSON.stringify({ email: updated.email, name: updated.name, id: updated.id, isPremium: value }));
    }
  };

  return (
    <LmsAuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, isPremium, login, logout, setPremium }}
    >
      {children}
    </LmsAuthContext.Provider>
  );
}

export function useLmsAuth(): LmsAuthContextType {
  const ctx = useContext(LmsAuthContext);
  if (!ctx) throw new Error('useLmsAuth must be used within LmsAuthProvider');
  return ctx;
}
