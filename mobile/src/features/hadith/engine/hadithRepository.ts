import { HADITH_TOPICS } from '../constants/catalog';
import { BUNDLED_BY_ID, BUNDLED_HADITHS } from '../data/bundled';
import type {
  HadithEntry,
  HadithId,
  HadithSearchResult,
  HadithSource,
  HadithTopic,
  HadithTopicSummary,
  LocalizedText,
} from '../types';

function scoreMatch(text: string, query: string): number {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  if (lower === q) return 100;
  if (lower.startsWith(q)) return 80;
  if (lower.includes(q)) return 50;
  return 0;
}

function searchInLocalized(text: LocalizedText, query: string): number {
  return Math.max(scoreMatch(text.en, query), scoreMatch(text.ur, query), scoreMatch(text.ar, query));
}

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

  static getRelated(id: HadithId): HadithEntry[] {
    const entry = BUNDLED_BY_ID[id];
    if (!entry?.relatedIds?.length) return [];
    return entry.relatedIds
      .map((rid) => BUNDLED_BY_ID[rid])
      .filter((e): e is HadithEntry => e != null);
  }

  static search(
    query: string,
    filters?: { source?: HadithSource | 'all'; topic?: HadithTopic | 'all' },
  ): HadithSearchResult[] {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const results: HadithSearchResult[] = [];

    for (const entry of BUNDLED_HADITHS) {
      if (filters?.source && filters.source !== 'all' && entry.source !== filters.source) continue;
      if (filters?.topic && filters.topic !== 'all' && !entry.topics.includes(filters.topic)) continue;

      let score = 0;
      score = Math.max(score, searchInLocalized(entry.title, trimmed));
      score = Math.max(score, searchInLocalized(entry.text, trimmed) * 0.8);
      score = Math.max(score, searchInLocalized(entry.summary, trimmed) * 0.6);

      for (const topic of entry.topics) {
        if (topic.includes(trimmed.toLowerCase())) score += 20;
      }

      if (entry.reference.hadithNumber?.includes(trimmed)) score += 40;
      if (entry.reference.volume?.toString() === trimmed) score += 30;

      if (score > 0) {
        results.push({
          id: entry.id,
          title: entry.title.en,
          snippet: entry.summary.en.slice(0, 140),
          source: entry.source,
          topics: entry.topics,
          score,
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
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
      const en =
        count > 0
          ? `${entries.length} tradition${entries.length > 1 ? 's' : ''} on ${id.replace('_', ' ')} from Nahjul Balagha, Al-Kafi, and Bihar ul Anwar.`
          : `No traditions tagged with this topic yet.`;
      const ur =
        count > 0
          ? `${entries.length} روایات — نہج البلاغہ، الکافی، بحار الانوار سے۔`
          : 'ابھی اس موضوع پر کوئی روایت نہیں۔';
      const ar =
        count > 0
          ? `${entries.length} روايات من نهج البلاغة والكافي وبحار الأنوار.`
          : 'لا روايات بهذا الموضوع بعد.';

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
      };

      const label = topicLabels[id];
      const summaryEn =
        count > 0
          ? `This collection covers ${label.en} across ${count} curated traditions from the three major Shia sources.`
          : en;
      const summaryUr =
        count > 0 ? `${label.ur} پر ${count} منتخب روایات — تین بڑے شیعہ ماخذ سے۔` : ur;
      const summaryAr =
        count > 0 ? `${count} روايات منتقاة عن ${label.ar} من المصادر الثلاثة.` : ar;

      return {
        topic: id,
        count,
        summary: { en: summaryEn, ur: summaryUr, ar: summaryAr },
      };
    });
  }
}
