import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';
import { getHijriDate } from '@/features/home/services/hijriDate';

import { RAMADAN_HIJRI_MONTH } from '../engine/ramadanProgress';
import type { FastDayRecord, FastKind, MissedFast, MissedFastReason } from '../types';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function newId(): string {
  return `mf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function hijriPartsForDate(dateKey: string, locale = 'en') {
  const hijri = getHijriDate(new Date(`${dateKey}T12:00:00`), locale);
  return { hijriYear: hijri.year, hijriMonth: hijri.month, hijriDay: hijri.day };
}

interface FastingState {
  fasts: FastDayRecord[];
  missed: MissedFast[];
}

interface FastingActions {
  toggleFast: (dateKey?: string, kind?: FastKind, locale?: string) => boolean;
  isFasted: (dateKey?: string) => boolean;
  getFast: (dateKey?: string) => FastDayRecord | undefined;
  addMissedFast: (
    input: Pick<MissedFast, 'dateKey' | 'reason' | 'reasonNotes' | 'qadaDateKey'> & {
      qadaCompleted?: boolean;
    },
    locale?: string,
  ) => MissedFast;
  updateMissedFast: (id: string, patch: Partial<MissedFast>) => void;
  removeMissedFast: (id: string) => void;
  markQadaComplete: (id: string, qadaDateKey?: string) => void;
  getMissedForDate: (dateKey: string) => MissedFast | undefined;
}

export const useFastingStore = create<FastingState & FastingActions>()(
  persist(
    (set, get) => ({
      fasts: [],
      missed: [],

      toggleFast(dateKey = todayKey(), kind, locale = 'en') {
        const hijri = hijriPartsForDate(dateKey, locale);
        const resolvedKind =
          kind ??
          (hijri.hijriMonth === RAMADAN_HIJRI_MONTH ? 'ramadan' : 'sunnah');
        const existing = get().fasts.find((f) => f.dateKey === dateKey);
        const now = new Date().toISOString();

        if (existing?.completed) {
          set({
            fasts: get().fasts.map((f) =>
              f.dateKey === dateKey ? { ...f, completed: false, updatedAt: now } : f,
            ),
          });
          return false;
        }

        const record: FastDayRecord = {
          dateKey,
          kind: existing?.kind ?? resolvedKind,
          ...hijri,
          completed: true,
          updatedAt: now,
        };

        set({
          fasts: existing
            ? get().fasts.map((f) => (f.dateKey === dateKey ? record : f))
            : [...get().fasts, record],
        });
        return true;
      },

      isFasted(dateKey = todayKey()) {
        return get().fasts.some((f) => f.dateKey === dateKey && f.completed);
      },

      getFast(dateKey = todayKey()) {
        return get().fasts.find((f) => f.dateKey === dateKey);
      },

      addMissedFast(input, locale = 'en') {
        const hijri = hijriPartsForDate(input.dateKey, locale);
        const now = new Date().toISOString();
        const entry: MissedFast = {
          id: newId(),
          dateKey: input.dateKey,
          reason: input.reason,
          reasonNotes: input.reasonNotes,
          qadaCompleted: input.qadaCompleted ?? false,
          qadaDateKey: input.qadaDateKey,
          createdAt: now,
          updatedAt: now,
          ...hijri,
        };
        set({ missed: [...get().missed, entry] });
        return entry;
      },

      updateMissedFast(id, patch) {
        const now = new Date().toISOString();
        set({
          missed: get().missed.map((m) =>
            m.id === id ? { ...m, ...patch, updatedAt: now } : m,
          ),
        });
      },

      removeMissedFast(id) {
        set({ missed: get().missed.filter((m) => m.id !== id) });
      },

      markQadaComplete(id, qadaDateKey = todayKey()) {
        get().updateMissedFast(id, { qadaCompleted: true, qadaDateKey });
        get().toggleFast(qadaDateKey, 'qada');
      },

      getMissedForDate(dateKey) {
        return get().missed.find((m) => m.dateKey === dateKey);
      },
    }),
    {
      name: 'ahlulbayt-fasting',
      storage: createJSONStorage(() => mmkvStorage),
      merge: (persisted, current) => {
        const saved = persisted as Partial<FastingState> | undefined;
        return {
          ...current,
          fasts: Array.isArray(saved?.fasts) ? saved.fasts : current.fasts,
          missed: Array.isArray(saved?.missed) ? saved.missed : current.missed,
        };
      },
    },
  ),
);

export type { MissedFastReason };
