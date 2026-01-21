// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { searchGitHubRepositories } from '@/features/search/services/githubAdapter';

const mockFetch = vi.fn();

beforeEach(() => {
  mockFetch.mockReset();
});

describe('githubAdapter (server)', () => {
  it('トークンなしで検索する', async () => {
    globalThis.fetch = mockFetch as typeof fetch;
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ items: [], total_count: 0 }),
    });

    await searchGitHubRepositories({ query: 'sodium' });

    const [url, options] = mockFetch.mock.calls[0];
    expect(new URL(url as string).searchParams.get('q')).toBe('sodium');
    expect((options as { headers: Record<string, string> }).headers).toEqual({});
  });

  it('トークン付きで検索する', async () => {
    globalThis.fetch = mockFetch as typeof fetch;
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ items: [], total_count: 0 }),
    });

    await searchGitHubRepositories({ query: 'sodium' }, 'token');

    const [, options] = mockFetch.mock.calls[0];
    expect((options as { headers: Record<string, string> }).headers.Authorization).toBe('Bearer token');
  });
});
