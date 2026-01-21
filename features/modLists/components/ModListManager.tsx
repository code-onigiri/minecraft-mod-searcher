'use client';

import { useEffect, useState } from 'react';

import { useModList } from '@/features/modLists/hooks/useModList';
import { useModLists } from '@/features/modLists/hooks/useModLists';
import { exportService } from '@/features/export/services/exportService';
import { useToast } from '@/components/ui/ToastProvider';

export function ModListManager() {
  const { lists, createList, deleteList, removeMod, updatePinnedVersion } = useModLists();
  const [selectedListId, setSelectedListId] = useState<string | undefined>(lists[0]?.id);
  const [newListName, setNewListName] = useState('');
  const { items } = useModList(selectedListId);
  const { addToast } = useToast();

  const selectedList = lists.find((list) => list.id === selectedListId);

  useEffect(() => {
    if (!selectedListId && lists.length > 0) {
      setSelectedListId(lists[0].id);
    }
  }, [lists, selectedListId]);

  const handleCreate = async () => {
    if (!newListName.trim()) {
      return;
    }
    const list = await createList(newListName.trim());
    setSelectedListId(list.id);
    setNewListName('');
  };

  const handleDelete = async (id: string) => {
    await deleteList(id);
    if (selectedListId === id) {
      setSelectedListId(undefined);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="form-control">
            <span className="label-text">新しいリスト</span>
            <input
              className="input input-bordered"
              value={newListName}
              onChange={(event) => setNewListName(event.target.value)}
              placeholder="例: 便利Mod"
            />
          </label>
          <button className="btn btn-primary btn-sm" onClick={handleCreate}>
            作成
          </button>
        </div>
        <div className="space-y-2">
          {lists.map((list) => (
            <div key={list.id} className="flex items-center gap-2">
              <button
                className={`btn btn-sm flex-1 ${selectedListId === list.id ? 'btn-neutral' : 'btn-ghost'}`}
                onClick={() => setSelectedListId(list.id)}
              >
                {list.name}
              </button>
              <button className="btn btn-sm btn-ghost text-error" onClick={() => handleDelete(list.id)}>
                削除
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">リスト詳細</h3>
        {selectedList ? (
          <div className="flex flex-wrap gap-2">
            <button
              className="btn btn-sm btn-outline"
              onClick={async () => {
                try {
                  const content = exportService.toMarkdown({ ...selectedList, items });
                  await exportService.copyToClipboard(content);
                  addToast('クリップボードにコピーしました', 'success');
                } catch {
                  addToast('コピーに失敗しました', 'error');
                }
              }}
            >
              クリップボードコピー
            </button>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => {
                const content = exportService.toMarkdown({ ...selectedList, items });
                exportService.downloadAsFile(content, `${selectedList.name}.md`);
              }}
            >
              ファイルダウンロード
            </button>
          </div>
        ) : null}
        {items.length === 0 ? (
          <p className="text-sm text-base-content/70">リスト内のModがありません。</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-box border border-base-200 bg-base-100 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{item.modName}</p>
                    {item.pinnedVersion ? (
                      <p className="text-xs text-base-content/70">Pinned: {item.pinnedVersion}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <input
                      className="input input-bordered input-sm"
                      placeholder="1.20.1"
                      onBlur={(event) => {
                        const value = event.target.value.trim();
                        if (value) {
                          void updatePinnedVersion({ itemId: item.id, version: value });
                        }
                      }}
                    />
                    <button className="btn btn-sm btn-ghost" onClick={() => removeMod({ listId: item.listId, itemId: item.id })}>
                      削除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
