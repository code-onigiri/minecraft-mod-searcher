import type {
  ModSource,
  SearchParams,
  SearchResult,
  SourceResults,
  SourceStatus,
} from '@/features/search/types/search';
import { cacheService as defaultCacheService } from '@/features/search/services/cacheService';
import { curseforgeAdapter as defaultCurseforgeAdapter } from '@/features/search/services/curseforgeAdapter';
import { githubAdapter as defaultGithubAdapter } from '@/features/search/services/githubAdapter';
import { identityResolver as defaultIdentityResolver } from '@/features/search/services/identityResolver';
import { modrinthAdapter as defaultModrinthAdapter } from '@/features/search/services/modrinthAdapter';

const ALL_SOURCES: ModSource[] = ['modrinth', 'curseforge', 'github'];

type SearchServiceDependencies = {
  modrinthAdapter: { search: (params: { query: string; minecraftVersion?: string; loader?: SearchParams['loader'] }) => Promise<{ hits: SourceResults['modrinth']; total_hits: number }> };
  curseforgeAdapter: { search: (params: { searchFilter: string; gameVersion?: string; modLoaderType?: 1 | 4 | 5 | 6 }, apiKey?: string) => Promise<{ data: SourceResults['curseforge']; pagination: { totalCount: number }; skipped?: boolean }> };
  githubAdapter: { search: (params: { query: string }, token?: string) => Promise<{ items: SourceResults['github']; total_count: number }> };
  identityResolver: { resolve: (results: SourceResults) => SearchResult['mods'] };
  cacheService: typeof defaultCacheService;
};

type SearchOptions = {
  curseforgeApiKey?: string;
  githubToken?: string;
  onProgress?: (partial: SearchResult) => void;
};

const emptyStatus = (): Record<ModSource, SourceStatus> => ({
  modrinth: { success: false, resultCount: 0 },
  curseforge: { success: false, resultCount: 0 },
  github: { success: false, resultCount: 0 },
});

export const createSearchService = (deps: SearchServiceDependencies) => {
  const search = async (params: SearchParams, options: SearchOptions = {}): Promise<SearchResult> => {
    const sources = params.sources ?? ALL_SOURCES;
    const cacheKey = deps.cacheService.buildKey({
      query: params.query,
      minecraftVersion: params.minecraftVersion,
      loader: params.loader,
      sources,
    });

    const cached = deps.cacheService.get<SearchResult['mods']>(cacheKey);
    if (cached) {
      return { mods: cached, sourceStatus: emptyStatus(), fromCache: true };
    }

    const sourceStatus = emptyStatus();
    const results: SourceResults = { modrinth: [], curseforge: [], github: [] };

    const tasks: Promise<void>[] = [];

    if (sources.includes('modrinth')) {
      const task = deps.modrinthAdapter
        .search({ query: params.query, minecraftVersion: params.minecraftVersion, loader: params.loader })
        .then((response) => {
          results.modrinth = response.hits;
          sourceStatus.modrinth = { success: true, resultCount: response.total_hits };
        })
        .catch((error: Error) => {
          sourceStatus.modrinth = { success: false, resultCount: 0, error: error.message };
        });
      tasks.push(task.then(() => {
        options.onProgress?.({ mods: deps.identityResolver.resolve(results), sourceStatus, fromCache: false });
      }));
    }

    if (sources.includes('curseforge')) {
      const task = deps.curseforgeAdapter
        .search(
          {
            searchFilter: params.query,
            gameVersion: params.minecraftVersion,
            modLoaderType: params.loader === 'fabric' ? 4 : params.loader === 'forge' ? 1 : params.loader === 'quilt' ? 5 : params.loader === 'neoforge' ? 6 : undefined,
          },
          options.curseforgeApiKey,
        )
        .then((response) => {
          results.curseforge = response.data;
          sourceStatus.curseforge = {
            success: true,
            resultCount: response.pagination.totalCount ?? response.data.length,
            skipped: response.skipped,
          };
        })
        .catch((error: Error) => {
          sourceStatus.curseforge = { success: false, resultCount: 0, error: error.message };
        });
      tasks.push(task.then(() => {
        options.onProgress?.({ mods: deps.identityResolver.resolve(results), sourceStatus, fromCache: false });
      }));
    }

    if (sources.includes('github')) {
      if (!options.githubToken) {
        sourceStatus.github = { success: true, resultCount: 0, skipped: true };
      } else {
        const task = deps.githubAdapter
          .search({ query: params.query }, options.githubToken)
          .then((response) => {
            results.github = response.items;
            sourceStatus.github = { success: true, resultCount: response.total_count };
          })
          .catch((error: Error) => {
            sourceStatus.github = { success: false, resultCount: 0, error: error.message };
          });
        tasks.push(task.then(() => {
          options.onProgress?.({ mods: deps.identityResolver.resolve(results), sourceStatus, fromCache: false });
        }));
      }
    }

    await Promise.allSettled(tasks);

    const mods = deps.identityResolver.resolve(results);
    deps.cacheService.set(cacheKey, mods, 5 * 60 * 1000);

    return { mods, sourceStatus, fromCache: false };
  };

  const searchWithCache = (params: SearchParams, options?: SearchOptions) => search(params, options);

  const createDebouncedSearch = <T extends (...args: never[]) => Promise<SearchResult>>(
    fn: T,
    delay = 300,
  ) => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    return (...args: Parameters<T>) =>
      new Promise<SearchResult>((resolve) => {
        if (timeoutId) {
          globalThis.clearTimeout(timeoutId);
        }
        timeoutId = globalThis.setTimeout(() => {
          void fn(...args).then(resolve);
        }, delay);
      });
  };

  return { search, searchWithCache, createDebouncedSearch };
};

export const searchService = createSearchService({
  modrinthAdapter: defaultModrinthAdapter,
  curseforgeAdapter: defaultCurseforgeAdapter,
  githubAdapter: defaultGithubAdapter,
  identityResolver: defaultIdentityResolver,
  cacheService: defaultCacheService,
});
