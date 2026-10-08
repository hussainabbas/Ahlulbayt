import { DuaRepository } from '@/features/dua/engine/duaRepository';
import type { DuaId } from '@/features/dua/types';
import { SahifaRepository } from '@/features/sahifa/engine/sahifaRepository';
import type { SahifaId } from '@/features/sahifa/types';
import { ZiyaratRepository } from '@/features/ziyarat/engine/ziyaratRepository';
import type { ZiyaratId } from '@/features/ziyarat/types';

import {
  MAFATIH_CHAPTERS,
  MAFATIH_COLLECTIONS,
  MAFATIH_INDEX,
  getChapter,
  getCollection,
  getEntriesByChapter,
  getEntriesByCollection,
  getMafatihEntry,
  getTodayRecommendation,
} from '../constants/index';
import type {
  MafatihChapter,
  MafatihCollection,
  MafatihCollectionId,
  MafatihEntry,
  MafatihReaderBundle,
  MafatihRef,
  MafatihSchedule,
} from '../types';
import { parseMafatihRef } from '../types';

export class MafatihRepository {
  static listAll(): MafatihEntry[] {
    return MAFATIH_INDEX;
  }

  static listCollections(): MafatihCollection[] {
    return MAFATIH_COLLECTIONS;
  }

  static listChapters(): MafatihChapter[] {
    return MAFATIH_CHAPTERS;
  }

  static getEntry(ref: MafatihRef): MafatihEntry | undefined {
    return getMafatihEntry(ref);
  }

  static getCollection(id: MafatihCollectionId): MafatihCollection | undefined {
    return getCollection(id);
  }

  static getChapter(id: string): MafatihChapter | undefined {
    return getChapter(id);
  }

  static getByChapter(chapterId: string): MafatihEntry[] {
    return getEntriesByChapter(chapterId);
  }

  static getByCollection(collectionId: MafatihCollectionId): MafatihEntry[] {
    return getEntriesByCollection(collectionId);
  }

  static getBySchedule(schedule: MafatihSchedule): MafatihEntry[] {
    return MAFATIH_INDEX.filter((e) => e.schedule === schedule);
  }

  static getTodayRecommendation(): MafatihEntry | undefined {
    return getTodayRecommendation();
  }

  static isOfflineAvailable(ref: MafatihRef): boolean {
    const entry = getMafatihEntry(ref);
    if (!entry?.bundled) return false;
    const { kind, contentId } = parseMafatihRef(ref);
    if (kind === 'dua') return DuaRepository.isAvailable(contentId as DuaId);
    if (kind === 'ziyarat') return ZiyaratRepository.isAvailable(contentId as ZiyaratId);
    if (kind === 'sahifa') return SahifaRepository.isAvailable(contentId as SahifaId);
    return false;
  }

  static getBundle(ref: MafatihRef): MafatihReaderBundle | null {
    const entry = getMafatihEntry(ref);
    if (!entry) return null;

    const { kind, contentId } = parseMafatihRef(ref);

    if (kind === 'dua') {
      const bundle = DuaRepository.getDua(contentId as DuaId);
      if (!bundle) return null;
      return {
        entry,
        sections: bundle.sections.map((s) => ({
          id: s.id,
          title: s.title,
          arabic: s.arabic,
          translations: s.translations,
        })),
        bundleVersion: bundle.bundleVersion,
      };
    }

    if (kind === 'ziyarat') {
      const bundle = ZiyaratRepository.get(contentId as ZiyaratId);
      if (!bundle) return null;
      return {
        entry,
        sections: bundle.sections.map((s) => ({
          id: s.id,
          title: s.title,
          arabic: s.arabic,
          translations: s.translations,
          sacred: s.sacred,
        })),
        bundleVersion: bundle.bundleVersion,
      };
    }

    if (kind === 'sahifa') {
      const bundle = SahifaRepository.getSupplication(contentId as SahifaId);
      if (!bundle) return null;
      return {
        entry,
        sections: bundle.sections.map((s) => ({
          id: s.id,
          title: s.title,
          arabic: s.arabic,
          translations: s.translations,
        })),
        bundleVersion: bundle.bundleVersion,
      };
    }

    return null;
  }
}
