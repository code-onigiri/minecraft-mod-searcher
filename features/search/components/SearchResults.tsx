'use client';

import type { UnifiedMod } from '@/features/search/types/search';

import { ModCard } from './ModCard';
import { SkeletonCard } from './SkeletonCard';

type SearchResultsProps = {
  mods: UnifiedMod[];
  isLoading: boolean;
  onRequireAuth?: () => void;
};

export function SearchResults({ mods, isLoading, onRequireAuth }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (mods.length === 0) {
    return <p className="text-sm text-base-content/70">検索結果がありません。</p>;
  }

  return (
    <div className="grid gap-4">
      {mods.map((mod) => (
        <ModCard key={mod.id} mod={mod} onRequireAuth={onRequireAuth} />
      ))}
    </div>
  );
}
