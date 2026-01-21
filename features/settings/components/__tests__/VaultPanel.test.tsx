import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { VaultPanel } from '@/features/settings/components/VaultPanel';

vi.mock('@/features/settings/services/vaultService', () => ({
  vaultService: {
    saveApiKey: vi.fn().mockResolvedValue(undefined),
    removeApiKey: vi.fn().mockResolvedValue(undefined),
    getApiKey: vi.fn().mockResolvedValue(''),
  },
}));

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { id: '1', email: 'user@example.com', provider: 'github' },
    isLoading: false,
    session: null,
  }),
}));

describe('VaultPanel', () => {
  it('APIキー入力フォームを表示する', () => {
    render(<VaultPanel />);

    expect(screen.getByLabelText('CurseForge API Key')).toBeInTheDocument();
  });

  it('APIキーを保存できる', async () => {
    const user = userEvent.setup();

    render(<VaultPanel />);

    await user.type(screen.getByLabelText('CurseForge API Key'), 'key');
    await user.click(screen.getByRole('button', { name: '保存' }));

    expect(await screen.findByText('保存しました')).toBeInTheDocument();
  });
});
import { render, screen } from '@testing-library/react';import { render, screen } from '@testing-library/react';









































});  });    expect(await screen.findByText('保存しました')).toBeInTheDocument();    await user.click(screen.getByRole('button', { name: '保存' }));    await user.type(screen.getByLabelText('CurseForge API Key'), 'key');    render(<VaultPanel />);    const user = userEvent.setup();  it('APIキーを保存できる', async () => {  });    expect(screen.getByLabelText('CurseForge API Key')).toBeInTheDocument();    render(<VaultPanel />);  it('APIキー入力フォームを表示する', () => {describe('VaultPanel', () => {}));  }),    session: null,    isLoading: false,    user: { id: '1', email: 'user@example.com', provider: 'github' },    isAuthenticated: true,  useAuth: () => ({vi.mock('@/features/auth/hooks/useAuth', () => ({}));  },    getApiKey: vi.fn().mockResolvedValue(''),    removeApiKey: vi.fn().mockResolvedValue(undefined),    saveApiKey: vi.fn().mockResolvedValue(undefined),  vaultService: {vi.mock('@/features/settings/services/vaultService', () => ({import { VaultPanel } from '@/features/settings/components/VaultPanel';import { describe, expect, it, vi } from 'vitest';import userEvent from '@testing-library/user-event';import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { VaultPanel } from '@/features/settings/components/VaultPanel';

vi.mock('@/features/settings/services/vaultService', () => ({
  vaultService: {
    saveApiKey: vi.fn().mockResolvedValue(undefined),
    removeApiKey: vi.fn().mockResolvedValue(undefined),
    getApiKey: vi.fn().mockResolvedValue(''),
  },
}));

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { id: '1', email: 'user@example.com', provider: 'github' },
    isLoading: false,
    session: null,
  }),
}));

describe('VaultPanel', () => {
  it('APIキー入力フォームを表示する', () => {
    render(<VaultPanel />);

    expect(screen.getByLabelText('CurseForge API Key')).toBeInTheDocument();
  });

  it('APIキーを保存できる', async () => {
    const user = userEvent.setup();

    render(<VaultPanel />);

    await user.type(screen.getByLabelText('CurseForge API Key'), 'key');
    await user.click(screen.getByRole('button', { name: '保存' }));

    expect(await screen.findByText('保存しました')).toBeInTheDocument();
  });
});
