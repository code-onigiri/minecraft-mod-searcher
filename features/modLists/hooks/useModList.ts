'use client';

import { useQuery } from '@tanstack/react-query';

import { modListService } from '@/features/modLists/services/modListService';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { ModListItem } from '@/types/modList';

export const useModList = (listId?: string) => {
  const { isAuthenticated } = useAuth();
  const query = useQuery({
    queryKey: ['modListItems', listId],
    queryFn: async () => {
      if (!listId) {
        return [] as ModListItem[];
      }
      const list = await modListService.getList(listId);
      return list.items;
    },
    enabled: Boolean(listId && isAuthenticated),
  });

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
};
