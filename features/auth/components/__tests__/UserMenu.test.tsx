import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, type Mock } from 'vitest';

import { UserMenu } from '@/features/auth/components/UserMenu';
import { authService } from '@/features/auth/services/authService';

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: 'user-id',
      email: 'user@example.com',
      provider: 'github',
      avatarUrl: undefined,
    },
    isAuthenticated: true,
    isLoading: false,
    session: null,
  }),
}));

vi.mock('@/features/auth/services/authService', () => ({
  authService: {
    signOut: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('UserMenu', () => {
  it('ログアウトボタンが押せる', async () => {
    const user = userEvent.setup();
    const signOutMock = authService.signOut as unknown as Mock;

    render(<UserMenu />);

    await user.click(screen.getByRole('button', { name: 'ログアウト' }));

    expect(signOutMock).toHaveBeenCalled();
  });
});
