import { describe, expect, it, vi } from 'vitest';

import { searchModrinth } from '@/features/search/services/modrinthAdapter';

const mockFetch = vi.fn();

global.fetch = mockFetch as unknown as typeof fetch;

describe('modrinthAdapter', () => {
  it('クエリとfacetsを含むURLで検索する', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ hits: [], total_hits: 0 }),
    });

    await searchModrinth({
      query: 'performance',
      minecraftVersion: '1.20.1',
      loader: 'fabric',
    });

    const url = new URL(mockFetch.mock.calls[0][0] as string);

    expect(url.origin).toBe('https://api.modrinth.com');
    expect(url.searchParams.get('query')).toBe('performance');
    expect(url.searchParams.get('facets')).toContain('versions:1.20.1');
    expect(url.searchParams.get('facets')).toContain('categories:fabric');
  });
});
