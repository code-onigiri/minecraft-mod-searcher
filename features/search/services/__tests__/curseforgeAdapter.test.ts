import { describe, expect, it, vi } from 'vitest';

import { searchCurseForge } from '@/features/search/services/curseforgeAdapter';

const mockFetch = vi.fn();

global.fetch = mockFetch as unknown as typeof fetch;

describe('curseforgeAdapter', () => {
  it('APIキーがない場合は検索をスキップする', async () => {
    const result = await searchCurseForge({ searchFilter: 'utility' }, '');

    expect(result.skipped).toBe(true);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('APIキー付きで検索する', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [], pagination: { index: 0, pageSize: 20, totalCount: 0 } }),
    });

    await searchCurseForge({ searchFilter: 'utility', gameVersion: '1.20.1', modLoaderType: 4 }, 'key');

    const [url, init] = mockFetch.mock.calls[0];
    const parsedUrl = new URL(url as string);

    expect(parsedUrl.searchParams.get('gameId')).toBe('432');
    expect(parsedUrl.searchParams.get('searchFilter')).toBe('utility');
    expect((init as RequestInit).headers).toEqual({ 'x-api-key': 'key' });
  });
});
