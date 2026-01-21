'use client';

import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { bookmarkService } from '@/features/bookmarks/services/bookmarkService';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { Bookmark } from '@/types/bookmark';
import type { UnifiedMod } from '@/features/search/types/search';

export const useBookmarks = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => bookmarkService.getAll(),
    enabled: isAuthenticated,
  });

  const addMutation = useMutation({
    mutationFn: ({ mod, memo }: { mod: UnifiedMod; memo?: string }) => bookmarkService.add(mod, memo),
    onSuccess: (bookmark) => {
      queryClient.setQueryData<Bookmark[]>(['bookmarks'], (prev) => [bookmark, ...(prev ?? [])]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, memo }: { id: string; memo: string }) => bookmarkService.update(id, memo),
    onSuccess: (bookmark) => {
      queryClient.setQueryData<Bookmark[]>(['bookmarks'], (prev) =>
        (prev ?? []).map((item) => (item.id === bookmark.id ? bookmark : item)),
      );
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => bookmarkService.remove(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<Bookmark[]>(['bookmarks'], (prev) =>
        (prev ?? []).filter((item) => item.id !== id),
      );
    },
  });

  const bookmarks = query.data ?? [];

  const byModId = useMemo(() => {
    const map = new Map<string, Bookmark>();
    bookmarks.forEach((bookmark) => map.set(bookmark.modId, bookmark));
    return map;
  }, [bookmarks]);

  return {
    bookmarks,
    isLoading: query.isLoading,
    error: query.error,
    addBookmark: addMutation.mutateAsync,
    updateMemo: updateMutation.mutateAsync,
    removeBookmark: removeMutation.mutateAsync,
    getBookmarkByModId: (modId: string) => byModId.get(modId),
  };
};
