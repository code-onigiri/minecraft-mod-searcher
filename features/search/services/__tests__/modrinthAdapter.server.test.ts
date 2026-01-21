// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { searchModrinth } from '@/features/search/services/modrinthAdapter';

const mockFetch = vi.fn();

beforeEach(() => {
  mockFetch.mockReset();
});

describe('modrinthAdapter (server)', () => {
  it('検索パラメータを付与してリクエストする', async () => {
    globalThis.fetch = mockFetch as typeof fetch;

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ hits: [], total_hits: 0 }),
    });

    await searchModrinth({ query: 'sodium', minecraftVersion: '1.20.1', loader: 'fabric' });

    const url = new URL(mockFetch.mock.calls[0][0]);
    expect(url.searchParams.get('query')).toBe('sodium');
    expect(url.searchParams.get('facets')).toContain('versions:1.20.1');
  });

  it('APIエラー時に例外を投げる', async () => {
    globalThis.fetch = mockFetch as typeof fetch;
    mockFetch.mockResolvedValueOnce({ ok: false });

    await expect(searchModrinth({ query: 'error' })).rejects.toThrow('Modrinth検索に失敗しました');
  });
});
