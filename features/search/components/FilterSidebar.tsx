'use client';

import type { ModLoader, ModSource } from '@/features/search/types/search';

type FilterSidebarProps = {
  minecraftVersion?: string;
  onMinecraftVersionChange: (value?: string) => void;
  loader?: ModLoader;
  onLoaderChange: (value?: ModLoader) => void;
  sources: ModSource[];
  onSourcesChange: (value: ModSource[]) => void;
};

const SOURCE_LABELS: Record<ModSource, string> = {
  modrinth: 'Modrinth',
  curseforge: 'CurseForge',
  github: 'GitHub',
};

export function FilterSidebar({
  minecraftVersion,
  onMinecraftVersionChange,
  loader,
  onLoaderChange,
  sources,
  onSourcesChange,
}: FilterSidebarProps) {
  const toggleSource = (source: ModSource) => {
    if (sources.includes(source)) {
      onSourcesChange(sources.filter((item) => item !== source));
    } else {
      onSourcesChange([...sources, source]);
    }
  };

  return (
    <aside className="space-y-4 rounded-box border border-base-200 bg-base-100 p-4">
      <div>
        <h3 className="text-sm font-semibold">Minecraftバージョン</h3>
        <input
          className="input input-bordered mt-2 w-full"
          placeholder="例: 1.20.1"
          value={minecraftVersion ?? ''}
          onChange={(event) => onMinecraftVersionChange(event.target.value || undefined)}
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold">ローダー</h3>
        <select
          className="select select-bordered mt-2 w-full"
          value={loader ?? ''}
          onChange={(event) => onLoaderChange((event.target.value || undefined) as ModLoader | undefined)}
        >
          <option value="">指定なし</option>
          <option value="fabric">Fabric</option>
          <option value="forge">Forge</option>
          <option value="neoforge">NeoForge</option>
          <option value="quilt">Quilt</option>
        </select>
      </div>
      <div>
        <h3 className="text-sm font-semibold">ソース</h3>
        <div className="mt-2 space-y-2">
          {(Object.keys(SOURCE_LABELS) as ModSource[]).map((source) => (
            <label key={source} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={sources.includes(source)}
                onChange={() => toggleSource(source)}
              />
              {SOURCE_LABELS[source]}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
