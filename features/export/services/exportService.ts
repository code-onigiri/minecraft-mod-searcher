import type { ModList } from '@/types/modList';

const pickPrimaryUrl = (sources: ModList['items'][number]['sources']): string | null => {
  if (sources.length === 0) {
    return null;
  }
  return sources[0].url;
};

export const exportService = {
  toMarkdown(list: ModList): string {
    const header = `# ${list.name}`;
    const lines = list.items.map((item) => {
      const url = pickPrimaryUrl(item.sources);
      const versionLabel = item.pinnedVersion ? ` (Pinned: ${item.pinnedVersion})` : '';
      if (url) {
        return `- [${item.modName}](${url})${versionLabel}`;
      }
      return `- ${item.modName}${versionLabel}`;
    });

    return [header, '', ...lines].join('\n');
  },
  async copyToClipboard(content: string): Promise<void> {
    if (!navigator.clipboard?.writeText) {
      throw new Error('クリップボードが利用できません');
    }
    await navigator.clipboard.writeText(content);
  },
  downloadAsFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  },
};
