import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as api from './api';
import { session, onUnauthorized } from './session';
import type { User } from './types';

interface AuthCtx {
  authed: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => session.getToken());
  const [user, setUser] = useState<User | null>(() => session.getUser());

  useEffect(() => {
    // http client 收到 401 时回调，统一清空 + 触发重渲染。
    return onUnauthorized(() => {
      setToken(null);
      setUser(null);
    });
  }, []);

  const login = useCallback((newToken: string, newUser: User) => {
    session.setToken(newToken);
    session.setUser(newUser);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    // 即使后端请求失败也保证本地登出。
    try {
      await api.logout();
    } catch {
      /* ignore */
    }
    session.clear();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <Ctx.Provider value={{ authed: !!token, user, login, logout }}>{children}</Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used inside AuthProvider');
  return v;
}
