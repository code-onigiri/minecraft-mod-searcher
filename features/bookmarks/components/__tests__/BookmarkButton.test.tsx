import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { BookmarkButton } from '@/features/bookmarks/components/BookmarkButton';

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: false }),
}));

vi.mock('@/features/bookmarks/hooks/useBookmarks', () => ({
  useBookmarks: () => ({
    getBookmarkByModId: () => undefined,
    addBookmark: vi.fn(),
    removeBookmark: vi.fn(),
  }),
}));

const mod = {
  id: 'sodium',
  slug: 'sodium',
  name: 'Sodium',
  description: 'fast',
  sources: [],
  versions: [],
  loaders: [],
  downloads: 10,
  updatedAt: '2026-01-20T00:00:00Z',
};

describe('BookmarkButton', () => {
  it('未ログイン時は認証要求コールバックを呼ぶ', async () => {
    const user = userEvent.setup();
    const onRequireAuth = vi.fn();

    render(<BookmarkButton mod={mod} onRequireAuth={onRequireAuth} />);

    await user.click(screen.getByRole('button', { name: 'ブックマーク' }));

    expect(onRequireAuth).toHaveBeenCalled();
  });
});
