/** Token & current-user storage for the HTTP layer.
 *
 * 拆出来是因为 http client 需要在不依赖 React 的情况下读取 token，
 * AuthProvider 写入。两边通过 storage 事件保持同步。
 */
import type { User } from './types';

const TOKEN_KEY = 'stdjt.token';
const USER_KEY = 'stdjt.user';

export const session = {
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  setToken(token: string | null) {
    try {
      token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
  getUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  },
  setUser(user: User | null) {
    try {
      user ? localStorage.setItem(USER_KEY, JSON.stringify(user)) : localStorage.removeItem(USER_KEY);
    } catch {
      /* ignore */
    }
  },
  clear() {
    this.setToken(null);
    this.setUser(null);
  },
};

type UnauthHandler = () => void;
let unauthHandler: UnauthHandler | null = null;

/** AuthProvider 在挂载时注册：收到 401 时统一回到登录页。 */
export function onUnauthorized(fn: UnauthHandler) {
  unauthHandler = fn;
  return () => {
    if (unauthHandler === fn) unauthHandler = null;
  };
}

export function triggerUnauthorized() {
  unauthHandler?.();
}
