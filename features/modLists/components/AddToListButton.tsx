'use client';

import { useState } from 'react';

import type { UnifiedMod } from '@/features/search/types/search';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useModLists } from '@/features/modLists/hooks/useModLists';

import { ModListSelectModal } from './ModListSelectModal';

type AddToListButtonProps = {
  mod: UnifiedMod;
  onRequireAuth?: () => void;
};

export function AddToListButton({ mod, onRequireAuth }: AddToListButtonProps) {
  const { isAuthenticated } = useAuth();
  const { addMod } = useModLists();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (!isAuthenticated) {
      onRequireAuth?.();
      return;
    }
    setIsOpen(true);
  };

  const handleAdd = async (listId: string, pinnedVersion?: string) => {
    await addMod({ listId, mod, pinnedVersion });
    setIsOpen(false);
  };

  return (
    <>
      <button className="btn btn-sm btn-outline" onClick={handleOpen}>
        リストに追加
      </button>
      <ModListSelectModal isOpen={isOpen} onClose={() => setIsOpen(false)} onAdd={handleAdd} />
    </>
  );
}
