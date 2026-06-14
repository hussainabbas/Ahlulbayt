export type NahjulId = `nb_${string}`;

export type NahjulCategory = 'sermon' | 'letter' | 'saying';

export type NahjulTranslationLayer = 'en' | 'ur';

export type NahjulDisplayMode = 'stacked' | 'arabic_only' | 'translation_only';

export interface NahjulSection {
  id: string;
  title?: { en?: string; ur?: string };
  arabic: string;
  translations: Partial<Record<NahjulTranslationLayer, string>>;
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
