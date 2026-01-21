'use client';

import { useState } from 'react';

import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { BookmarkMemoModal } from '@/features/bookmarks/components/BookmarkMemoModal';
import { ModListManager } from '@/features/modLists/components/ModListManager';
import { useToast } from '@/components/ui/ToastProvider';

export default function LibraryPage() {
  const { bookmarks, updateMemo } = useBookmarks();
  const { addToast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingBookmark = bookmarks.find((bookmark) => bookmark.id === editingId) ?? null;

  const handleSaveMemo = async (memo: string) => {
    if (!editingId) {
      return;
    }
    try {
      await updateMemo({ id: editingId, memo });
      addToast('メモを更新しました', 'success');
    } catch {
      addToast('メモ更新に失敗しました', 'error');
    }
    setEditingId(null);
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-10 px-6 py-10">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">ブックマーク</h2>
        {bookmarks.length === 0 ? (
          <p className="text-sm text-base-content/70">ブックマークがありません。</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="rounded-box border border-base-200 bg-base-100 p-4">
                <div className="flex items-center gap-3">
                  {bookmark.iconUrl ? (
                    <img src={bookmark.iconUrl} alt={bookmark.modName} className="h-10 w-10 rounded" />
                  ) : (
                    <div className="h-10 w-10 rounded bg-base-200" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{bookmark.modName}</p>
                    {bookmark.memo ? (
                      <p className="text-xs text-base-content/70">{bookmark.memo}</p>
                    ) : (
                      <p className="text-xs text-base-content/60">メモなし</p>
                    )}
                  </div>
                  <button className="btn btn-sm btn-ghost" onClick={() => setEditingId(bookmark.id)}>
                    メモ編集
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Modリスト</h2>
        <ModListManager />
      </section>
      <BookmarkMemoModal
        isOpen={Boolean(editingBookmark)}
        onClose={() => setEditingId(null)}
        onSave={handleSaveMemo}
        initialMemo={editingBookmark?.memo ?? ''}
      />
    </main>
  );
}
