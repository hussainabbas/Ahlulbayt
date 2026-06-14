import { useEffect, useMemo, useState } from 'react';

import { HadithRepository } from '../engine/hadithRepository';
import type { HadithSearchResult, HadithSource, HadithTopic } from '../types';

export function useHadithSearch(
  source: HadithSource | 'all' = 'all',
  topic: HadithTopic | 'all' = 'all',
) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo<HadithSearchResult[]>(() => {
    if (!debouncedQuery.trim()) return [];
    return HadithRepository.search(debouncedQuery, { source, topic });
  }, [debouncedQuery, source, topic]);

  return {
    query,
    setQuery,
    results,
    isSearching: debouncedQuery.trim().length > 0,
  };
}
