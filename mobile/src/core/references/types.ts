/** Universal Islamic reference model — mandatory for all scholarly content in AhlulBayt+. */

export type ReferenceKind =
  | 'quran'
  | 'tafsir'
  | 'hadith'
  | 'dua'
  | 'ziyarat'
  | 'fiqh'
  | 'calendar'
  | 'history'
  | 'amaal'
  | 'book'
  | 'scholar'
  | 'external';

export type ReferenceVerificationStatus = 'verified' | 'pending' | 'unavailable';

export type MarjaId = 'sistani' | 'khamenei' | 'shirazi' | 'general';

export interface LocalizedReferenceText {
  en: string;
  ur?: string;
  ar?: string;
}

/** Shared fiqh reference shape used in prayer-academy & worship-guide content bundles. */
export interface FiqhReference {
  source: { en: string; ur: string; ar: string };
  citation?: { en: string; ur: string; ar: string };
  marja?: MarjaId;
}

export interface IslamicReference {
  id: string;
  kind: ReferenceKind;
  /** Primary collection or source title — e.g. Al-Kafi, Holy Quran, Mafatih al-Jinan */
  primarySource: LocalizedReferenceText;
  bookName?: LocalizedReferenceText;
  volume?: number | string;
  page?: number | string;
  hadithNumber?: string;
  chapter?: LocalizedReferenceText;
  surah?: number;
  ayah?: number;
  ayahEnd?: number;
  translationSource?: LocalizedReferenceText;
  tafsirSource?: LocalizedReferenceText;
  narrator?: LocalizedReferenceText;
  scholar?: LocalizedReferenceText;
  marja?: MarjaId;
  grading?: LocalizedReferenceText;
  url?: string;
  /** App content pointer — e.g. hadith:hd_kafi_001, quran:2:255, mafatih:dua:kumail */
  contentRef?: string;
  verification: ReferenceVerificationStatus;
  notes?: LocalizedReferenceText;
}

export interface ReferenceDisplayRow {
  labelKey: string;
  value: string;
}

export interface ReferenceValidationIssue {
  field: string;
  message: string;
}

export interface ReferenceValidationResult {
  valid: boolean;
  issues: ReferenceValidationIssue[];
}

export interface ReferenceVerificationReport {
  total: number;
  verified: number;
  pending: number;
  unavailable: number;
  hasVerifiedSource: boolean;
  issues: ReferenceValidationIssue[];
}

export interface ReferencedContent<T = unknown> {
  content: T;
  references: IslamicReference[];
  verification: ReferenceVerificationReport;
}
