import type { GitHubSearchResponse } from '@/features/search/types/search';

type GitHubSearchParams = {
  query: string;
  sort?: 'stars' | 'forks' | 'updated';
  perPage?: number;
  page?: number;
};

const GITHUB_BASE_URL = 'https://api.github.com';

export const searchGitHubRepositories = async (
  params: GitHubSearchParams,
  token?: string,
): Promise<GitHubSearchResponse> => {
  const url = new URL(`${GITHUB_BASE_URL}/search/repositories`);
  url.searchParams.set('q', params.query);

  if (params.sort) {
    url.searchParams.set('sort', params.sort);
  }
  if (params.perPage) {
    url.searchParams.set('per_page', String(params.perPage));
  }
  if (params.page) {
    url.searchParams.set('page', String(params.page));
  }

  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url.toString(), { headers });

  if (!response.ok) {
    throw new Error('GitHub検索に失敗しました');
  }

  return (await response.json()) as GitHubSearchResponse;
};

export const githubAdapter = {
  search: searchGitHubRepositories,
};
