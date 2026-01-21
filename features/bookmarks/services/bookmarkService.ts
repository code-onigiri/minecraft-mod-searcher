import { supabase } from '@/lib/supabase';
import type { Bookmark } from '@/types/bookmark';
import type { UnifiedMod } from '@/features/search/types/search';
import type { Database } from '@/types/supabase';

type BookmarkRow = Database['public']['Tables']['bookmarks']['Row'];

const toBookmark = (row: {
  id: string;
  user_id: string;
  mod_name: string;
  mod_slug: string | null;
  source_urls: unknown;
  icon_url: string | null;
  memo: string | null;
  created_at: string;
  updated_at: string;
}): Bookmark => ({
  id: row.id,
  userId: row.user_id,
  modId: row.mod_slug ?? row.mod_name,
  modName: row.mod_name,
  iconUrl: row.icon_url ?? undefined,
  sources: Array.isArray(row.source_urls) ? (row.source_urls as Bookmark['sources']) : [],
  memo: row.memo ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const bookmarkedIds = new Set<string>();
const bookmarkIdMap = new Map<string, string>();

const getUserId = async (): Promise<string> => {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.user?.id) {
    throw new Error('ログインが必要です');
  }
  return data.session.user.id;
};

export const bookmarkService = {
  async getAll(): Promise<Bookmark[]> {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    const rows = ((data ?? []) as BookmarkRow[]).filter((row) => row.user_id === userId);
    const bookmarks = rows.map(toBookmark);
    bookmarkedIds.clear();
    bookmarkIdMap.clear();
    bookmarks.forEach((bookmark) => {
      bookmarkedIds.add(bookmark.modId);
      bookmarkIdMap.set(bookmark.id, bookmark.modId);
    });

    return bookmarks;
  },
  async add(mod: UnifiedMod, memo?: string): Promise<Bookmark> {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: userId,
        mod_name: mod.name,
        mod_slug: mod.slug,
        source_urls: mod.sources,
        icon_url: mod.iconUrl ?? null,
        memo: memo ?? null,
      })
      .select('*')
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? 'ブックマーク追加に失敗しました');
    }

    const bookmark = toBookmark(data as BookmarkRow);
    bookmarkedIds.add(bookmark.modId);
    bookmarkIdMap.set(bookmark.id, bookmark.modId);
    return bookmark;
  },
  async update(id: string, memo: string): Promise<Bookmark> {
    await getUserId();
    const { data, error } = await supabase
      .from('bookmarks')
      .update({ memo })
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? 'ブックマーク更新に失敗しました');
    }

    return toBookmark(data as BookmarkRow);
  },
  async remove(id: string): Promise<void> {
    await getUserId();
    const { error } = await supabase.from('bookmarks').delete().eq('id', id);
    if (error) {
      throw new Error(error.message);
    }

    const modId = bookmarkIdMap.get(id);
    if (modId) {
      bookmarkedIds.delete(modId);
      bookmarkIdMap.delete(id);
    }
  },
  isBookmarked(modId: string): boolean {
    return bookmarkedIds.has(modId);
  },
};
