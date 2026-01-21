import { describe, expect, it, vi, type Mock } from 'vitest';

import { authService } from '@/features/auth/services/authService';
import { supabase } from '@/lib/supabase';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
}));

describe('authService', () => {
  it('GitHub OAuthを開始する', async () => {
    const mock = supabase.auth.signInWithOAuth as unknown as Mock;
    mock.mockResolvedValue({ data: { provider: 'github', url: 'https://example.com' }, error: null });

    const result = await authService.signInWithGitHub();

    expect(mock).toHaveBeenCalledWith({ provider: 'github' });
    expect(result.success).toBe(true);
  });

  it('メールログイン結果を返す', async () => {
    const mock = supabase.auth.signInWithPassword as unknown as Mock;
    mock.mockResolvedValue({
      data: {
        session: {
          user: {
            id: 'user-id',
            email: 'test@example.com',
            app_metadata: { provider: 'email' },
            user_metadata: {},
          },
        },
      },
      error: null,
    });

    const result = await authService.signInWithEmail('test@example.com', 'password');

    expect(result.success).toBe(true);
    expect(result.user?.email).toBe('test@example.com');
  });

  it('サインアップ結果を返す', async () => {
    const mock = supabase.auth.signUp as unknown as Mock;
    mock.mockResolvedValue({
      data: {
        session: {
          user: {
            id: 'user-id',
            email: 'new@example.com',
            app_metadata: { provider: 'email' },
            user_metadata: {},
          },
        },
      },
      error: null,
    });

    const result = await authService.signUp('new@example.com', 'password');

    expect(result.success).toBe(true);
    expect(result.user?.email).toBe('new@example.com');
  });

  it('GitHubトークンを取得できる', async () => {
    const mock = supabase.auth.getSession as unknown as Mock;
    mock.mockResolvedValue({
      data: {
        session: {
          provider_token: 'token',
          user: {
            id: 'user-id',
            email: 'test@example.com',
            app_metadata: { provider: 'github' },
            user_metadata: {},
          },
        },
      },
      error: null,
    });

    const token = await authService.getGitHubToken();

    expect(token).toBe('token');
  });
});
