'use client';

import { useState } from 'react';

import { useModLists } from '@/features/modLists/hooks/useModLists';


type ModListSelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (listId: string, pinnedVersion?: string) => void | Promise<void>;
};

export function ModListSelectModal({ isOpen, onClose, onAdd }: ModListSelectModalProps) {
  const { lists } = useModLists();
  const [selectedListId, setSelectedListId] = useState('');
  const [pinnedVersion, setPinnedVersion] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleAdd = async () => {
    if (!selectedListId) {
      return;
    }
    await onAdd(selectedListId, pinnedVersion || undefined);
    setPinnedVersion('');
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-lg font-semibold">Modリストに追加</h3>
        <div className="mt-4 space-y-3">
          <label className="form-control">
            <span className="label-text">リスト</span>
            <select
              className="select select-bordered"
              value={selectedListId}
              onChange={(event) => setSelectedListId(event.target.value)}
            >
              <option value="">選択してください</option>
              {lists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>
          </label>
          <label className="form-control">
            <span className="label-text">ピン留めバージョン (任意)</span>
            <input
              className="input input-bordered"
              value={pinnedVersion}
              onChange={(event) => setPinnedVersion(event.target.value)}
              placeholder="1.20.1"
            />
          </label>
        </div>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            キャンセル
          </button>
          <button className="btn btn-primary" onClick={handleAdd}>
            追加
          </button>
        </div>
      </div>
    </div>
  );
}
