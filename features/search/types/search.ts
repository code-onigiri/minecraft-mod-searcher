export type ModLoader = 'fabric' | 'forge' | 'neoforge' | 'quilt';
export type ModSource = 'modrinth' | 'curseforge' | 'github';

export type SearchParams = {
  query: string;
  minecraftVersion?: string;
  loader?: ModLoader;
  sources?: ModSource[];
};

export type SourceStatus = {
  success: boolean;
  error?: string;
  resultCount: number;
  skipped?: boolean;
};

export type SearchResult = {
  mods: UnifiedMod[];
  sourceStatus: Record<ModSource, SourceStatus>;
  fromCache: boolean;
};

export type ModSourceInfo = {
  source: ModSource;
  url: string;
  id: string;
};

export type UnifiedMod = {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconUrl?: string;
  sources: ModSourceInfo[];
  versions: string[];
  loaders: ModLoader[];
  downloads: number;
  updatedAt: string;
};

export type ModrinthMod = {
  project_id: string;
  slug: string;
  title: string;
  description: string;
  icon_url?: string;
  versions: string[];
  categories: string[];
  downloads: number;
  date_modified: string;
  source_url?: string;
  project_url?: string;
};

export type CurseForgeMod = {
  id: number;
  slug: string;
  name: string;
  summary: string;
  logo?: { url: string } | null;
  links?: { websiteUrl?: string };
  latestFilesIndexes?: Array<{ gameVersion: string; modLoader?: number }>;
  downloadCount?: number;
  dateModified?: string;
};

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  description?: string | null;
  html_url: string;
  topics?: string[];
  stargazers_count?: number;
  updated_at: string;
};

export type SourceResults = {
  modrinth: ModrinthMod[];
  curseforge: CurseForgeMod[];
  github: GitHubRepo[];
};

export type ModrinthSearchResponse = {
  hits: ModrinthMod[];
  total_hits: number;
};

export type CurseForgeSearchResponse = {
  data: CurseForgeMod[];
  pagination: { index: number; pageSize: number; totalCount: number };
};

export type GitHubSearchResponse = {
  items: GitHubRepo[];
  total_count: number;
};
