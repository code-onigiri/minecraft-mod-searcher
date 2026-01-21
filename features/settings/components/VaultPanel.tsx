'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { vaultService } from '@/features/settings/services/vaultService';

const CURSEFORGE_SCOPE = 'curseforge' as const;

type Status = 'idle' | 'saved' | 'deleted' | 'error';

export function VaultPanel() {
  const { isAuthenticated } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    vaultService.getApiKey(CURSEFORGE_SCOPE).then((value) => {
      setApiKey(value ?? '');
    });
  }, []);

  const handleSave = async () => {
    try {
      await vaultService.saveApiKey(CURSEFORGE_SCOPE, apiKey);
      setStatus('saved');
    } catch {
      setStatus('error');
    }
  };

  const handleRemove = async () => {
    try {
      await vaultService.removeApiKey(CURSEFORGE_SCOPE);
      setApiKey('');
      setStatus('deleted');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="space-y-4 rounded-box border border-base-200 bg-base-100 p-6">
      <div>
        <h2 className="text-lg font-semibold">The Vault</h2>
        <p className="text-sm text-base-content/70">
          CurseForge API Keyはブラウザ内で暗号化保存され、サーバーに送信されません。
        </p>
      </div>
      <div className="space-y-2">
        <label className="form-control">
          <span className="label-text">CurseForge API Key</span>
          <input
            className="input input-bordered"
            type="password"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder="x-api-key"
          />
        </label>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={handleSave}>
            保存
          </button>
          <button className="btn btn-ghost" onClick={handleRemove}>
            削除
          </button>
        </div>
        {status === 'saved' ? <p className="text-sm text-success">保存しました</p> : null}
        {status === 'deleted' ? <p className="text-sm text-warning">削除しました</p> : null}
        {status === 'error' ? <p className="text-sm text-error">保存に失敗しました</p> : null}
      </div>
      <div className="divider" />
      <div>
        <h3 className="font-semibold">GitHub連携</h3>
        <p className="text-sm text-base-content/70">
          状態: {isAuthenticated ? '接続済み' : '未接続'}
        </p>
        <button className="btn btn-outline btn-sm mt-2" disabled={!isAuthenticated}>
          再認証
        </button>
      </div>
    </section>
  );
}
