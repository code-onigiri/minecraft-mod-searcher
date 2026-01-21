import { describe, expect, it } from 'vitest';

import { resolveIdentity } from '@/features/search/services/identityResolver';

const modrinth = [
  {
    project_id: 'mr-1',
    slug: 'sodium',
    title: 'Sodium',
    description: 'fast',
    icon_url: 'icon',
    versions: ['1.20.1'],
    categories: ['fabric'],
    downloads: 100,
    date_modified: '2024-01-01',
    source_url: 'https://github.com/example/sodium',
  },
];

const curseforge = [
  {
    id: 2,
    slug: 'sodium',
    name: 'Sodium CF',
    summary: 'fast',
    logo: { url: 'icon2' },
    latestFilesIndexes: [{ gameVersion: '1.20.1', modLoader: 4 }],
    downloadCount: 50,
    dateModified: '2024-01-02',
  },
];

const github = [
  {
    id: 3,
    name: 'sodium',
    full_name: 'example/sodium',
    description: 'fast',
    html_url: 'https://github.com/example/sodium',
    topics: [],
    stargazers_count: 10,
    updated_at: '2024-01-03',
  },
];

describe('identityResolver', () => {
  it('slug一致で統合する', () => {
    const result = resolveIdentity({ modrinth, curseforge, github: [] });

    expect(result).toHaveLength(1);
    expect(result[0].sources).toHaveLength(2);
  });

  it('GitHubリンク一致で統合する', () => {
    const result = resolveIdentity({ modrinth, curseforge: [], github });

    expect(result).toHaveLength(1);
    expect(result[0].sources).toHaveLength(2);
  });
});
