import { webcrypto } from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';

import { vaultService } from '@/features/settings/services/vaultService';

const createStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
};

beforeEach(() => {
  globalThis.crypto = webcrypto as Crypto;
  if (!globalThis.localStorage) {
    Object.defineProperty(globalThis, 'localStorage', {
      value: createStorageMock(),
      writable: true,
    });
  }
  globalThis.localStorage.clear();
});

describe('vaultService', () => {
  it('APIキーを暗号化して保存・復号できる', async () => {
    await vaultService.saveApiKey('curseforge', 'secret');

    const value = await vaultService.getApiKey('curseforge');

    expect(value).toBe('secret');
  });

  it('APIキーを削除できる', async () => {
    await vaultService.saveApiKey('curseforge', 'secret');
    await vaultService.removeApiKey('curseforge');

    const value = await vaultService.getApiKey('curseforge');

    expect(value).toBeNull();
  });
});
