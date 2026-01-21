import { describe, expect, it, vi } from 'vitest';

import { createSearchService } from '@/features/search/services/searchService';
import { identityResolver } from '@/features/search/services/identityResolver';
import { filterService } from '@/features/search/services/filterService';

const modrinthAdapter = {
  search: vi.fn().mockResolvedValue({
    hits: [
      {
        project_id: 'modrinth-id',
        slug: 'sodium',
        title: 'Sodium',
        description: 'fast',
        icon_url: undefined,
        versions: ['1.20.1'],
        categories: ['fabric'],
        downloads: 100,
        date_modified: '2026-01-20T00:00:00Z',
        source_url: undefined,
        project_url: 'https://modrinth.com/mod/sodium',
      },
    ],
    total_hits: 1,
  }),
};

const curseforgeAdapter = {
  search: vi.fn().mockResolvedValue({
    data: [
      {
        id: 123,
        slug: 'sodium',
        name: 'Sodium',
        summary: 'fast',
        logo: { url: 'https://example.com/icon.png' },
        links: { websiteUrl: 'https://www.curseforge.com/minecraft/mc-mods/sodium' },
        latestFilesIndexes: [{ gameVersion: '1.20.1', modLoader: 4 }],
        downloadCount: 200,
        dateModified: '2026-01-20T00:00:00Z',
      },
    ],
    pagination: { index: 0, pageSize: 20, totalCount: 1 },
  }),
};

const githubAdapter = {
  search: vi.fn().mockResolvedValue({
    items: [],
    total_count: 0,
  }),
};

const cacheService = {
  get: vi.fn().mockReturnValue(null),
  set: vi.fn(),
  buildKey: vi.fn().mockReturnValue('cache-key'),
};

describe('検索フロー統合', () => {
  it('検索→名寄せ→フィルタが動作する', async () => {
    const service = createSearchService({
      modrinthAdapter,
      curseforgeAdapter,
      githubAdapter,
      identityResolver,
      cacheService,
    });

    const result = await service.search({ query: 'sodium', loader: 'fabric' });
    const filtered = filterService.filterMods(result.mods, { loader: 'fabric' });

    expect(result.mods.length).toBeGreaterThan(0);
    expect(filtered[0].slug).toBe('sodium');
    expect(cacheService.set).toHaveBeenCalled();
  });
});
