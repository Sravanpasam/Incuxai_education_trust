import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface LmsUser {
  id?: string;
  email: string;
  name: string;
  token: string;
}

interface LmsAuthContextType {
  user: LmsUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, email: string, name: string, id?: string) => void;
  logout: () => void;
}

const LmsAuthContext = createContext<LmsAuthContextType | undefined>(undefined);

const LMS_TOKEN_KEY = 'lms_auth_token';
const LMS_USER_KEY = 'lms_auth_user';

export function LmsAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LmsUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem(LMS_TOKEN_KEY);
      const raw = localStorage.getItem(LMS_USER_KEY);
      if (token && raw) {
        const parsed = JSON.parse(raw);
        setUser({ email: parsed.email, name: parsed.name, token, id: parsed.id });
      }
    } catch {
      localStorage.removeItem(LMS_TOKEN_KEY);
      localStorage.removeItem(LMS_USER_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, email: string, name: string, id?: string) => {
    const u: LmsUser = { email, name, token, id };
    localStorage.setItem(LMS_TOKEN_KEY, token);
    localStorage.setItem(LMS_USER_KEY, JSON.stringify({ email, name, id }));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem(LMS_TOKEN_KEY);
    localStorage.removeItem(LMS_USER_KEY);
    localStorage.removeItem('lms_hr_progress');
    setUser(null);
  };

  return (
    <LmsAuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, logout }}
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
