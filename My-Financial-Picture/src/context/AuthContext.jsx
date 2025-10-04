import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const KEY = 'mfp_auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : { isAuthed: false, userId: null };
    } catch {
      return { isAuthed: false, userId: null };
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(auth));
  }, [auth]);

  const value = useMemo(() => ({
    isAuthed: !!auth.isAuthed,
    userId: auth.userId,
    login: (payload = {}) => setAuth({ isAuthed: true, userId: payload.userId ?? null }),
    logout: () => setAuth({ isAuthed: false, userId: null }),
  }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}