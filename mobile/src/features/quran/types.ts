/** Tajweed rule identifiers (Madani color scheme). */
export type TajweedRule =
  | 'ham_wasl'
  | 'slnt'
  | 'laam_shamsiyah'
  | 'madda_normal'
  | 'madda_permissible'
  | 'madda_necessary'
  | 'madda_obligatory'
  | 'qalaqah'
  | 'ghunnah'
  | 'ikhfa'
  | 'ikhfa_shafawi'
  | 'idgham_ghunnah'
  | 'idgham_wo_ghunnah'
  | 'idgham_shafawi'
  | 'iqlab'
  | 'default';

export type TranslationLayer = 'en' | 'ur' | 'roman_ur';

export type ReaderDisplayMode =
  | 'stacked'
  | 'arabic_only'
  | 'translation_only'
  | 'word_by_word';

export type AyahRef = `${number}:${number}`;

export interface QuranWord {
  index: number;
  arabic: string;
  transliteration?: string;
  translation?: Partial<Record<TranslationLayer, string>>;
  tajweed?: TajweedRule;
  audioStartMs?: number;
  audioEndMs?: number;
}

export interface TajweedSegment {
  text: string;
  rule: TajweedRule;
}

export interface AyahTranslations {
  en?: string;
  ur?: string;
  roman_ur?: string;
}

export interface AyahTafsir {
  en?: string;
  ur?: string;
  source?: string;
}

export interface QuranAyah {
  surah: number;
  ayah: number;
  juz: number;
  page: number;
  arabic: string;
  words: QuranWord[];
  segments?: TajweedSegment[];
  translations: AyahTranslations;
  tafsir?: AyahTafsir;
  hasSajdah?: boolean;
  bismillahBefore?: boolean;
}

export interface SurahMeta {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  nameUrdu: string;
  nameTransliteration: string;
  revelation: 'meccan' | 'medinan';
  ayahCount: number;
  juzStart: number;
}

export interface SurahBundle {
  surah: number;
  meta: SurahMeta;
  ayahs: QuranAyah[];
  audioUrl?: string;
  audioDurationMs?: number;
  bundleVersion: number;
}

export interface QuranBookmark {
  id: string;
  ref: AyahRef;
  surah: number;
  ayah: number;
  label?: string;
  createdAt: string;
}

export interface QuranNote {
  id: string;
  ref: AyahRef;
  surah: number;
  ayah: number;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  ref: AyahRef;
  surah: number;
  ayah: number;
  surahName: string;
  snippetArabic: string;
  snippetTranslation?: string;
  matchField: 'arabic' | 'translation' | 'surah_name';
}

export interface ReaderPreferences {
  displayMode: ReaderDisplayMode;
  showTajweed: boolean;
  translationLayers: TranslationLayer[];
  arabicFontSize: number;
  translationFontSize: number;
  showTafsir: boolean;
  reciterId: string;
  audioSyncEnabled: boolean;
}

export function toAyahRef(surah: number, ayah: number): AyahRef {
  return `${surah}:${ayah}`;
}

export function parseAyahRef(ref: AyahRef): { surah: number; ayah: number } {
  const [s, a] = ref.split(':').map(Number);
  return { surah: s!, ayah: a! };
}
