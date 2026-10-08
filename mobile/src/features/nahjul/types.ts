export type NahjulId = `nb_${string}`;

export type NahjulCategory = 'sermon' | 'letter' | 'saying';

export type NahjulTranslationLayer = 'en' | 'ur' | 'ar';

export type NahjulDisplayMode = 'stacked' | 'arabic_only' | 'translation_only';

export type NahjulSectionKind = 'body' | 'commentary';

export interface NahjulSection {
  id: string;
  title?: { en?: string; ur?: string; ar?: string };
  arabic?: string;
  translations: Partial<Record<NahjulTranslationLayer, string>>;
  kind?: NahjulSectionKind;
  sourceRef?: string;
}

export interface NahjulSource {
  title: string;
  url: string;
  edition: string;
  attribution?: string;
}

export interface NahjulMeta {
  id: NahjulId;
  number: number;
  slug: string;
  category: NahjulCategory;
  titles: { en: string; ur: string; ar: string };
  subtitles: { en: string; ur: string };
  description: { en: string; ur: string };
  themes: string[];
  /** Short excerpt for quote cards and search snippets */
  excerpt: { en: string; ur: string };
  sectionCount: number;
  estimatedMinutes: number;
  hasAudio: boolean;
  bundled: boolean;
}

export interface NahjulBundle {
  meta: NahjulMeta;
  sections: NahjulSection[];
  bundleVersion: number;
  source?: NahjulSource;
}

export interface NahjulBookmark {
  id: string;
  nahjulId: NahjulId;
  sectionId?: string;
  label?: string;
  createdAt: string;
}

export interface NahjulDownloadRecord {
  nahjulId: NahjulId;
  reciterId: string;
  localPath: string;
  fileSizeBytes: number;
  downloadedAt: string;
}

export interface NahjulSearchResult {
  id: NahjulId;
  title: string;
  snippet: string;
  category: NahjulCategory;
  score: number;
}
