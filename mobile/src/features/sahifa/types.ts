export type SahifaId =
  | `sahifa_${string}`;

export type SahifaTranslationLayer = 'en' | 'ur';

export type SahifaDisplayMode = 'stacked' | 'arabic_only' | 'translation_only';

export interface SahifaSection {
  id: string;
  title?: { en?: string; ur?: string };
  arabic: string;
  translations: Partial<Record<SahifaTranslationLayer, string>>;
}

export interface SahifaMeta {
  id: SahifaId;
  number: number;
  slug: string;
  titles: { en: string; ur: string; ar: string };
  subtitles: { en: string; ur: string };
  description: { en: string; ur: string };
  themes: string[];
  sectionCount: number;
  estimatedMinutes: number;
  hasAudio: boolean;
  bundled: boolean;
}

export interface SahifaBundle {
  meta: SahifaMeta;
  sections: SahifaSection[];
  bundleVersion: number;
}

export interface SahifaBookmark {
  id: string;
  sahifaId: SahifaId;
  sectionId?: string;
  label?: string;
  createdAt: string;
}

export interface SahifaDownloadRecord {
  sahifaId: SahifaId;
  reciterId: string;
  localPath: string;
  fileSizeBytes: number;
  downloadedAt: string;
}
