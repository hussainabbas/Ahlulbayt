import { useMemo } from 'react';

import { useLocationStore } from '@/stores/locationStore';

import { calculateQibla } from '../engine/qiblaCalculator';
import type { QiblaResult } from '../types';

/** Lightweight Qibla data for home widgets — no magnetometer subscription. */
export function useQiblaPreview(): QiblaResult & { cityName: string | null } {
  const latitude = useLocationStore((s) => s.latitude);
  const longitude = useLocationStore((s) => s.longitude);
  const cityName = useLocationStore((s) => s.cityName);

  const qibla = useMemo(
    () => calculateQibla({ latitude, longitude }),
    [latitude, longitude],
  );

  return { ...qibla, cityName };
}

export function formatQiblaDistance(km: number, locale = 'en'): string {
  const rounded = Math.round(km);
  return `${rounded.toLocaleString(locale === 'ur' ? 'ur-PK' : 'en-US')} km`;
}

export function formatQiblaBearing(degrees: number): string {
  return `${Math.round(degrees)}°`;
}
