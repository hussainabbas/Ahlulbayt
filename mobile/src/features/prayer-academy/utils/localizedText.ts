import type { LocalizedText } from '../types';

export function pickLocalized(text: LocalizedText | Partial<LocalizedText>, locale: string): string {
  if (locale === 'ur' && text.ur) return text.ur;
  if (locale === 'ar' && text.ar) return text.ar;
  return text.en ?? '';
}

export function pickLocalizedList(items: LocalizedText[], locale: string): string[] {
  return items.map((item) => pickLocalized(item, locale));
}
