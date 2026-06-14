export type DuaId =
  | 'dua_kumail'
  | 'dua_tawassul'
  | 'dua_ahad'
  | 'dua_nudba'
  | 'dua_sabah'
  | 'dua_mashlool';

export type DuaCategory = 'weekly' | 'daily' | 'occasion';

export type DuaTranslationLayer = 'en' | 'ur';

export type DuaDisplayMode = 'stacked' | 'arabic_only' | 'translation_only';

export interface DuaSection {
  id: string;
  /** Optional section heading (e.g. "Praise", "Intercession"). */
  title?: { en?: string; ur?: string };
  arabic: string;
  translations: Partial<Record<DuaTranslationLayer, string>>;
}

export interface DuaMeta {
  id: DuaId;
  slug: string;
  category: DuaCategory;
  /** Recommended time — shown in list UI. */
  recommendedTime: { en: string; ur: string; ar: string };
  titles: { en: string; ur: string; ar: string };
  subtitles: { en: string; ur: string };
  /** Brief description for list card. */
  description: { en: string; ur: string };
  /** Attribution / source line. */
  source: { en: string; ur: string };
  sectionCount: number;
  estimatedMinutes: number;
  hasAudio: boolean;
}

export interface DuaBundle {
  meta: DuaMeta;
  sections: DuaSection[];
  bundleVersion: number;
}

export interface DuaBookmark {
  id: string;
  duaId: DuaId;
  sectionId?: string;
  label?: string;
  createdAt: string;
}

export interface DuaDownloadRecord {
  duaId: DuaId;
  reciterId: string;
  localPath: string;
  fileSizeBytes: number;
  downloadedAt: string;
}

export interface DuaAudioReciter {
  id: string;
  nameKey: string;
}
