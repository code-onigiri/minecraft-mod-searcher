import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ModListManager } from '@/features/modLists/components/ModListManager';

vi.mock('@/features/modLists/hooks/useModLists', () => ({
  useModLists: () => ({
    lists: [{ id: 'list-id', name: 'テスト', userId: 'user-id', items: [], createdAt: '', updatedAt: '' }],
    createList: vi.fn().mockResolvedValue({ id: 'list-id', name: 'テスト', userId: 'user-id', items: [], createdAt: '', updatedAt: '' }),
    deleteList: vi.fn().mockResolvedValue(undefined),
    removeMod: vi.fn().mockResolvedValue(undefined),
    updatePinnedVersion: vi.fn().mockResolvedValue(undefined),
  }),
}));

vi.mock('@/features/modLists/hooks/useModList', () => ({
  useModList: () => ({ items: [], isLoading: false, error: null }),
}));

describe('ModListManager', () => {
  it('リスト作成ボタンが表示される', async () => {
    const user = userEvent.setup();

    render(<ModListManager />);

    await user.type(screen.getByPlaceholderText('例: 便利Mod'), '便利Mod');
    await user.click(screen.getByRole('button', { name: '作成' }));

    expect(screen.getByText('テスト')).toBeInTheDocument();
  });
});
