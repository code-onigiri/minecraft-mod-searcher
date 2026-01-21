import type { ModLoader, UnifiedMod } from '@/features/search/types/search';

type FilterParams = {
  minecraftVersion?: string;
  loader?: ModLoader;
};

export const filterMods = (mods: UnifiedMod[], filters: FilterParams): UnifiedMod[] => {
  return mods.filter((mod) => {
    if (filters.minecraftVersion && !mod.versions.includes(filters.minecraftVersion)) {
      return false;
    }

    if (filters.loader && !mod.loaders.includes(filters.loader)) {
      return false;
    }

    return true;
  });
};

export const filterService = {
  filterMods,
};
