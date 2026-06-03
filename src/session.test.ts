import { describe, it, expect, vi, beforeEach } from 'vitest';
import { session, onUnauthorized, triggerUnauthorized } from './session';

describe('session', () => {
  beforeEach(() => session.clear());

  it('returns null when nothing is stored', () => {
    expect(session.getToken()).toBeNull();
    expect(session.getUser()).toBeNull();
  });

  it('round-trips token + user through localStorage', () => {
    session.setToken('abc');
    session.setUser({
      name: '林思齐', dept: '市场部', avatar: '林', points: 100, level: 1,
      levelName: '新手', nextLevel: 200, streak: 1, learnedHours: 0,
      coursesDone: 0, certs: 0,
    });
    expect(session.getToken()).toBe('abc');
    expect(session.getUser()?.name).toBe('林思齐');
  });

  it('clear() drops both token and user', () => {
    session.setToken('abc');
    session.setUser({} as any);
    session.clear();
    expect(localStorage.getItem('stdjt.token')).toBeNull();
    expect(localStorage.getItem('stdjt.user')).toBeNull();
  });

  it('survives malformed user JSON', () => {
    localStorage.setItem('stdjt.user', 'not json');
    expect(session.getUser()).toBeNull();
  });
});

describe('unauthorized callback', () => {
  it('invokes the registered handler', () => {
    const fn = vi.fn();
    const off = onUnauthorized(fn);
    triggerUnauthorized();
    expect(fn).toHaveBeenCalledTimes(1);
    off();
    triggerUnauthorized();
    expect(fn).toHaveBeenCalledTimes(1); // no further calls after unregister
  });
});
