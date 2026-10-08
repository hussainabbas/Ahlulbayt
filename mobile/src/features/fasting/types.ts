import type { IslamicReference } from '@/core/references/types';

/** Compatible alias for scholarly citations in fasting fiqh content. */
export type IslamicCitation = IslamicReference;

export type FastKind = 'ramadan' | 'sunnah' | 'qada' | 'optional';

export type MissedFastReason =
  | 'illness'
  | 'travel'
  | 'menstruation'
  | 'pregnancy'
  | 'other';

export interface FastDayRecord {
  /** Gregorian YYYY-MM-DD */
  dateKey: string;
  kind: FastKind;
  hijriYear: number;
  hijriMonth: number;
  hijriDay: number;
  /** User marked as completed fast */
  completed: boolean;
  notes?: string;
  updatedAt: string;
}

export interface MissedFast {
  id: string;
  /** Gregorian date the fast was missed */
  dateKey: string;
  hijriYear: number;
  hijriMonth: number;
  hijriDay: number;
  reason: MissedFastReason;
  reasonNotes?: string;
  qadaCompleted: boolean;
  qadaDateKey?: string;
  createdAt: string;
  updatedAt: string;
}

export type KaffaraBreakType =
  | 'intentional'
  | 'forgetful'
  | 'coerced'
  | 'invalidator_only';

export type KaffaraInvalidator = 'food_drink' | 'sexual' | 'other';

export interface KaffaraInput {
  breakType: KaffaraBreakType;
  invalidator: KaffaraInvalidator;
  /** Number of Ramadan days intentionally broken */
  daysBroken: number;
  isRamadan: boolean;
  marja?: 'sistani' | 'khamenei' | 'general';
}

export interface KaffaraObligation {
  id: string;
  summaryKey: string;
  detailKey: string;
  quantity?: number;
  unitKey?: string;
  citations: IslamicCitation[];
  unverified: boolean;
}

export interface KaffaraResult {
  obligations: KaffaraObligation[];
  disclaimerKey: string;
  consultMarja: boolean;
  citations: IslamicCitation[];
}

export interface FidyaInput {
  missedDays: number;
  /** Grams of staple food per day (Sistani default ~750g) */
  gramsPerDay?: number;
  marja?: 'sistani' | 'khamenei' | 'general';
}

export interface FidyaResult {
  totalGrams: number;
  totalKg: number;
  perDayGrams: number;
  missedDays: number;
  summaryKey: string;
  detailKey: string;
  citations: IslamicCitation[];
  disclaimerKey: string;
  consultMarja: boolean;
}

export type FastingPhase = 'sehri' | 'iftar';

export interface FastingCountdownSnapshot {
  phase: FastingPhase;
  targetTime: Date;
  countdownMs: number;
  countdownFormatted: string;
  targetPrayer: 'imsak' | 'maghrib';
}

export type RamadanDayStatus =
  | 'fasted'
  | 'missed'
  | 'pending'
  | 'sunnah'
  | 'today'
  | 'future'
  | 'none';

export interface RamadanCalendarDay {
  hijriDay: number;
  dateKey: string;
  status: RamadanDayStatus;
}

export interface RamadanProgressSnapshot {
  hijriYear: number;
  totalDays: number;
  fastedCount: number;
  missedCount: number;
  pendingCount: number;
  streak: number;
  progressRatio: number;
  calendar: RamadanCalendarDay[];
}
