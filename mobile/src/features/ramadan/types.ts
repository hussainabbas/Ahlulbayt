import type { DuaId } from '@/features/dua/types';
import type { SahifaId } from '@/features/sahifa/types';

export type RamadanModeState = 'auto' | 'on' | 'off';

export type QuranGoalUnit = 'pages' | 'ayahs' | 'juz';

export type FastStatus = 'fasted' | 'missed' | 'excused' | 'makeup';

export type CharityType = 'sadaqah' | 'zakat_fitr';

export type SehriIftarPhase = 'sehri' | 'iftar';

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

export interface RamadanDuaContent {
  title: LocalizedText;
  arabic?: string;
  translation: LocalizedText;
  duaId?: DuaId;
  sahifaId?: SahifaId;
  citations: IslamicSourceCitation[];
}

export interface RamadanHadithContent {
  text: LocalizedText;
  narrator?: LocalizedText;
  citations: IslamicSourceCitation[];
}

export interface RamadanAmaalItem {
  title: LocalizedText;
  body: LocalizedText;
  citations: IslamicSourceCitation[];
}

export interface RamadanDayEntry {
  day: number;
  theme: LocalizedText;
  dua: RamadanDuaContent;
  hadith: RamadanHadithContent;
  amaal: RamadanAmaalItem[];
}

export interface LaylatAlQadrNight {
  ramadanDay: number;
  title: LocalizedText;
  narrative: LocalizedText;
  amaal: RamadanAmaalItem[];
  duaIds?: DuaId[];
  sahifaId?: SahifaId;
  citations: IslamicSourceCitation[];
  emphasized: boolean;
}

export interface CharityEntry {
  id: string;
  type: CharityType;
  amount?: number;
  currency?: string;
  note?: string;
  createdAt: string;
  fulfilled: boolean;
}

export interface FastingDayEntry {
  hijriKey: string;
  hijriDay: number;
  status: FastStatus;
  note?: string;
  updatedAt: string;
}
