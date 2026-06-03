import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './auth';
import { session, triggerUnauthorized } from './session';

vi.mock('./api', () => ({
  logout: vi.fn().mockResolvedValue(undefined),
}));

const fakeUser = {
  name: '林思齐', dept: '市场部', avatar: '林', points: 100, level: 1,
  levelName: '新手', nextLevel: 200, streak: 1, learnedHours: 0,
  coursesDone: 0, certs: 0,
};

function Probe() {
  const { authed, user, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="authed">{String(authed)}</span>
      <span data-testid="name">{user?.name ?? ''}</span>
      <button onClick={() => login('tok', fakeUser)}>login</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => session.clear());

  it('starts unauthenticated when storage is empty', () => {
    render(<AuthProvider><Probe /></AuthProvider>);
    expect(screen.getByTestId('authed').textContent).toBe('false');
  });

  it('login persists token + user and flips authed', async () => {
    render(<AuthProvider><Probe /></AuthProvider>);
    await act(async () => {
      screen.getByText('login').click();
    });
    expect(screen.getByTestId('authed').textContent).toBe('true');
    expect(screen.getByTestId('name').textContent).toBe('林思齐');
    expect(session.getToken()).toBe('tok');
    expect(session.getUser()?.name).toBe('林思齐');
  });

  it('logout clears storage and calls api.logout', async () => {
    const api = await import('./api');
    session.setToken('tok');
    session.setUser(fakeUser);
    render(<AuthProvider><Probe /></AuthProvider>);
    expect(screen.getByTestId('authed').textContent).toBe('true');

    await act(async () => {
      screen.getByText('logout').click();
    });
    expect(screen.getByTestId('authed').textContent).toBe('false');
    expect(session.getToken()).toBeNull();
    expect(api.logout).toHaveBeenCalled();
  });

  it('global unauthorized resets the auth state', () => {
    session.setToken('tok');
    session.setUser(fakeUser);
    render(<AuthProvider><Probe /></AuthProvider>);
    expect(screen.getByTestId('authed').textContent).toBe('true');
    act(() => triggerUnauthorized());
    expect(screen.getByTestId('authed').textContent).toBe('false');
  });
});
