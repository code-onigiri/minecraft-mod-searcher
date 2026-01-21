'use client';

import { useState } from 'react';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import type { UnifiedMod } from '@/features/search/types/search';

import { BookmarkMemoModal } from './BookmarkMemoModal';

type BookmarkButtonProps = {
  mod: UnifiedMod;
  onRequireAuth?: () => void;
};

export function BookmarkButton({ mod, onRequireAuth }: BookmarkButtonProps) {
  const { isAuthenticated } = useAuth();
  const { getBookmarkByModId, addBookmark, removeBookmark } = useBookmarks();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const bookmark = getBookmarkByModId(mod.slug);
  const isBookmarked = Boolean(bookmark);

  const handleToggle = async () => {
    if (!isAuthenticated) {
      onRequireAuth?.();
      return;
    }

    if (isBookmarked && bookmark) {
      await removeBookmark(bookmark.id);
      return;
    }

    setIsModalOpen(true);
  };

  const handleSave = async (memo: string) => {
    await addBookmark({ mod, memo });
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        className={`btn btn-sm ${isBookmarked ? 'btn-secondary' : 'btn-outline'}`}
        onClick={handleToggle}
      >
        {isBookmarked ? 'ブックマーク済み' : 'ブックマーク'}
      </button>
      <BookmarkMemoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}
