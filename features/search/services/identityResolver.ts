import type {
  CurseForgeMod,
  GitHubRepo,
  ModSourceInfo,
  ModLoader,
  ModrinthMod,
  SourceResults,
  UnifiedMod,
} from '@/features/search/types/search';

const normalizeUrl = (url?: string): string | null => {
  if (!url) {
    return null;
  }
  try {
    const parsed = new URL(url);
    return `${parsed.host}${parsed.pathname}`.toLowerCase();
  } catch {
    return null;
  }
};

const extractLoaders = (categories: string[] = []): ModLoader[] => {
  const loaders: ModLoader[] = [];
  const map: Record<string, ModLoader> = {
    fabric: 'fabric',
    forge: 'forge',
    neoforge: 'neoforge',
    quilt: 'quilt',
  };

  categories.forEach((category) => {
    const loader = map[category];
    if (loader && !loaders.includes(loader)) {
      loaders.push(loader);
    }
  });

  return loaders;
};

const extractCurseForgeLoaders = (mod: CurseForgeMod): ModLoader[] => {
  const loaders: ModLoader[] = [];
  const map: Record<number, ModLoader> = {
    1: 'forge',
    4: 'fabric',
    5: 'quilt',
    6: 'neoforge',
  };

  (mod.latestFilesIndexes ?? []).forEach((file) => {
    if (file.modLoader && map[file.modLoader] && !loaders.includes(map[file.modLoader])) {
      loaders.push(map[file.modLoader]);
    }
  });

  return loaders;
};

const buildSource = (source: ModSourceInfo['source'], id: string, url: string): ModSourceInfo => ({
  source,
  id,
  url,
});

const getModrinthUrl = (mod: ModrinthMod): string =>
  mod.project_url ?? `https://modrinth.com/mod/${mod.slug}`;

const getCurseForgeUrl = (mod: CurseForgeMod): string =>
  mod.links?.websiteUrl ?? `https://www.curseforge.com/minecraft/mc-mods/${mod.slug}`;

export const resolveIdentity = (results: SourceResults): UnifiedMod[] => {
  const map = new Map<string, UnifiedMod>();
  const githubIndex = new Map<string, GitHubRepo>();

  results.github.forEach((repo) => {
    const key = normalizeUrl(repo.html_url);
    if (key) {
      githubIndex.set(key, repo);
    }
  });

  results.modrinth.forEach((mod) => {
    const sourceUrlKey = normalizeUrl(mod.source_url) ?? normalizeUrl(mod.project_url);
    const githubRepo = sourceUrlKey ? githubIndex.get(sourceUrlKey) : undefined;

    const unified: UnifiedMod = {
      id: mod.slug,
      slug: mod.slug,
      name: mod.title,
      description: mod.description,
      iconUrl: mod.icon_url ?? undefined,
      sources: [buildSource('modrinth', mod.project_id, getModrinthUrl(mod))],
      versions: mod.versions ?? [],
      loaders: extractLoaders(mod.categories ?? []),
      downloads: mod.downloads ?? 0,
      updatedAt: mod.date_modified,
    };

    if (githubRepo) {
      unified.sources.push(buildSource('github', String(githubRepo.id), githubRepo.html_url));
    }

    map.set(mod.slug, unified);
  });

  results.curseforge.forEach((mod) => {
    const existing = map.get(mod.slug);
    const source = buildSource('curseforge', String(mod.id), getCurseForgeUrl(mod));

    if (existing) {
      existing.sources.push(source);
      existing.downloads = Math.max(existing.downloads, mod.downloadCount ?? 0);
      existing.updatedAt = mod.dateModified ?? existing.updatedAt;
      existing.loaders = Array.from(new Set([...existing.loaders, ...extractCurseForgeLoaders(mod)]));
      return;
    }

    map.set(mod.slug, {
      id: mod.slug,
      slug: mod.slug,
      name: mod.name,
      description: mod.summary,
      iconUrl: mod.logo?.url ?? undefined,
      sources: [source],
      versions: (mod.latestFilesIndexes ?? []).map((file) => file.gameVersion),
      loaders: extractCurseForgeLoaders(mod),
      downloads: mod.downloadCount ?? 0,
      updatedAt: mod.dateModified ?? new Date().toISOString(),
    });
  });

  results.github.forEach((repo) => {
    const existing = map.get(repo.name);
    if (existing) {
      const already = existing.sources.some((source) => source.source === 'github');
      if (!already) {
        existing.sources.push(buildSource('github', String(repo.id), repo.html_url));
      }
      existing.updatedAt = repo.updated_at;
      return;
    }

    const githubKey = normalizeUrl(repo.html_url);
    const matched = githubKey
      ? Array.from(map.values()).find((mod) =>
          mod.sources.some((source) => normalizeUrl(source.url) === githubKey),
        )
      : undefined;

    if (matched) {
      matched.sources.push(buildSource('github', String(repo.id), repo.html_url));
      return;
    }

    map.set(repo.name, {
      id: String(repo.id),
      slug: repo.name,
      name: repo.full_name,
      description: repo.description ?? '',
      iconUrl: undefined,
      sources: [buildSource('github', String(repo.id), repo.html_url)],
      versions: [],
      loaders: [],
      downloads: repo.stargazers_count ?? 0,
      updatedAt: repo.updated_at,
    });
  });

  return Array.from(map.values());
};

export const identityResolver = {
  resolve: resolveIdentity,
};
