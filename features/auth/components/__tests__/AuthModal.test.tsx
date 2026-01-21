import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AuthModal } from '@/features/auth/components/AuthModal';

vi.mock('@/features/auth/components/AuthButtons', () => ({
  AuthButtons: () => <div>AuthButtons</div>,
}));

describe('AuthModal', () => {
  it('モーダルが開いている場合に内容を表示する', () => {
    render(<AuthModal isOpen onClose={() => undefined} />);

    expect(screen.getByText('ログインが必要です')).toBeInTheDocument();
  });

  it('閉じるボタンでコールバックを呼ぶ', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<AuthModal isOpen onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: '閉じる' }));

    expect(onClose).toHaveBeenCalled();
  });
});
