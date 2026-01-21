import { describe, expect, it, vi, type Mock } from 'vitest';

import { bookmarkService } from '@/features/bookmarks/services/bookmarkService';
import { supabase } from '@/lib/supabase';

const sessionUser = {
  id: 'user-id',
  email: 'user@example.com',
  app_metadata: { provider: 'email' },
  user_metadata: {},
};

const mockRow = {
  id: 'bookmark-id',
  user_id: 'user-id',
  mod_name: 'Sodium',
  mod_slug: 'sodium',
  source_urls: [{ source: 'modrinth', url: 'https://modrinth.com/mod/sodium', id: 'modrinth-id' }],
  icon_url: 'https://example.com/icon.png',
  memo: '高速化',
  created_at: '2026-01-20T00:00:00Z',
  updated_at: '2026-01-20T00:00:00Z',
};

const selectMock = vi.fn();
const insertMock = vi.fn();
const updateMock = vi.fn();
const deleteMock = vi.fn();
const orderMock = vi.fn();
const eqMock = vi.fn();

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
    from: vi.fn(() => ({
      select: selectMock,
      insert: insertMock,
      update: updateMock,
      delete: deleteMock,
    })),
  },
}));

describe('bookmarkService', () => {
  it('ブックマーク一覧を取得する', async () => {
    const getSessionMock = supabase.auth.getSession as unknown as Mock;
    getSessionMock.mockResolvedValue({ data: { session: { user: sessionUser } }, error: null });

    selectMock.mockReturnValue({ order: orderMock });
    orderMock.mockResolvedValue({ data: [mockRow], error: null });

    const result = await bookmarkService.getAll();

    expect(result).toHaveLength(1);
    expect(result[0].modName).toBe('Sodium');
  });

  it('ブックマークを追加する', async () => {
    const getSessionMock = supabase.auth.getSession as unknown as Mock;
    getSessionMock.mockResolvedValue({ data: { session: { user: sessionUser } }, error: null });

    insertMock.mockReturnValue({ select: () => ({ single: () => Promise.resolve({ data: mockRow, error: null }) }) });

    const result = await bookmarkService.add({
      id: 'sodium',
      slug: 'sodium',
      name: 'Sodium',
      description: 'fast',
      sources: [{ source: 'modrinth', url: 'https://modrinth.com/mod/sodium', id: 'modrinth-id' }],
      versions: [],
      loaders: [],
      downloads: 10,
      updatedAt: '2026-01-20T00:00:00Z',
    });

    expect(result.modName).toBe('Sodium');
    expect(insertMock).toHaveBeenCalled();
  });

  it('メモを更新する', async () => {
    const getSessionMock = supabase.auth.getSession as unknown as Mock;
    getSessionMock.mockResolvedValue({ data: { session: { user: sessionUser } }, error: null });

    updateMock.mockReturnValue({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: { ...mockRow, memo: '更新' }, error: null }) }) }) });

    const result = await bookmarkService.update('bookmark-id', '更新');

    expect(result.memo).toBe('更新');
  });

  it('ブックマークを削除する', async () => {
    const getSessionMock = supabase.auth.getSession as unknown as Mock;
    getSessionMock.mockResolvedValue({ data: { session: { user: sessionUser } }, error: null });

    deleteMock.mockReturnValue({ eq: eqMock });
    eqMock.mockResolvedValue({ error: null });

    await bookmarkService.remove('bookmark-id');

    expect(deleteMock).toHaveBeenCalled();
  });
});
