/** Unified content reference across duas, ziyarat, sahifa, and future amaal. */
export type MafatihContentKind = 'dua' | 'ziyarat' | 'sahifa' | 'amaal';

export type MafatihRef = `${MafatihContentKind}:${string}`;

export type MafatihSchedule = 'daily' | 'weekly' | 'monthly' | 'occasion' | 'anytime';

export type MafatihCollectionId =
  | 'mafatih_al_jinan'
  | 'kamil_al_ziyarat'
  | 'sahifa_sajjadia'
  | 'taqibat';

export interface MafatihCollection {
  id: MafatihCollectionId;
  titles: { en: string; ur: string; ar: string };
  description: { en: string; ur: string };
  sortOrder: number;
}

export interface MafatihChapter {
  id: string;
  partNumber: 1 | 2 | 3 | 4;
  titles: { en: string; ur: string; ar: string };
  sortOrder: number;
}

export interface MafatihEntry {
  ref: MafatihRef;
  kind: MafatihContentKind;
  contentId: string;
  slug: string;
  /** Printed Mafatih reference e.g. "1.14" */
  mafatihRef: string;
  collectionId: MafatihCollectionId;
  chapterId: string;
  schedule: MafatihSchedule;
  /** Days when recommended: thursday, friday, ashura, arbaeen, etc. */
  recommendedDays?: string[];
  titles: { en: string; ur: string; ar: string };
  subtitles: { en: string; ur: string };
  description: { en: string; ur: string };
  source: { en: string; ur: string };
  sectionCount: number;
  estimatedMinutes: number;
  hasAudio: boolean;
  /** Bundled text available offline */
  bundled: boolean;
  sortOrder: number;
  searchText: string;
}

export interface MafatihBookmark {
  id: string;
  ref: MafatihRef;
  sectionId?: string;
  label?: string;
  createdAt: string;
}

export interface MafatihFavorite {
  id: string;
  ref: MafatihRef;
  createdAt: string;
}

export interface MafatihSearchResult {
  ref: MafatihRef;
  title: string;
  snippet: string;
  kind: MafatihContentKind;
  mafatihRef: string;
  score: number;
}

export interface MafatihSection {
  id: string;
  title?: { en?: string; ur?: string };
  arabic: string;
  translations: Partial<Record<'en' | 'ur', string>>;
  sacred?: boolean;
}

export interface MafatihReaderBundle {
  entry: MafatihEntry;
  sections: MafatihSection[];
  bundleVersion: number;
}

export type MafatihDisplayMode = 'stacked' | 'arabic_only' | 'translation_only';
export type MafatihTranslationLayer = 'en' | 'ur';

export type MafatihHubFilter =
  | 'all'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'bookmarks'
  | 'favorites';

export function parseMafatihRef(ref: MafatihRef): { kind: MafatihContentKind; contentId: string } {
  const [kind, ...rest] = ref.split(':');
  return { kind: kind as MafatihContentKind, contentId: rest.join(':') };
}

export function toMafatihRef(kind: MafatihContentKind, contentId: string): MafatihRef {
  return `${kind}:${contentId}` as MafatihRef;
}
