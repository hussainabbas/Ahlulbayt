import { MUHARRAM_DAILY, MUHARRAM_DAYS_BY_NUMBER } from '../data/dailyContent';
import {
  ARBAEEN_STAGES,
  KARBALA_EVENTS,
  KARBALA_EVENTS_BY_DAY,
  KARBALA_EVENTS_BY_ID,
  MARTYRS,
  MARTYRS_BY_DAY,
  MARTYRS_BY_ID,
  MUHARRAM_DAY_ENTRIES,
  MUHARRAM_DAY_ENTRIES_BY_NUMBER,
  SAFAR_EVENTS,
} from '../data/bundled';
import type {
  ArbaeenStage,
  KarbalaEvent,
  MartyrProfile,
  MuharramDayContent,
  MuharramDayEntry,
  SafarEvent,
} from '../types';

// ── Legacy daily content (i18n-backed cards) ────────────────────────────────

export function getMuharramDay(day: number): MuharramDayContent | undefined {
  return MUHARRAM_DAYS_BY_NUMBER[day];
}

export function getAllMuharramDays(): MuharramDayContent[] {
  return MUHARRAM_DAILY;
}

export function clampMuharramDay(day: number): number {
  return Math.min(Math.max(day, 1), MUHARRAM_DAILY.length);
}

// ── Rich bundled entries ────────────────────────────────────────────────────

export function getMuharramDayEntry(day: number): MuharramDayEntry | undefined {
  return MUHARRAM_DAY_ENTRIES_BY_NUMBER[day];
}

export function getAllMuharramDayEntries(): MuharramDayEntry[] {
  return MUHARRAM_DAY_ENTRIES;
}

export function getKarbalaEvents(): KarbalaEvent[] {
  return KARBALA_EVENTS;
}

export function getKarbalaEvent(id: string): KarbalaEvent | undefined {
  return KARBALA_EVENTS_BY_ID[id];
}

export function getKarbalaEventsForDay(day: number): KarbalaEvent[] {
  return KARBALA_EVENTS_BY_DAY[day] ?? [];
}

export function getMartyrs(): MartyrProfile[] {
  return MARTYRS;
}

export function getMartyr(id: string): MartyrProfile | undefined {
  return MARTYRS_BY_ID[id];
}

export function getMartyrsForDay(day: number): MartyrProfile[] {
  return MARTYRS_BY_DAY[day] ?? [];
}

export function getArbaeenStages(): ArbaeenStage[] {
  return ARBAEEN_STAGES;
}

export function getSafarEvents(): SafarEvent[] {
  return SAFAR_EVENTS;
}

// ── Season helpers ──────────────────────────────────────────────────────────

export function isMuharramMonth(hijriMonth: number): boolean {
  return hijriMonth === 1;
}

export function isMuharramSeason(hijriMonth: number, hijriDay: number): boolean {
  return hijriMonth === 1 || (hijriMonth === 12 && hijriDay >= 20);
}

export function isSafarMonth(hijriMonth: number): boolean {
  return hijriMonth === 2;
}

export function resolveMuharramDay(
  hijriMonth: number,
  hijriDay: number,
  overrideDay: number | null,
): number {
  if (overrideDay != null) return clampMuharramDay(overrideDay);
  if (hijriMonth === 1) return clampMuharramDay(hijriDay);
  return 1;
}
