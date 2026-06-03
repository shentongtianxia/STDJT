import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../api', () => ({
  login: vi.fn(),
}));

import * as api from '../api';
import { LoginPage } from './Auth';

const fakeUser = {
  name: '林思齐', dept: '市场部', avatar: '林', points: 100, level: 1,
  levelName: '新手', nextLevel: 200, streak: 1, learnedHours: 0,
  coursesDone: 0, certs: 0,
};

describe('LoginPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('refuses empty account', async () => {
    const onLogin = vi.fn();
    render(<LoginPage onLogin={onLogin} />);
    fireEvent.click(screen.getByRole('button', { name: '登录' }));
    expect(await screen.findByText(/请输入工号/)).toBeInTheDocument();
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('calls api.login then onLogin(token, user) on success', async () => {
    (api.login as any).mockResolvedValue({ token: 'tok', user: fakeUser });
    const onLogin = vi.fn();
    render(<LoginPage onLogin={onLogin} />);

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(/如 lin.siqi/), 'a@b.com');
    await user.type(screen.getByPlaceholderText('请输入登录密码'), 'pw');
    await user.click(screen.getByRole('button', { name: '登录' }));

    await waitFor(() => expect(onLogin).toHaveBeenCalledWith('tok', fakeUser));
    expect(api.login).toHaveBeenCalledWith({ account: 'a@b.com', pwd: 'pw' });
  });

  it('surfaces server error and does not call onLogin', async () => {
    (api.login as any).mockRejectedValue(new Error('账号或密码错误'));
    const onLogin = vi.fn();
    render(<LoginPage onLogin={onLogin} />);
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(/如 lin.siqi/), 'a@b.com');
    await user.type(screen.getByPlaceholderText('请输入登录密码'), 'wrong');
    await user.click(screen.getByRole('button', { name: '登录' }));

    expect(await screen.findByText(/登录失败|账号或密码错误/)).toBeInTheDocument();
    expect(onLogin).not.toHaveBeenCalled();
  });
});
