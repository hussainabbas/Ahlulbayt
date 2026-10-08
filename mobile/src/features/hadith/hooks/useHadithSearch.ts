import { useEffect, useMemo, useState } from 'react';

import { useLocale } from '@/i18n/useLocale';

import { HadithRepository } from '../engine/hadithRepository';
import type { HadithSearchResult, HadithSource, HadithTopic } from '../types';

export function useHadithSearch(
  source: HadithSource | 'all' = 'all',
  topic: HadithTopic | 'all' = 'all',
) {
  const { locale } = useLocale();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo<HadithSearchResult[]>(() => {
    if (!debouncedQuery.trim()) return [];
    return HadithRepository.search(debouncedQuery, { source, topic }, locale);
  }, [debouncedQuery, source, topic, locale]);

  return {
    query,
    setQuery,
    results,
    isSearching: debouncedQuery.trim().length > 0,
  };
}
