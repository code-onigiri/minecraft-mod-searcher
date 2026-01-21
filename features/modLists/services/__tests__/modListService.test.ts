import { describe, expect, it, vi, type Mock } from 'vitest';

import { modListService } from '@/features/modLists/services/modListService';
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
  icon_url: 'https://example.com/icon.png',
  pinned_version: '1.20.1',
  created_at: '2026-01-20T00:00:00Z',
  updated_at: '2026-01-20T00:00:00Z',
};

const selectMock = vi.fn();
const insertMock = vi.fn();
const updateMock = vi.fn();
const deleteMock = vi.fn();
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

describe('modListService', () => {
  it('リスト一覧を取得する', async () => {
    const getSessionMock = supabase.auth.getSession as unknown as Mock;
    getSessionMock.mockResolvedValue({ data: { session: { user: sessionUser } }, error: null });

    selectMock.mockResolvedValue({ data: [listRow], error: null });

    const lists = await modListService.getLists();

    expect(lists).toHaveLength(1);
    expect(lists[0].name).toBe('テストリスト');
  });

  it('リストを作成する', async () => {
    const getSessionMock = supabase.auth.getSession as unknown as Mock;
    getSessionMock.mockResolvedValue({ data: { session: { user: sessionUser } }, error: null });

    insertMock.mockReturnValue({ select: () => ({ single: () => Promise.resolve({ data: listRow, error: null }) }) });

    const list = await modListService.createList('テストリスト');

    expect(list.name).toBe('テストリスト');
  });

  it('Modをリストに追加する', async () => {
    const getSessionMock = supabase.auth.getSession as unknown as Mock;
    getSessionMock.mockResolvedValue({ data: { session: { user: sessionUser } }, error: null });

    insertMock.mockReturnValue({ select: () => ({ single: () => Promise.resolve({ data: itemRow, error: null }) }) });

    const item = await modListService.addMod('list-id', {
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

    expect(item.modName).toBe('Sodium');
  });

  it('リストからModを削除する', async () => {
    const getSessionMock = supabase.auth.getSession as unknown as Mock;
    getSessionMock.mockResolvedValue({ data: { session: { user: sessionUser } }, error: null });

    deleteMock.mockReturnValue({ eq: eqMock });
    eqMock.mockResolvedValue({ error: null });

    await modListService.removeMod('list-id', 'item-id');

    expect(deleteMock).toHaveBeenCalled();
  });

  it('ピン留めバージョンを更新する', async () => {
    const getSessionMock = supabase.auth.getSession as unknown as Mock;
    getSessionMock.mockResolvedValue({ data: { session: { user: sessionUser } }, error: null });

    updateMock.mockReturnValue({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: itemRow, error: null }) }) }) });

    const item = await modListService.updatePinnedVersion('item-id', '1.20.1');

    expect(item.pinnedVersion).toBe('1.20.1');
  });
});
