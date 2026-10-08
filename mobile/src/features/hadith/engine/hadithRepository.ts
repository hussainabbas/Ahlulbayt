import { HADITH_TOPICS } from '../constants/catalog';
import { BUNDLED_BY_ID, BUNDLED_HADITHS } from '../data/bundled';
import { getDailyHadith } from './dailyHadithService';
import { lookupByReference, resolveGrading, searchHadithCorpus } from './hadithSearchEngine';
import { getRelatedHadiths } from './relatedHadithEngine';
import type {
  HadithEntry,
  HadithGrading,
  HadithId,
  HadithSearchPage,
  HadithSearchResult,
  HadithSource,
  HadithTopic,
  HadithTopicSummary,
} from '../types';

export class HadithRepository {
  static listAll(): HadithEntry[] {
    return [...BUNDLED_HADITHS];
  }

  static listBySource(source: HadithSource): HadithEntry[] {
    return BUNDLED_HADITHS.filter((h) => h.source === source);
  }

  static listByTopic(topic: HadithTopic): HadithEntry[] {
    return BUNDLED_HADITHS.filter((h) => h.topics.includes(topic));
  }

  static getEntry(id: HadithId): HadithEntry | null {
    return BUNDLED_BY_ID[id] ?? null;
  }

  static getGrading(id: HadithId): HadithGrading | undefined {
    const entry = BUNDLED_BY_ID[id];
    return entry ? resolveGrading(entry) : undefined;
  }

  static getRelated(id: HadithId) {
    const entry = BUNDLED_BY_ID[id];
    if (!entry) return [];
    return getRelatedHadiths(entry, BUNDLED_HADITHS, BUNDLED_BY_ID).map((r) => r.entry);
  }

  static getRelatedDetailed(id: HadithId) {
    const entry = BUNDLED_BY_ID[id];
    if (!entry) return [];
    return getRelatedHadiths(entry, BUNDLED_HADITHS, BUNDLED_BY_ID);
  }

  static search(
    query: string,
    filters?: {
      source?: HadithSource | 'all';
      topic?: HadithTopic | 'all';
      grading?: HadithGrading | 'all';
    },
    locale = 'en',
  ): HadithSearchResult[] {
    return searchHadithCorpus(BUNDLED_HADITHS, query, { locale, filters }).results;
  }

  static searchPaginated(
    query: string,
    page = 1,
    pageSize = 20,
    filters?: {
      source?: HadithSource | 'all';
      topic?: HadithTopic | 'all';
      grading?: HadithGrading | 'all';
    },
    locale = 'en',
  ): HadithSearchPage {
    return searchHadithCorpus(BUNDLED_HADITHS, query, { locale, page, pageSize, filters });
  }

  static lookupReference(source: HadithSource, hadithNumber: string, volume?: number) {
    return lookupByReference(BUNDLED_HADITHS, source, hadithNumber, volume);
  }

  static getDailyHadith(date?: Date) {
    return getDailyHadith(date);
  }

  static filterEntries(filters: {
    source?: HadithSource | 'all';
    topic?: HadithTopic | 'all';
    bookmarkedIds?: Set<HadithId>;
    bookmarkOnly?: boolean;
  }): HadithEntry[] {
    let items = BUNDLED_HADITHS;

    if (filters.source && filters.source !== 'all') {
      items = items.filter((h) => h.source === filters.source);
    }
    if (filters.topic && filters.topic !== 'all') {
      items = items.filter((h) => h.topics.includes(filters.topic as HadithTopic));
    }
    if (filters.bookmarkOnly && filters.bookmarkedIds) {
      items = items.filter((h) => filters.bookmarkedIds!.has(h.id));
    }

    return items;
  }

  static getTopicSummaries(): HadithTopicSummary[] {
    return HADITH_TOPICS.map(({ id }) => {
      const entries = HadithRepository.listByTopic(id);
      const count = entries.length;

      const topicLabels: Record<HadithTopic, { en: string; ur: string; ar: string }> = {
        ethics: { en: 'ethics and character', ur: 'اخلاق و کردار', ar: 'الأخلاق والخلق' },
        worship: { en: 'worship and prayer', ur: 'عبادت و نماز', ar: 'العبادة والصلاة' },
        imamate: { en: 'Imamate and Wilayah', ur: 'امامت و ولایت', ar: 'الإمامة والولاية' },
        knowledge: { en: 'knowledge and learning', ur: 'علم و تعلیم', ar: 'العلم والتعلم' },
        patience: { en: 'patience and perseverance', ur: 'صبر و استقامت', ar: 'الصبر والثبات' },
        family: { en: 'family and kinship', ur: 'خاندان و رشتہ داری', ar: 'الأسرة والقرابة' },
        justice: { en: 'justice and fairness', ur: 'عدل و انصاف', ar: 'العدل والإنصاف' },
        dua: { en: 'supplication and dua', ur: 'دعا و مناجات', ar: 'الدعاء والمناجاة' },
        karbala: { en: 'Karbala and Ashura', ur: 'کربلا و عاشورا', ar: 'كربلاء وعاشوراء' },
        taqwa: { en: 'taqwa and God-consciousness', ur: 'تقویٰ', ar: 'التقوى' },
        fiqh: { en: 'fiqh and jurisprudence', ur: 'فقہ', ar: 'الفقه' },
        tawhid: { en: 'tawhid and theology', ur: 'توحید', ar: 'التوحيد' },
        akhira: { en: 'hereafter', ur: 'آخرت', ar: 'الآخرة' },
      };

      const label = topicLabels[id];
      const summaryEn =
        count > 0
          ? `${count} curated tradition${count > 1 ? 's' : ''} on ${label.en} from Shia core sources.`
          : `No traditions tagged with this topic yet.`;
      const summaryUr =
        count > 0 ? `${label.ur} پر ${count} منتخب روایات۔` : 'ابھی اس موضوع پر کوئی روایت نہیں۔';
      const summaryAr =
        count > 0 ? `${count} روايات منتقاة عن ${label.ar}.` : 'لا روايات بهذا الموضوع بعد.';

      return { topic: id, count, summary: { en: summaryEn, ur: summaryUr, ar: summaryAr } };
    });
  }
}
