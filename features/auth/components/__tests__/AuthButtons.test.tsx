import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, type Mock } from 'vitest';

import { AuthButtons } from '@/features/auth/components/AuthButtons';
import { authService } from '@/features/auth/services/authService';

vi.mock('@/features/auth/services/authService', () => ({
  authService: {
    signInWithGitHub: vi.fn().mockResolvedValue({ success: true }),
    signInWithEmail: vi.fn().mockResolvedValue({ success: true }),
    signUp: vi.fn().mockResolvedValue({ success: true }),
  },
}));

describe('AuthButtons', () => {
  it('GitHubログインボタンでOAuthを開始する', async () => {
    const user = userEvent.setup();
    const signInMock = authService.signInWithGitHub as unknown as Mock;

    render(<AuthButtons />);
    await user.click(screen.getByRole('button', { name: 'GitHubでログイン' }));

    expect(signInMock).toHaveBeenCalled();
  });

  it('メールログインを実行する', async () => {
    const user = userEvent.setup();
    const signInMock = authService.signInWithEmail as unknown as Mock;

    render(<AuthButtons />);

    await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await user.type(screen.getByLabelText('パスワード'), 'password');
    await user.click(screen.getByRole('button', { name: 'メールでログイン' }));

    expect(signInMock).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('メールサインアップを実行する', async () => {
    const user = userEvent.setup();
    const signUpMock = authService.signUp as unknown as Mock;

    render(<AuthButtons />);

    await user.type(screen.getByLabelText('メールアドレス'), 'new@example.com');
    await user.type(screen.getByLabelText('パスワード'), 'password');
    await user.click(screen.getByRole('button', { name: '新規登録' }));

    expect(signUpMock).toHaveBeenCalledWith('new@example.com', 'password');
  });
});
