import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { MafatihSearchIndex } from '../engine/mafatihSearchIndex';
import type { MafatihSearchResult } from '../types';

export function useMafatihSearch(debounceMs = 250) {
  const [query, setQueryState] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setQuery = useCallback(
    (value: string) => {
      setQueryState(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => setDebouncedQuery(value.trim()), debounceMs);
    },
    [debounceMs],
  );

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const results = useMemo<MafatihSearchResult[]>(() => {
    if (debouncedQuery.length < 2) return [];
    return MafatihSearchIndex.search(debouncedQuery);
  }, [debouncedQuery]);

  return { query, setQuery, results, debouncedQuery, isSearching: query !== debouncedQuery };
}
