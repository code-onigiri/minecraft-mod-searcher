import type { ModSourceInfo } from '@/features/search/types/search';

export type Bookmark = {
  id: string;
  userId: string;
  modId: string;
  modName: string;
  iconUrl?: string;
  sources: ModSourceInfo[];
  memo?: string;
  createdAt: string;
  updatedAt: string;
};
