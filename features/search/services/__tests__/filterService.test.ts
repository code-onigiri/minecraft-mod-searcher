import { describe, expect, it } from 'vitest';

import { filterMods } from '@/features/search/services/filterService';

const mods = [
  {
    id: '1',
    slug: 'a',
    name: 'A',
    description: '',
    sources: [],
    versions: ['1.20.1'],
    loaders: ['fabric'],
    downloads: 0,
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    slug: 'b',
    name: 'B',
    description: '',
    sources: [],
    versions: ['1.19.4'],
    loaders: ['forge'],
    downloads: 0,
    updatedAt: '2024-01-01',
  },
];

describe('filterService', () => {
  it('バージョンでフィルタリングする', () => {
    const result = filterMods(mods, { minecraftVersion: '1.20.1' });

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('a');
  });

  it('ローダーでフィルタリングする', () => {
    const result = filterMods(mods, { loader: 'forge' });

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('b');
  });
});
