import type { ModSource } from '@/features/search/types/search';

const COLOR_MAP: Record<ModSource, string> = {
  modrinth: 'bg-success',
  curseforge: 'bg-warning',
  github: 'bg-neutral',
};

const LABEL_MAP: Record<ModSource, string> = {
  modrinth: 'Modrinth',
  curseforge: 'CurseForge',
  github: 'GitHub',
};

type SourceIndicatorProps = {
  sources: ModSource[];
};

export function SourceIndicator({ sources }: SourceIndicatorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sources.map((source) => (
        <span key={source} className="inline-flex items-center gap-2 text-xs">
          <span className={`h-2 w-2 rounded-full ${COLOR_MAP[source]}`} />
          {LABEL_MAP[source]}
        </span>
      ))}
    </div>
  );
}
