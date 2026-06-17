import type { LocalizedText } from '../types';

export function pickLocalizedText(text: LocalizedText, locale: string): string {
  if (locale === 'ur' && text.ur) return text.ur;
  if (locale === 'ar' && text.ar) return text.ar;
  return text.en;
}
