import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthCtx {
  authed: boolean;
  login: () => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const KEY = 'stdjt.authed';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(KEY) === '1';
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      authed ? localStorage.setItem(KEY, '1') : localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, [authed]);
  return (
    <Ctx.Provider value={{ authed, login: () => setAuthed(true), logout: () => setAuthed(false) }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used inside AuthProvider');
  return v;
}
