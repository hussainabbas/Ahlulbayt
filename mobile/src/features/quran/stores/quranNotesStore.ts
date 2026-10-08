import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import { toAyahRef, type AyahRef, type QuranNote } from '../types';

interface NotesState {
  notes: QuranNote[];
  getNote: (surah: number, ayah: number) => QuranNote | undefined;
  upsertNote: (surah: number, ayah: number, text: string) => void;
  deleteNote: (id: string) => void;
}

export const useQuranNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      getNote: (surah, ayah) =>
        get().notes.find((n) => n.ref === toAyahRef(surah, ayah)),
      upsertNote: (surah, ayah, text) => {
        const ref = toAyahRef(surah, ayah);
        const existing = get().notes.find((n) => n.ref === ref);
        const now = new Date().toISOString();
        if (existing) {
          set((s) => ({
            notes: s.notes.map((n) =>
              n.id === existing.id ? { ...n, text, updatedAt: now } : n,
            ),
          }));
        } else {
          const note: QuranNote = {
            id: `${ref}-note-${Date.now()}`,
            ref,
            surah,
            ayah,
            text,
            createdAt: now,
            updatedAt: now,
          };
          set((s) => ({ notes: [note, ...s.notes] }));
        }
      },
      deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
    }),
    { name: 'ahlulbayt-quran-notes', storage: createJSONStorage(() => mmkvStorage) },
  ),
);

export type { AyahRef };
