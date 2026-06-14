import { useMemo } from 'react';

import { MafatihRepository } from '../engine/mafatihRepository';
import { useMafatihBookmarkStore } from '../stores/mafatihBookmarkStore';
import { useMafatihFavoriteStore } from '../stores/mafatihFavoriteStore';
import type { MafatihEntry, MafatihHubFilter } from '../types';

export function useMafatihHub(filter: MafatihHubFilter) {
  const bookmarkRefs = useMafatihBookmarkStore((s) => s.getBookmarkRefs());
  const favoriteRefs = useMafatihFavoriteStore((s) => s.getFavoriteRefs());

  const today = useMemo(() => MafatihRepository.getTodayRecommendation(), []);

  const entries = useMemo<MafatihEntry[]>(() => {
    const all = MafatihRepository.listAll();
    switch (filter) {
      case 'daily':
        return all.filter((e) => e.schedule === 'daily');
      case 'weekly':
        return all.filter((e) => e.schedule === 'weekly' || e.schedule === 'occasion');
      case 'monthly':
        return all.filter((e) => e.schedule === 'monthly');
      case 'bookmarks':
        return all.filter((e) => bookmarkRefs.includes(e.ref));
      case 'favorites':
        return all.filter((e) => favoriteRefs.includes(e.ref));
      default:
        return all;
    }
  }, [filter, bookmarkRefs, favoriteRefs]);

  const collections = useMemo(() => MafatihRepository.listCollections(), []);
  const chapters = useMemo(() => MafatihRepository.listChapters(), []);

  return { entries, today, collections, chapters, bookmarkRefs, favoriteRefs };
}
