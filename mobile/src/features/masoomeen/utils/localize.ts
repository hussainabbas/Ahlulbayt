import type { SupportedLocale } from '@/core/config/constants';

import type { LocalizedText } from '../types';

export function pickLocalized(text: LocalizedText, locale: SupportedLocale): string {
  if (locale === 'ar') return text.ar;
  if (locale === 'ur') return text.ur;
  return text.en;
}

export function roleIcon(role: 'prophet' | 'lady' | 'imam'): string {
  switch (role) {
    case 'prophet':
      return '🕌';
    case 'lady':
      return '🌹';
    case 'imam':
      return '⭐';
  }
}

export function timelineKindLabel(
  kind: 'birth' | 'shahadat' | 'wiladat' | 'event' | 'occultation',
  t: (key: string) => string,
): string {
  return t(`masoomeen.timelineKind.${kind}`);
}
