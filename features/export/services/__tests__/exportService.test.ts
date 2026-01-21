import { describe, expect, it, vi } from 'vitest';

import { exportService } from '@/features/export/services/exportService';

const mockList = {
  id: 'list-id',
  userId: 'user-id',
  name: '便利Mod',
  items: [
    {
      id: 'item-id',
      listId: 'list-id',
      modId: 'sodium',
      modName: 'Sodium',
      iconUrl: undefined,
      sources: [{ source: 'modrinth', url: 'https://modrinth.com/mod/sodium', id: 'modrinth-id' }],
      pinnedVersion: '1.20.1',
      addedAt: '2026-01-20T00:00:00Z',
    },
  ],
  createdAt: '2026-01-20T00:00:00Z',
  updatedAt: '2026-01-20T00:00:00Z',
};

describe('exportService', () => {
  it('Markdown形式を生成する', () => {
    const markdown = exportService.toMarkdown(mockList);

    expect(markdown).toContain('- [Sodium](https://modrinth.com/mod/sodium)');
    expect(markdown).toContain('1.20.1');
  });

  it('クリップボードにコピーする', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    await exportService.copyToClipboard('content');

    expect(writeText).toHaveBeenCalledWith('content');
  });
});
