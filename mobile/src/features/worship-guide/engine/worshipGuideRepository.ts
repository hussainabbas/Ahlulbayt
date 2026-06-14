import type { GuideLearningMode, WorshipGuideBundle, WorshipGuideId } from '../types';
import { BUNDLED_WORSHIP_GUIDES } from '../data/bundled';
import { WORSHIP_GUIDE_CATALOG } from '../constants/catalog';

export class WorshipGuideRepository {
  static listCatalog() {
    return WORSHIP_GUIDE_CATALOG;
  }

  static getBundle(id: string): WorshipGuideBundle | undefined {
    return BUNDLED_WORSHIP_GUIDES[id];
  }

  static getSteps(id: string, mode: GuideLearningMode) {
    const bundle = BUNDLED_WORSHIP_GUIDES[id];
    return bundle?.steps[mode] ?? [];
  }

  static isValidId(id: string): id is WorshipGuideId {
    return id in BUNDLED_WORSHIP_GUIDES;
  }

  static featured(): WorshipGuideBundle | undefined {
    const featuredId = WORSHIP_GUIDE_CATALOG.find((c) => c.featured)?.id;
    return featuredId ? BUNDLED_WORSHIP_GUIDES[featuredId] : undefined;
  }
}
