import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { networkManager } from '@/core/offline/network';
import { useSubscriptionStore } from '@/features/monetization/stores/subscriptionStore';

import { SemanticQuranSearchEngine } from '../engine/semanticSearchEngine';
import { searchQuranSemanticRemote } from '../services/quranSearchApi';
import type { SemanticSearchResponse } from '../types';

const EMPTY: SemanticSearchResponse = {
  query: '',
  expandedTerms: [],
  matchedTopics: [],
  results: [],
  source: 'local',
  tookMs: 0,
};

export function useAiQuranSearch(debounceMs = 300) {
  const [query, setQueryState] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [response, setResponse] = useState<SemanticSearchResponse>(EMPTY);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  const setQuery = useCallback(
    (value: string) => {
      setQueryState(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => setDebouncedQuery(value.trim()), debounceMs);
    },
    [debounceMs],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResponse(EMPTY);
      setIsSearching(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setIsSearching(true);

    const local = SemanticQuranSearchEngine.search(debouncedQuery);

    void (async () => {
      let merged = local;

      if (networkManager.getIsConnected() && useSubscriptionStore.getState().hasEntitlement('advanced_quran')) {
        try {
          const remote = await searchQuranSemanticRemote(debouncedQuery);
          if (requestId !== requestIdRef.current) return;

          const seen = new Set(local.results.map((r) => r.ref));
          const extra = remote.results.filter((r) => !seen.has(r.ref));
          merged = {
            ...local,
            results: [...local.results, ...extra]
              .sort((a, b) => b.score - a.score)
              .slice(0, 25),
            matchedTopics:
              remote.matchedTopics.length > local.matchedTopics.length
                ? remote.matchedTopics
                : local.matchedTopics,
            source: extra.length > 0 ? 'hybrid' : local.source,
          };
        } catch {
          // Offline-first: local results are sufficient
        }
      }

      if (requestId === requestIdRef.current) {
        setResponse(merged);
        setIsSearching(false);
      }
    })();
  }, [debouncedQuery]);

  const searchNow = useCallback((value: string) => {
    setQueryState(value);
    setDebouncedQuery(value.trim());
  }, []);

  const hasResults = response.results.length > 0;

  return useMemo(
    () => ({
      query,
      setQuery,
      searchNow,
      response,
      results: response.results,
      matchedTopics: response.matchedTopics,
      expandedTerms: response.expandedTerms,
      isSearching,
      hasResults,
      debouncedQuery,
    }),
    [query, setQuery, searchNow, response, isSearching, hasResults, debouncedQuery],
  );
}
