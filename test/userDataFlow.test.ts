import { describe, expect, it, vi, type Mock } from 'vitest';

import { bookmarkService } from '@/features/bookmarks/services/bookmarkService';
import { modListService } from '@/features/modLists/services/modListService';
import { exportService } from '@/features/export/services/exportService';
import { supabase } from '@/lib/supabase';

const sessionUser = {
  id: 'user-id',
  email: 'user@example.com',
  app_metadata: { provider: 'email' },
  user_metadata: {},
};

const listRow = {
  id: 'list-id',
  user_id: 'user-id',
  name: 'テストリスト',
  created_at: '2026-01-20T00:00:00Z',
  updated_at: '2026-01-20T00:00:00Z',
};

const itemRow = {
  id: 'item-id',
  user_id: 'user-id',
  list_id: 'list-id',
  mod_name: 'Sodium',
  mod_slug: 'sodium',
  source_urls: [{ source: 'modrinth', url: 'https://modrinth.com/mod/sodium', id: 'modrinth-id' }],
  icon_url: null,
  pinned_version: '1.20.1',
  created_at: '2026-01-20T00:00:00Z',
  updated_at: '2026-01-20T00:00:00Z',
};

const bookmarkRow = {
  id: 'bookmark-id',
  user_id: 'user-id',
  mod_name: 'Sodium',
  mod_slug: 'sodium',
  source_urls: [{ source: 'modrinth', url: 'https://modrinth.com/mod/sodium', id: 'modrinth-id' }],
  icon_url: null,
  memo: null,
  created_at: '2026-01-20T00:00:00Z',
  updated_at: '2026-01-20T00:00:00Z',
};

const selectMock = vi.fn();
const insertMock = vi.fn();

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
    from: vi.fn(() => ({
      select: selectMock,
      insert: insertMock,
    })),
  },
}));

describe('ユーザーデータフロー統合', () => {
  it('ブックマーク保存とリストエクスポートを確認する', async () => {
    const getSessionMock = supabase.auth.getSession as unknown as Mock;
    getSessionMock.mockResolvedValue({ data: { session: { user: sessionUser } }, error: null });

    insertMock
      .mockReturnValueOnce({ select: () => ({ single: () => Promise.resolve({ data: bookmarkRow, error: null }) }) })
      .mockReturnValueOnce({ select: () => ({ single: () => Promise.resolve({ data: listRow, error: null }) }) })
      .mockReturnValueOnce({ select: () => ({ single: () => Promise.resolve({ data: itemRow, error: null }) }) });

    const bookmark = await bookmarkService.add({
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

    const list = await modListService.createList('テストリスト');
    const item = await modListService.addMod(list.id, {
      id: 'sodium',
      slug: 'sodium',
      name: 'Sodium',
      description: 'fast',
      sources: [{ source: 'modrinth', url: 'https://modrinth.com/mod/sodium', id: 'modrinth-id' }],
      versions: [],
      loaders: [],
      downloads: 10,
      updatedAt: '2026-01-20T00:00:00Z',
    }, '1.20.1');

    const markdown = exportService.toMarkdown({ ...list, items: [item] });

    expect(bookmark.modName).toBe('Sodium');
    expect(markdown).toContain('Sodium');
  });
});
