import type { SupportedLocale } from '@/core/config/constants';

import type { LocalizedText } from '../types';

export function pickLocalized(text: LocalizedText, locale: SupportedLocale): string {
  if (locale === 'ar') return text.ar;
  if (locale === 'ur') return text.ur;
  return text.en;
}
