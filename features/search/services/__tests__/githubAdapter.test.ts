import { beforeEach, describe, expect, it, vi } from 'vitest';

import { searchGitHubRepositories } from '@/features/search/services/githubAdapter';

const mockFetch = vi.fn();

global.fetch = mockFetch as unknown as typeof fetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe('githubAdapter', () => {
  it('認証なしで検索する', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [], total_count: 0 }),
    });

    await searchGitHubRepositories({ query: 'minecraft mod' });

    const [url, init] = mockFetch.mock.calls[0];
    const parsedUrl = new URL(url as string);

    expect(parsedUrl.searchParams.get('q')).toBe('minecraft mod');
    expect((init as RequestInit).headers).toEqual({});
  });

  it('トークンがある場合はAuthorizationヘッダーを付与する', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [], total_count: 0 }),
    });

    await searchGitHubRepositories({ query: 'minecraft mod' }, 'token');

    const [, init] = mockFetch.mock.calls[0];

    expect((init as RequestInit).headers).toEqual({ Authorization: 'Bearer token' });
  });
});
