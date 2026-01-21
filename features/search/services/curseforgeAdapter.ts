import type { CurseForgeSearchResponse } from '@/features/search/types/search';

type CurseForgeSearchParams = {
  searchFilter: string;
  gameVersion?: string;
  modLoaderType?: 1 | 4 | 5 | 6;
  pageSize?: number;
  index?: number;
};

type CurseForgeSearchResult = CurseForgeSearchResponse & { skipped?: boolean };

const CURSEFORGE_BASE_URL = 'https://api.curseforge.com/v1';
const MINECRAFT_GAME_ID = 432;

export const searchCurseForge = async (
  params: CurseForgeSearchParams,
  apiKey?: string,
): Promise<CurseForgeSearchResult> => {
  if (!apiKey) {
    return {
      data: [],
      pagination: { index: 0, pageSize: 0, totalCount: 0 },
      skipped: true,
    };
  }

  const url = new URL(`${CURSEFORGE_BASE_URL}/mods/search`);
  url.searchParams.set('gameId', String(MINECRAFT_GAME_ID));
  url.searchParams.set('searchFilter', params.searchFilter);

  if (params.gameVersion) {
    url.searchParams.set('gameVersion', params.gameVersion);
  }
  if (params.modLoaderType) {
    url.searchParams.set('modLoaderType', String(params.modLoaderType));
  }
  if (params.pageSize) {
    url.searchParams.set('pageSize', String(params.pageSize));
  }
  if (params.index) {
    url.searchParams.set('index', String(params.index));
  }

  const response = await fetch(url.toString(), {
    headers: { 'x-api-key': apiKey },
  });

  if (!response.ok) {
    throw new Error('CurseForge検索に失敗しました');
  }

  return (await response.json()) as CurseForgeSearchResult;
};

export const curseforgeAdapter = {
  search: searchCurseForge,
};
