/** Prayer Academy — Fiqh Jafariya structured prayer learning content. */

export type PrayerAcademyId =
  | 'salat_fajr'
  | 'salat_dhuhr'
  | 'salat_asr'
  | 'salat_maghrib'
  | 'salat_isha'
  | 'namaz_e_ayat'
  | 'namaz_e_mayyit'
  | 'namaz_e_wahshat'
  | 'salat_eid_fitr'
  | 'salat_eid_adha'
  | 'salat_jumuah'
  | 'salat_ghufayla'
  | 'salat_layl'
  | 'salat_istikhara'
  | 'nafl_recommended';

export type PrayerAcademyCategory =
  | 'obligatory_daily'
  | 'special_obligatory'
  | 'special_recommended'
  | 'eid'
  | 'jumuah'
  | 'nafl';

export type PrayerObligation = 'wajib' | 'wajib_kifai' | 'mustahab' | 'conditional';

export type RakatKind = 'wajib' | 'sunnah' | 'mustahab' | 'nafl' | 'witr';

export type GuideDifficulty = 'beginner' | 'advanced';

export type LocalizedText = { en: string; ur: string; ar: string };

export type PartialLocalizedText = Partial<LocalizedText>;

import type { FiqhReference as CoreFiqhReference, MarjaId } from '@/core/references';

export type FiqhReference = CoreFiqhReference;
export type { MarjaId };

export interface PrayerRakatUnit {
  id: string;
  kind: RakatKind;
  count: number;
  /** e.g. "Before Dhuhr", "Wajib portion" */
  label: LocalizedText;
  notes?: LocalizedText;
}

export interface SunniDifferenceNote {
  topic: LocalizedText;
  jafari: LocalizedText;
  sunni?: LocalizedText;
}

export interface PrayerTimingRule {
  id: string;
  title: LocalizedText;
  body: LocalizedText;
  /** Links to prayer-engine keys when applicable */
  prayerTimeKey?: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'sunrise' | 'sunset';
}

export interface PrayerCondition {
  id: string;
  title: LocalizedText;
  body: LocalizedText;
  /** Optional deep link into app (Qibla, wudu lesson, etc.) */
  deepLink?: { screen: string; params?: Record<string, unknown> };
}

export interface PrayerAudioCue {
  id: string;
  label: LocalizedText;
  /** Asset key for bundled audio; remote URL when synced */
  assetKey?: string;
  remoteUrl?: string;
  durationSec?: number;
}

export type PrayerStepKind =
  | 'intro'
  | 'preparation'
  | 'niyyah'
  | 'takbir'
  | 'qiyam'
  | 'recitation'
  | 'qunoot'
  | 'ruku'
  | 'sujud'
  | 'jalsa'
  | 'tashahhud'
  | 'tasbihat'
  | 'completion'
  /** Legacy — avoid for daily salat endings; use `completion` */
  | 'salam'
  | 'rakat_transition'
  | 'fiqh_note'
  | 'checklist'
  | 'diagram';

export interface PrayerGuideStep {
  id: string;
  kind: PrayerStepKind;
  rakatIndex?: number;
  titles: LocalizedText;
  body: LocalizedText;
  /** Shown only in advanced mode */
  advancedBody?: LocalizedText;
  arabic?: string;
  transliteration?: LocalizedText;
  checklist?: LocalizedText[];
  fiqhRefs?: FiqhReference[];
  audioCueId?: string;
  /** Worship simulator pose + asset (see worship-simulator module) */
  animationPose?: string;
  animationAssetKey?: string;
  pauseDurationMs?: number;
  /** Hide in beginner mode when true */
  advancedOnly?: boolean;
}

export interface PrayerAcademyMeta {
  id: PrayerAcademyId;
  slug: string;
  category: PrayerAcademyCategory;
  obligation: PrayerObligation;
  titles: LocalizedText;
  subtitles: LocalizedText;
  purpose: LocalizedText;
  description: LocalizedText;
  estimatedMinutes: number;
  hasAudio: boolean;
  hasGuidedMode: boolean;
  prerequisites?: PrayerAcademyId[];
  tags: string[];
  featured?: boolean;
}

export interface PrayerAcademyBundle {
  meta: PrayerAcademyMeta;
  bundleVersion: number;
  rakatStructure: PrayerRakatUnit[];
  timingRules: PrayerTimingRule[];
  conditions: PrayerCondition[];
  sunniDifferences?: SunniDifferenceNote[];
  audioCues?: PrayerAudioCue[];
  steps: {
    beginner: PrayerGuideStep[];
    advanced: PrayerGuideStep[];
  };
}

export interface PrayerAcademyBookmark {
  id: string;
  prayerId: PrayerAcademyId;
  stepId?: string;
  label?: string;
  createdAt: string;
}

export interface PrayerAcademyProgress {
  prayerId: PrayerAcademyId;
  completedStepIds: string[];
  completedAt?: string;
  lastStepId?: string;
  difficulty: GuideDifficulty;
  guidedModeEnabled: boolean;
}

export interface PrayerAcademyReaderPrefs {
  defaultDifficulty: GuideDifficulty;
  guidedModeDefault: boolean;
  showArabic: boolean;
  showTransliteration: boolean;
  showFiqhRefs: boolean;
}
