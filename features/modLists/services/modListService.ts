import { supabase } from '@/lib/supabase';
import type { ModList, ModListItem } from '@/types/modList';
import type { UnifiedMod } from '@/features/search/types/search';
import type { Database } from '@/types/supabase';

type ModListRow = Database['public']['Tables']['mod_lists']['Row'];
type ModListItemRow = Database['public']['Tables']['mod_list_items']['Row'];

const toList = (row: {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}): ModList => ({
  id: row.id,
  userId: row.user_id,
  name: row.name,
  items: [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toItem = (row: {
  id: string;
  list_id: string;
  mod_name: string;
  mod_slug: string | null;
  source_urls: unknown;
  icon_url: string | null;
  pinned_version: string | null;
  created_at: string;
}): ModListItem => ({
  id: row.id,
  listId: row.list_id,
  modId: row.mod_slug ?? row.mod_name,
  modName: row.mod_name,
  iconUrl: row.icon_url ?? undefined,
  sources: Array.isArray(row.source_urls) ? (row.source_urls as ModListItem['sources']) : [],
  pinnedVersion: row.pinned_version ?? undefined,
  addedAt: row.created_at,
});

const getUserId = async (): Promise<string> => {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.user?.id) {
    throw new Error('ログインが必要です');
  }
  return data.session.user.id;
};

export const modListService = {
  async getLists(): Promise<ModList[]> {
    await getUserId();
    const { data, error } = await supabase.from('mod_lists').select('*');
    if (error) {
      throw new Error(error.message);
    }

    return ((data ?? []) as ModListRow[]).map(toList);
  },
  async getList(id: string): Promise<ModList> {
    await getUserId();
    const { data: listData, error } = await supabase.from('mod_lists').select('*').eq('id', id).single();
    if (error || !listData) {
      throw new Error(error?.message ?? 'リスト取得に失敗しました');
    }

    const { data: itemsData, error: itemError } = await supabase
      .from('mod_list_items')
      .select('*')
      .eq('list_id', id);
    if (itemError) {
      throw new Error(itemError.message);
    }

    return {
      ...toList(listData as ModListRow),
      items: ((itemsData ?? []) as ModListItemRow[]).map(toItem),
    };
  },
  async createList(name: string): Promise<ModList> {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('mod_lists')
      .insert({ user_id: userId, name })
      .select('*')
      .single();
    if (error || !data) {
      throw new Error(error?.message ?? 'リスト作成に失敗しました');
    }

    return toList(data as ModListRow);
  },
  async deleteList(id: string): Promise<void> {
    await getUserId();
    const { error } = await supabase.from('mod_lists').delete().eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  },
  async addMod(listId: string, mod: UnifiedMod, pinnedVersion?: string): Promise<ModListItem> {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('mod_list_items')
      .insert({
        user_id: userId,
        list_id: listId,
        mod_name: mod.name,
        mod_slug: mod.slug,
        source_urls: mod.sources,
        icon_url: mod.iconUrl ?? null,
        pinned_version: pinnedVersion ?? null,
      })
      .select('*')
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? 'Mod追加に失敗しました');
    }

    return toItem(data as ModListItemRow);
  },
  async removeMod(_listId: string, itemId: string): Promise<void> {
    await getUserId();
    const { error } = await supabase.from('mod_list_items').delete().eq('id', itemId);
    if (error) {
      throw new Error(error.message);
    }
  },
  async updatePinnedVersion(itemId: string, version: string): Promise<ModListItem> {
    await getUserId();
    const { data, error } = await supabase
      .from('mod_list_items')
      .update({ pinned_version: version })
      .eq('id', itemId)
      .select('*')
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? 'ピン留め更新に失敗しました');
    }

    return toItem(data as ModListItemRow);
  },
};
