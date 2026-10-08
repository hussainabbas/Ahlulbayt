export type MasoomeenId =
  | 'masoom_prophet'
  | 'masoom_fatima'
  | 'masoom_ali'
  | 'masoom_hasan'
  | 'masoom_husayn'
  | 'masoom_zainulabideen'
  | 'masoom_baqir'
  | 'masoom_sadiq'
  | 'masoom_kazim'
  | 'masoom_reza'
  | 'masoom_jawad'
  | 'masoom_hadi'
  | 'masoom_askari'
  | 'masoom_mahdi';

export type MasoomeenRole = 'prophet' | 'lady' | 'imam';

export type MasoomeenProfileTab = 'biography' | 'timeline' | 'quotes' | 'events' | 'books';

export interface LocalizedText {
  en: string;
  ur: string;
  ar: string;
}

export interface MasoomeenMeta {
  id: MasoomeenId;
  order: number;
  role: MasoomeenRole;
  titles: LocalizedText;
  honorific: LocalizedText;
  epithet: LocalizedText;
  birthHijri?: string;
  deathHijri?: string;
  birthPlace?: LocalizedText;
  shrine?: LocalizedText;
  accentColor: string;
}

export interface MasoomeenBioSection {
  id: string;
  title: LocalizedText;
  body: LocalizedText;
}

export interface MasoomeenTimelineEntry {
  id: string;
  hijriYear: number;
  hijriLabel?: string;
  title: LocalizedText;
  description: LocalizedText;
  kind: 'birth' | 'shahadat' | 'wiladat' | 'event' | 'occultation';
}

export interface MasoomeenQuote {
  id: string;
  arabic?: string;
  text: LocalizedText;
  source: LocalizedText;
}

export interface MasoomeenLinkedEvent {
  id: string;
  hijriMonth: number;
  hijriDay: number;
  title: LocalizedText;
  description: LocalizedText;
  calendarEventId?: string;
}

export interface MasoomeenBook {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  note?: LocalizedText;
}

export interface MasoomeenProfile {
  meta: MasoomeenMeta;
  biography: MasoomeenBioSection[];
  timeline: MasoomeenTimelineEntry[];
  quotes: MasoomeenQuote[];
  events: MasoomeenLinkedEvent[];
  books: MasoomeenBook[];
}

export interface MasoomeenBookmark {
  id: string;
  masoomeenId: MasoomeenId;
  createdAt: string;
}

export interface MasoomeenSearchResult {
  id: MasoomeenId;
  title: string;
  snippet: string;
  score: number;
}
