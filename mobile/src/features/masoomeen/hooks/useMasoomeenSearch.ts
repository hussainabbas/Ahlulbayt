import { useEffect, useMemo, useState } from 'react';

import { MasoomeenRepository } from '../engine/masoomeenRepository';
import type { MasoomeenSearchResult } from '../types';

export function useMasoomeenSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo<MasoomeenSearchResult[]>(() => {
    if (!debouncedQuery.trim()) return [];
    return MasoomeenRepository.search(debouncedQuery);
  }, [debouncedQuery]);

  return {
    query,
    setQuery,
    results,
    isSearching: debouncedQuery.trim().length > 0,
  };
}
