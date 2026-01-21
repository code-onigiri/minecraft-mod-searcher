import type { ModrinthSearchResponse, ModLoader } from '@/features/search/types/search';

type ModrinthSearchParams = {
  query: string;
  minecraftVersion?: string;
  loader?: ModLoader;
  index?: 'relevance' | 'downloads' | 'follows' | 'newest' | 'updated';
  offset?: number;
  limit?: number;
};

const MODRINTH_BASE_URL = 'https://api.modrinth.com/v2';

const buildFacets = (minecraftVersion?: string, loader?: ModLoader): string | undefined => {
  const facets: string[][] = [];

  if (minecraftVersion) {
    facets.push([`versions:${minecraftVersion}`]);
  }

  if (loader) {
    facets.push([`categories:${loader}`]);
  }

  if (facets.length === 0) {
    return undefined;
  }

  return JSON.stringify(facets);
};

export const searchModrinth = async (params: ModrinthSearchParams): Promise<ModrinthSearchResponse> => {
  const url = new URL(`${MODRINTH_BASE_URL}/search`);
  url.searchParams.set('query', params.query);

  const facets = buildFacets(params.minecraftVersion, params.loader);
  if (facets) {
    url.searchParams.set('facets', facets);
  }

  if (params.index) {
    url.searchParams.set('index', params.index);
  }
  if (params.offset !== undefined) {
    url.searchParams.set('offset', String(params.offset));
  }
  if (params.limit !== undefined) {
    url.searchParams.set('limit', String(params.limit));
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error('Modrinth検索に失敗しました');
  }

  return (await response.json()) as ModrinthSearchResponse;
};

export const modrinthAdapter = {
  search: searchModrinth,
};
