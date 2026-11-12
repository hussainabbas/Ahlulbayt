import { useCallback, useEffect, useRef, useState } from 'react';

import { analytics } from '@/core/analytics';
import { QuranRepository, bundleHasTranslations } from '../engine/quranRepository';
import { useQuranReaderStore } from '../stores/quranReaderStore';
import type { SurahBundle } from '../types';

export function useQuranReader(surahNumber: number) {
  const [bundle, setBundle] = useState<SurahBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [translationsLoading, setTranslationsLoading] = useState(false);
  const setLastRead = useQuranReaderStore((s) => s.setLastRead);
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const id = (requestId.current += 1);
    const isCurrent = () => requestId.current === id;

    setLoading(true);
    setError(null);
    try {
      // Local read only: verified Arabic is shown without waiting for the network.
      const data = await QuranRepository.getSurah(surahNumber);
      if (!isCurrent()) return;

      if (!data) {
        setError('Surah not found');
        setBundle(null);
        return;
      }
      setBundle(data);
      setLoading(false);

      if (!bundleHasTranslations(data)) {
        setTranslationsLoading(true);
        const withTranslations = await QuranRepository.fetchMissingTranslations(surahNumber);
        if (isCurrent() && withTranslations) setBundle(withTranslations);
      }
    } catch {
      if (isCurrent()) {
        setError('Failed to load surah');
        setBundle(null);
      }
    } finally {
      if (isCurrent()) {
        setLoading(false);
        setTranslationsLoading(false);
      }
    }
  }, [surahNumber]);

  useEffect(() => {
    void load();
    return () => {
      requestId.current += 1;
    };
  }, [load]);

  const markAyahRead = useCallback(
    (ayah: number) => {
      setLastRead(surahNumber, ayah);
      analytics.trackAyahRead(surahNumber, ayah);
    },
    [setLastRead, surahNumber],
  );

  return {
    bundle,
    loading,
    error,
    translationsLoading,
    reload: load,
    markAyahRead,
    isFullyBundled: QuranRepository.isSurahAvailable(surahNumber),
  };
}
