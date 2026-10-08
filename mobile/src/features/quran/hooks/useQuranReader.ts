import { useCallback, useEffect, useState } from 'react';

import { analytics } from '@/core/analytics';
import { QuranRepository } from '../engine/quranRepository';
import { useQuranReaderStore } from '../stores/quranReaderStore';
import type { SurahBundle } from '../types';

export function useQuranReader(surahNumber: number) {
  const [bundle, setBundle] = useState<SurahBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setLastRead = useQuranReaderStore((s) => s.setLastRead);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await QuranRepository.getSurah(surahNumber);
      if (!data) {
        setError('Surah not found');
        setBundle(null);
      } else {
        setBundle(data);
      }
    } catch {
      setError('Failed to load surah');
      setBundle(null);
    } finally {
      setLoading(false);
    }
  }, [surahNumber]);

  useEffect(() => {
    void load();
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
    reload: load,
    markAyahRead,
    isFullyBundled: QuranRepository.isSurahAvailable(surahNumber),
  };
}
