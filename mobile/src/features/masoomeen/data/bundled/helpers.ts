import type {
  MasoomeenBioSection,
  MasoomeenBook,
  MasoomeenId,
  MasoomeenLinkedEvent,
  MasoomeenQuote,
  MasoomeenTimelineEntry,
} from '../../types';

export interface FigureContent {
  id: MasoomeenId;
  biography: MasoomeenBioSection[];
  timeline: MasoomeenTimelineEntry[];
  quotes: MasoomeenQuote[];
  events: MasoomeenLinkedEvent[];
  books: MasoomeenBook[];
}

export function bio(
  id: string,
  titleEn: string,
  titleUr: string,
  titleAr: string,
  bodyEn: string,
  bodyUr: string,
  bodyAr: string,
): MasoomeenBioSection {
  return {
    id,
    title: { en: titleEn, ur: titleUr, ar: titleAr },
    body: { en: bodyEn, ur: bodyUr, ar: bodyAr },
  };
}

export function timeline(
  id: string,
  hijriYear: number,
  titleEn: string,
  titleUr: string,
  titleAr: string,
  descEn: string,
  descUr: string,
  descAr: string,
  kind: MasoomeenTimelineEntry['kind'] = 'event',
  hijriLabel?: string,
): MasoomeenTimelineEntry {
  return {
    id,
    hijriYear,
    hijriLabel,
    title: { en: titleEn, ur: titleUr, ar: titleAr },
    description: { en: descEn, ur: descUr, ar: descAr },
    kind,
  };
}

export function quote(
  id: string,
  textEn: string,
  textUr: string,
  textAr: string,
  sourceEn: string,
  sourceUr: string,
  sourceAr: string,
  arabic?: string,
): MasoomeenQuote {
  return {
    id,
    arabic,
    text: { en: textEn, ur: textUr, ar: textAr },
    source: { en: sourceEn, ur: sourceUr, ar: sourceAr },
  };
}

export function event(
  id: string,
  hijriMonth: number,
  hijriDay: number,
  titleEn: string,
  titleUr: string,
  titleAr: string,
  descEn: string,
  descUr: string,
  descAr: string,
  calendarEventId?: string,
): MasoomeenLinkedEvent {
  return {
    id,
    hijriMonth,
    hijriDay,
    title: { en: titleEn, ur: titleUr, ar: titleAr },
    description: { en: descEn, ur: descUr, ar: descAr },
    calendarEventId,
  };
}

export function book(
  id: string,
  titleEn: string,
  titleUr: string,
  titleAr: string,
  descEn: string,
  descUr: string,
  descAr: string,
  noteEn?: string,
  noteUr?: string,
  noteAr?: string,
): MasoomeenBook {
  return {
    id,
    title: { en: titleEn, ur: titleUr, ar: titleAr },
    description: { en: descEn, ur: descUr, ar: descAr },
    note:
      noteEn != null
        ? { en: noteEn, ur: noteUr ?? noteEn, ar: noteAr ?? noteEn }
        : undefined,
  };
}
