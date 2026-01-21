'use client';

import { useEffect, useState } from 'react';

type BookmarkMemoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memo: string) => void | Promise<void>;
  initialMemo?: string;
};

export function BookmarkMemoModal({ isOpen, onClose, onSave, initialMemo = '' }: BookmarkMemoModalProps) {
  const [memo, setMemo] = useState(initialMemo);

  useEffect(() => {
    if (isOpen) {
      setMemo(initialMemo);
    }
  }, [initialMemo, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSave = async () => {
    await onSave(memo.trim());
    setMemo('');
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-lg font-semibold">メモを追加</h3>
        <textarea
          className="textarea textarea-bordered mt-4 w-full"
          rows={4}
          value={memo}
          onChange={(event) => setMemo(event.target.value)}
          placeholder="必要ならメモを追加"
        />
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            キャンセル
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
