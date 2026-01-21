'use client';

import { useCallback, useMemo, useState } from 'react';

import { authService } from '@/features/auth/services/authService';
import { filterService } from '@/features/search/services/filterService';
import { searchService } from '@/features/search/services/searchService';
import type { ModLoader, ModSource, SearchParams, SearchResult } from '@/features/search/types/search';
import { vaultService } from '@/features/settings/services/vaultService';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [minecraftVersion, setMinecraftVersion] = useState<string | undefined>();
  const [loader, setLoader] = useState<ModLoader | undefined>();
  const [sources, setSources] = useState<ModSource[]>(['modrinth', 'curseforge', 'github']);
  const [result, setResult] = useState<SearchResult>({
    mods: [],
    sourceStatus: {
      modrinth: { success: false, resultCount: 0 },
      curseforge: { success: false, resultCount: 0 },
      github: { success: false, resultCount: 0 },
    },
    fromCache: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useMemo(() => searchService.createDebouncedSearch(searchService.search), []);

  const runSearch = useCallback(async () => {
    if (!query.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const curseforgeApiKey = await vaultService.getApiKey('curseforge');
      const githubToken = await authService.getGitHubToken();

      const params: SearchParams = {
        query: query.trim(),
        minecraftVersion,
        loader,
        sources,
      };

      const next = await debouncedSearch(params, {
        curseforgeApiKey: curseforgeApiKey ?? undefined,
        githubToken: githubToken ?? undefined,
        onProgress: (partial) => {
          const filtered = filterService.filterMods(partial.mods, { minecraftVersion, loader });
          setResult({ ...partial, mods: filtered });
        },
      });

      const filtered = filterService.filterMods(next.mods, { minecraftVersion, loader });
      setResult({ ...next, mods: filtered });
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : '検索に失敗しました';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, query, minecraftVersion, loader, sources]);

  return {
    query,
    setQuery,
    minecraftVersion,
    setMinecraftVersion,
    loader,
    setLoader,
    sources,
    setSources,
    result,
    isLoading,
    error,
    runSearch,
  };
};
