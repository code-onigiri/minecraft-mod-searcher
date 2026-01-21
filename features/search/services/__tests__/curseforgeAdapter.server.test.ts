// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { searchCurseForge } from '@/features/search/services/curseforgeAdapter';

const mockFetch = vi.fn();

beforeEach(() => {
  mockFetch.mockReset();
});

describe('curseforgeAdapter (server)', () => {
  it('APIキー未設定時はスキップする', async () => {
    const result = await searchCurseForge({ searchFilter: 'sodium' });

    expect(result.skipped).toBe(true);
    expect(result.data).toEqual([]);
  });

  it('APIキー付きで検索する', async () => {
    globalThis.fetch = mockFetch as typeof fetch;
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: [], pagination: { index: 0, pageSize: 0, totalCount: 0 } }),
    });

    await searchCurseForge({ searchFilter: 'sodium', gameVersion: '1.20.1', modLoaderType: 4 }, 'key');

    const [url, options] = mockFetch.mock.calls[0];
    const parsed = new URL(url as string);
    expect(parsed.searchParams.get('searchFilter')).toBe('sodium');
    expect((options as { headers: Record<string, string> }).headers['x-api-key']).toBe('key');
  });
});
