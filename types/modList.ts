import type { ModSourceInfo } from '@/features/search/types/search';

export type ModListItem = {
  id: string;
  listId: string;
  modId: string;
  modName: string;
  iconUrl?: string;
  sources: ModSourceInfo[];
  pinnedVersion?: string;
  addedAt: string;
};

export type ModList = {
  id: string;
  userId: string;
  name: string;
  items: ModListItem[];
  createdAt: string;
  updatedAt: string;
};
