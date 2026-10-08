import type { IslamicReference } from '../types';

export function duaSourceToReference(
  duaId: string,
  source: { en: string; ur?: string },
  chapter?: string,
): IslamicReference {
  return {
    id: `dua-${duaId}`,
    kind: 'dua',
    primarySource: {
      en: source.en,
      ur: source.ur,
    },
    bookName: { en: source.en, ur: source.ur },
    chapter: chapter ? { en: chapter } : undefined,
    contentRef: `dua:${duaId}`,
    verification: source.en.trim() ? 'verified' : 'pending',
  };
}

export function ziyaratSourceToReference(
  ziyaratId: string,
  source: { en: string; ur?: string },
  chapter?: string,
): IslamicReference {
  return {
    id: `ziyarat-${ziyaratId}`,
    kind: 'ziyarat',
    primarySource: {
      en: source.en,
      ur: source.ur,
    },
    bookName: { en: source.en, ur: source.ur },
    chapter: chapter ? { en: chapter } : undefined,
    contentRef: `ziyarat:${ziyaratId}`,
    verification: source.en.trim() ? 'verified' : 'pending',
  };
}

export function calendarEventToReference(
  eventId: string,
  title: string,
  source?: string,
): IslamicReference {
  return {
    id: `calendar-${eventId}`,
    kind: 'calendar',
    primarySource: { en: title },
    bookName: source ? { en: source } : { en: 'Shia Islamic Calendar observances' },
    contentRef: `calendar:${eventId}`,
    verification: source ? 'verified' : 'pending',
  };
}
