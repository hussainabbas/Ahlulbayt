import { useMemo } from 'react';

import { MafatihRepository } from '../engine/mafatihRepository';
import { useMafatihBookmarkStore } from '../stores/mafatihBookmarkStore';
import { useMafatihFavoriteStore } from '../stores/mafatihFavoriteStore';
import type { MafatihCollectionId, MafatihEntry, MafatihHubFilter } from '../types';

export function useMafatihHub(
  filter: MafatihHubFilter,
  collectionId: MafatihCollectionId | null = null,
) {
  const bookmarks = useMafatihBookmarkStore((s) => s.bookmarks);
  const favorites = useMafatihFavoriteStore((s) => s.favorites);

  const bookmarkRefs = useMemo(
    () => [...new Set(bookmarks.filter((b) => !b.sectionId).map((b) => b.ref))],
    [bookmarks],
  );
  const favoriteRefs = useMemo(
    () => favorites.map((f) => f.ref),
    [favorites],
  );

  const today = useMemo(() => MafatihRepository.getTodayRecommendation(), []);

  const entries = useMemo<MafatihEntry[]>(() => {
    let all = MafatihRepository.listAll();
    if (collectionId) {
      all = all.filter((e) => e.collectionId === collectionId);
    }
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
  }, [filter, collectionId, bookmarkRefs, favoriteRefs]);

  const collections = useMemo(() => MafatihRepository.listCollections(), []);
  const chapters = useMemo(() => MafatihRepository.listChapters(), []);

  return { entries, today, collections, chapters, bookmarkRefs, favoriteRefs };
}
