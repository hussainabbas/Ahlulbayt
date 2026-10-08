import type { IslamicCitation } from '@/core/citations';

export type ZiyaratId =
  | 'ziyarat_ashura'
  | 'ziyarat_waritha'
  | 'ziyarat_aminullah'
  | 'ziyarat_arbaeen'
  | 'ziyarat_jamia_kabira'
  | 'ziyarat_ale_yasin';

export type ZiyaratOccasion = 'ashura' | 'arbaeen' | 'daily' | 'imam' | 'general';

export type ZiyaratTranslationLayer = 'en' | 'ur';

export type ZiyaratDisplayMode = 'stacked' | 'arabic_only' | 'translation_only';

/** One recitation phrase with aligned translation (Ziyarat Ashura reader). */
export interface ZiyaratLine {
  arabic: string;
  transliteration?: string;
  translations: Partial<Record<ZiyaratTranslationLayer, string>>;
}

export interface ZiyaratSection {
  id: string;
  title?: { en?: string; ur?: string };
  arabic: string;
  transliteration?: string;
  translations: Partial<Record<ZiyaratTranslationLayer, string>>;
  /** Per-phrase lines for stacked Arabic + translation (preferred when present). */
  lines?: ZiyaratLine[];
  /** Renders with gold accent — salawat, shahada passages. */
  sacred?: boolean;
  repeatCount?: number;
  instruction?: { en?: string; ur?: string };
}

export interface ZiyaratMeta {
  id: ZiyaratId;
  slug: string;
  occasion: ZiyaratOccasion;
  imam: { en: string; ur: string; ar: string };
  recommendedTime: { en: string; ur: string; ar: string };
  titles: { en: string; ur: string; ar: string };
  subtitles: { en: string; ur: string };
  description: { en: string; ur: string };
  source: { en: string; ur: string };
  sourceUrl?: string;
  narration?: { en: string; ur: string };
  citations?: IslamicCitation[];
  sectionCount: number;
  estimatedMinutes: number;
  hasAudio: boolean;
}

export interface ZiyaratBundle {
  meta: ZiyaratMeta;
  sections: ZiyaratSection[];
  bundleVersion: number;
}

export interface ZiyaratBookmark {
  id: string;
  ziyaratId: ZiyaratId;
  sectionId?: string;
  label?: string;
  createdAt: string;
}

export interface ZiyaratDownloadRecord {
  ziyaratId: ZiyaratId;
  reciterId: string;
  localPath: string;
  fileSizeBytes: number;
  downloadedAt: string;
}
