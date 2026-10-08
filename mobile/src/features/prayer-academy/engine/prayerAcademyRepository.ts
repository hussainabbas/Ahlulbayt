import type {
  GuideDifficulty,
  PrayerAcademyBundle,
  PrayerAcademyId,
  PrayerAcademyMeta,
  PrayerGuideStep,
} from '../types';
import { PRAYER_ACADEMY_CATALOG } from '../constants/catalog';
import { BUNDLED_PRAYERS } from '../data/bundled';

const cache = new Map<PrayerAcademyId, PrayerAcademyBundle>();

export const PrayerAcademyRepository = {
  listCatalog(): PrayerAcademyMeta[] {
    return PRAYER_ACADEMY_CATALOG;
  },

  getMeta(id: PrayerAcademyId): PrayerAcademyMeta | null {
    return PRAYER_ACADEMY_CATALOG.find((p) => p.id === id) ?? null;
  },

  getBundle(id: PrayerAcademyId): PrayerAcademyBundle | null {
    if (cache.has(id)) return cache.get(id)!;
    const bundled = BUNDLED_PRAYERS[id];
    if (bundled) {
      cache.set(id, bundled);
      return bundled;
    }
    return null;
  },

  getSteps(id: PrayerAcademyId, difficulty: GuideDifficulty): PrayerGuideStep[] {
    const bundle = this.getBundle(id);
    if (!bundle) return [];
    const steps = difficulty === 'advanced' ? bundle.steps.advanced : bundle.steps.beginner;
    if (difficulty === 'beginner') {
      return steps.filter((s) => !s.advancedOnly);
    }
    if (steps.length > 0) return steps;
    return bundle.steps.beginner.filter((s) => !s.advancedOnly);
  },

  searchCatalog(query: string): PrayerAcademyMeta[] {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return PRAYER_ACADEMY_CATALOG;
    return PRAYER_ACADEMY_CATALOG.filter((meta) => {
      const haystack = [
        meta.titles.en,
        meta.titles.ur,
        meta.titles.ar,
        meta.description.en,
        meta.description.ur,
        meta.purpose.en,
        ...meta.tags,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  },
};
