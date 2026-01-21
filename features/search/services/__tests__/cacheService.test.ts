import { describe, expect, it, vi } from 'vitest';

import { cacheService } from '@/features/search/services/cacheService';

vi.useFakeTimers();

const params = {
  query: 'sodium',
  minecraftVersion: '1.20.1',
  loader: 'fabric',
  sources: ['modrinth', 'curseforge', 'github'],
} as const;

describe('cacheService', () => {
  it('キャッシュキーにクエリとフィルタを含める', () => {
    const key = cacheService.buildKey(params);

    expect(key).toContain('sodium');
    expect(key).toContain('1.20.1');
    expect(key).toContain('fabric');
  });

  it('TTL内ならキャッシュを返す', () => {
    const key = cacheService.buildKey(params);

    cacheService.set(key, { mods: [] }, 300000);

    const value = cacheService.get(key);

    expect(value).toEqual({ mods: [] });
  });

  it('TTLを過ぎたらキャッシュを無効化する', () => {
    const key = cacheService.buildKey(params);

    cacheService.set(key, { mods: [] }, 1000);
    vi.advanceTimersByTime(2000);

    const value = cacheService.get(key);

    expect(value).toBeNull();
  });
});
