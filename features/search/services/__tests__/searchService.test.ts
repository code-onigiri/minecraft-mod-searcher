import { describe, expect, it, vi } from 'vitest';

import { createSearchService } from '@/features/search/services/searchService';

const modrinthAdapter = { search: vi.fn() };
const curseforgeAdapter = { search: vi.fn() };
const githubAdapter = { search: vi.fn() };
const identityResolver = { resolve: vi.fn() };
const cache = { get: vi.fn(), set: vi.fn(), buildKey: vi.fn() };

describe('searchService', () => {
  it('各ソースの結果を統合する', async () => {
    modrinthAdapter.search.mockResolvedValue({ hits: [], total_hits: 0 });
    curseforgeAdapter.search.mockResolvedValue({ data: [], pagination: { index: 0, pageSize: 20, totalCount: 0 } });
    githubAdapter.search.mockResolvedValue({ items: [], total_count: 0 });
    identityResolver.resolve.mockReturnValue([]);
    cache.get.mockReturnValue(null);
    cache.buildKey.mockReturnValue('key');

    const service = createSearchService({
      modrinthAdapter,
      curseforgeAdapter,
      githubAdapter,
      identityResolver,
      cacheService: cache,
    });

    const result = await service.search({ query: 'sodium' });

    expect(result.mods).toEqual([]);
    expect(result.sourceStatus.modrinth.success).toBe(true);
    expect(result.sourceStatus.curseforge.success).toBe(true);
    expect(result.sourceStatus.github.success).toBe(true);
  });

  it('デバウンス検索を遅延実行する', async () => {
    vi.useFakeTimers();

    const service = createSearchService({
      modrinthAdapter,
      curseforgeAdapter,
      githubAdapter,
      identityResolver,
      cacheService: cache,
    });

    const search = vi.fn().mockResolvedValue({ mods: [], sourceStatus: { modrinth: { success: true, resultCount: 0 }, curseforge: { success: true, resultCount: 0 }, github: { success: true, resultCount: 0 } }, fromCache: false });
    const debounced = service.createDebouncedSearch(search, 300);

    const promise = debounced({ query: 'a' });
    vi.advanceTimersByTime(300);

    await expect(promise).resolves.toBeDefined();
    vi.useRealTimers();
  });
});
