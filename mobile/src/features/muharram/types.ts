import type { DuaId } from '@/features/dua/types';
import type { MasoomeenId } from '@/features/masoomeen/types';
import type { ZiyaratId } from '@/features/ziyarat/types';

/** @deprecated Use MuharramDayEntry — kept for legacy daily cards */
export interface MuharramDayContent {
  day: number;
  karbalaEventKey: string;
  karbalaDetailKey: string;
  majlisTitleKey: string;
  majlisBodyKey: string;
  majlisThemeKey: string;
  amalTitleKey: string;
  amalBodyKey: string;
  amalStepsKey: string;
  duaId?: DuaId;
  ziyaratId: ZiyaratId;
}

export type MuharramModeState = 'auto' | 'on' | 'off';

export type MuharramDayTab = 'events' | 'amaal' | 'duas' | 'ziyarat' | 'quran';

export interface LocalizedText {
  en: string;
  ur?: string;
  ar?: string;
}

/** Scholarly reference — mark unverified when uncertain */
export interface IslamicSourceCitation {
  book: string;
  volume?: number | string;
  page?: string | number;
  hadithNumber?: string;
  scholar?: string;
  chapter?: string;
  unverified?: boolean;
  note?: string;
}

export interface HistoricalClaim {
  id: string;
  narrative: LocalizedText;
  significance: LocalizedText;
  citations: IslamicSourceCitation[];
}

export interface QuranRecitation {
  surahNumbers: number[];
  ayahRanges?: { surah: number; from: number; to?: number }[];
  note?: LocalizedText;
  citations?: IslamicSourceCitation[];
}

export interface DailyWorshipPack {
  amalTitle: LocalizedText;
  amalBody: LocalizedText;
  amalSteps: LocalizedText;
  duaIds?: DuaId[];
  ziyaratIds: ZiyaratId[];
  quran?: QuranRecitation;
  citations?: IslamicSourceCitation[];
}

export interface MuharramDayEntry {
  day: number;
  title: LocalizedText;
  narrative: LocalizedText;
  significance: LocalizedText;
  claims: HistoricalClaim[];
  worship: DailyWorshipPack;
  karbalaEventIds: string[];
  relatedMasoomeenIds?: MasoomeenId[];
  /** Links to legacy i18n keys under muharramMode.days */
  legacyKey: string;
}

export type KarbalaTimeOfDay = 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';

export interface KarbalaEvent {
  id: string;
  muharramDay: number;
  hijriLabel: string;
  order: number;
  timeOfDay?: KarbalaTimeOfDay;
  title: LocalizedText;
  narrative: LocalizedText;
  significance: LocalizedText;
  citations: IslamicSourceCitation[];
  martyrIds?: string[];
}

export interface MartyrProfile {
  id: string;
  name: LocalizedText;
  honorific?: LocalizedText;
  role: LocalizedText;
  shahadatDay: number;
  narrative: LocalizedText;
  significance: LocalizedText;
  citations: IslamicSourceCitation[];
  masoomeenId?: MasoomeenId;
}

export interface ArbaeenStage {
  id: string;
  order: number;
  title: LocalizedText;
  narrative: LocalizedText;
  significance: LocalizedText;
  citations: IslamicSourceCitation[];
  hijriMonth: number;
  hijriDay: number;
  ziyaratId?: ZiyaratId;
}

export interface SafarEvent {
  id: string;
  safarDay: number;
  title: LocalizedText;
  narrative: LocalizedText;
  significance: LocalizedText;
  citations: IslamicSourceCitation[];
  relatedMasoomeenIds?: MasoomeenId[];
}
