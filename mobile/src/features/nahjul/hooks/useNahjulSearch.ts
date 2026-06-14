import { useEffect, useMemo, useState } from 'react';

import { NahjulRepository } from '../engine/nahjulRepository';
import type { NahjulCategory, NahjulSearchResult } from '../types';

export function useNahjulSearch(category: NahjulCategory | 'all' = 'all') {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo<NahjulSearchResult[]>(() => {
    if (debouncedQuery.trim().length < 2) return [];
    return NahjulRepository.search(debouncedQuery, category);
  }, [debouncedQuery, category]);

  return { query, setQuery, debouncedQuery, results, isSearching: debouncedQuery.length >= 2 };
}
