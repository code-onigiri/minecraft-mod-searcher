'use client';

import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

import { BookmarkButton } from '@/features/bookmarks/components/BookmarkButton';
import { AddToListButton } from '@/features/modLists/components/AddToListButton';
import type { UnifiedMod } from '@/features/search/types/search';

import { SourceIndicator } from './SourceIndicator';

type ModCardProps = {
  mod: UnifiedMod;
  onRequireAuth?: () => void;
};

export function ModCard({ mod, onRequireAuth }: ModCardProps) {
  const updatedLabel = formatDistanceToNow(new Date(mod.updatedAt), { addSuffix: true, locale: ja });

  return (
    <div className="rounded-box border border-base-200 bg-base-100 p-4 shadow-sm">
      <div className="flex gap-4">
        {mod.iconUrl ? (
          <img src={mod.iconUrl} alt={mod.name} className="h-12 w-12 rounded" />
        ) : (
          <div className="h-12 w-12 rounded bg-base-200" />
        )}
        <div className="flex-1 space-y-2">
          <div>
            <h3 className="text-lg font-semibold">{mod.name}</h3>
            <p className="text-sm text-base-content/70">{mod.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {mod.versions.slice(0, 3).map((version) => (
              <span key={version} className="badge badge-outline">
                {version}
              </span>
            ))}
            {mod.loaders.map((loader) => (
              <span key={loader} className="badge badge-ghost">
                {loader}
              </span>
            ))}
          </div>
          <SourceIndicator sources={mod.sources.map((source) => source.source)} />
          <p className="text-xs text-base-content/60">最終更新: {updatedLabel}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <BookmarkButton mod={mod} onRequireAuth={onRequireAuth} />
        <AddToListButton mod={mod} onRequireAuth={onRequireAuth} />
      </div>
    </div>
  );
}
