import { useMemo, useState } from 'react';

import { QuranSearchIndex } from '../engine/quranSearchIndex';
import type { SearchResult } from '../types';

export function useQuranSearch(debounceMs = 250) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const updateQuery = (value: string) => {
    setQuery(value);
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => setDebouncedQuery(value.trim()), debounceMs);
    setDebounceTimer(timer);
  };

  const results = useMemo<SearchResult[]>(() => {
    if (debouncedQuery.length < 2) return [];
    return QuranSearchIndex.search(debouncedQuery);
  }, [debouncedQuery]);

  return { query, setQuery: updateQuery, results, debouncedQuery };
}
