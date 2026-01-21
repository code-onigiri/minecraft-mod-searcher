'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { modListService } from '@/features/modLists/services/modListService';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { ModList, ModListItem } from '@/types/modList';
import type { UnifiedMod } from '@/features/search/types/search';

export const useModLists = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const listsQuery = useQuery({
    queryKey: ['modLists'],
    queryFn: () => modListService.getLists(),
    enabled: isAuthenticated,
  });

  const createList = useMutation({
    mutationFn: (name: string) => modListService.createList(name),
    onSuccess: (list) => {
      queryClient.setQueryData<ModList[]>(['modLists'], (prev) => [list, ...(prev ?? [])]);
    },
  });

  const deleteList = useMutation({
    mutationFn: (id: string) => modListService.deleteList(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<ModList[]>(['modLists'], (prev) =>
        (prev ?? []).filter((list) => list.id !== id),
      );
    },
  });

  const addMod = useMutation({
    mutationFn: ({ listId, mod, pinnedVersion }: { listId: string; mod: UnifiedMod; pinnedVersion?: string }) =>
      modListService.addMod(listId, mod, pinnedVersion),
    onSuccess: (item) => {
      queryClient.setQueryData<ModListItem[]>(['modListItems', item.listId], (prev) => [item, ...(prev ?? [])]);
    },
  });

  const removeMod = useMutation({
    mutationFn: ({ listId, itemId }: { listId: string; itemId: string }) =>
      modListService.removeMod(listId, itemId),
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<ModListItem[]>(['modListItems', variables.listId], (prev) =>
        (prev ?? []).filter((item) => item.id !== variables.itemId),
      );
    },
  });

  const updatePinnedVersion = useMutation({
    mutationFn: ({ itemId, version }: { itemId: string; version: string }) =>
      modListService.updatePinnedVersion(itemId, version),
    onSuccess: (item) => {
      queryClient.setQueryData<ModListItem[]>(['modListItems', item.listId], (prev) =>
        (prev ?? []).map((existing) => (existing.id === item.id ? item : existing)),
      );
    },
  });

  return {
    lists: listsQuery.data ?? [],
    isLoading: listsQuery.isLoading,
    error: listsQuery.error,
    createList: createList.mutateAsync,
    deleteList: deleteList.mutateAsync,
    addMod: addMod.mutateAsync,
    removeMod: removeMod.mutateAsync,
    updatePinnedVersion: updatePinnedVersion.mutateAsync,
  };
};
