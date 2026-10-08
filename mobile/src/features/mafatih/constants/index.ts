import { DUA_CATALOG } from '@/features/dua/constants/catalog';
import { SAHIFA_CATALOG } from '@/features/sahifa/constants/catalog';
import { ZIYARAT_CATALOG } from '@/features/ziyarat/constants/catalog';

import type {
  MafatihChapter,
  MafatihCollection,
  MafatihCollectionId,
  MafatihEntry,
  MafatihRef,
} from '../types';
import { toMafatihRef } from '../types';

export const MAFATIH_COLLECTIONS: MafatihCollection[] = [
  {
    id: 'mafatih_al_jinan',
    titles: { en: 'Mafatih al-Jinan', ur: 'مفاتیح الجنان', ar: 'مفاتيح الجنان' },
    description: {
      en: 'Keys to the Gardens of Paradise — the complete devotional companion.',
      ur: 'کلید باغات جنت — مکمل عبادتی کتاب۔',
    },
    sortOrder: 1,
  },
  {
    id: 'kamil_al_ziyarat',
    titles: { en: 'Kamil al-Ziyarat', ur: 'کامل الزيارات', ar: 'كامل الزيارات' },
    description: {
      en: 'Complete visitations of the Holy Imams (AS).',
      ur: 'ائمہؑ اطہارؑ کی مکمل زیارات۔',
    },
    sortOrder: 2,
  },
  {
    id: 'sahifa_sajjadia',
    titles: { en: 'Sahifa Sajjadia', ur: 'صحیفہ سجادیہ', ar: 'الصحيفة السجادية' },
    description: {
      en: 'The Psalms of Islam — supplications of Imam Zayn al-Abidin (AS).',
      ur: 'زبور اہل بیتؑ — امام زین العابدینؑ کی دعائیں۔',
    },
    sortOrder: 3,
  },
  {
    id: 'taqibat',
    titles: { en: 'Taqibat al-Salat', ur: 'تعقیبات الصلوٰة', ar: 'تعقيبات الصلاة' },
    description: {
      en: 'Post-prayer supplications after each salah.',
      ur: 'ہر نماز کے بعد کی دعائیں۔',
    },
    sortOrder: 4,
  },
];

export const MAFATIH_CHAPTERS: MafatihChapter[] = [
  {
    id: 'duas_munajat',
    partNumber: 1,
    titles: { en: 'Duas & Munajat', ur: 'دعائیں و مناجات', ar: 'الأدعية والمناجات' },
    sortOrder: 1,
  },
  {
    id: 'amaal',
    partNumber: 2,
    titles: { en: 'Aamal', ur: 'اعمال', ar: 'الأعمال' },
    sortOrder: 2,
  },
  {
    id: 'ziyarat',
    partNumber: 3,
    titles: { en: 'Ziyarat', ur: 'زیارت', ar: 'الزيارات' },
    sortOrder: 3,
  },
  {
    id: 'namaaz',
    partNumber: 4,
    titles: { en: 'Namaaz', ur: 'نماز', ar: 'الصلاة' },
    sortOrder: 4,
  },
];

const DUA_SCHEDULE_MAP: Record<string, MafatihEntry['schedule']> = {
  daily: 'daily',
  weekly: 'weekly',
  occasion: 'occasion',
};

const DUA_DAYS_MAP: Record<string, string[]> = {
  dua_kumail: ['thursday'],
  dua_tawassul: ['tuesday'],
  dua_ahad: ['daily_morning'],
  dua_nudba: ['friday'],
  dua_sabah: ['daily_morning'],
  dua_mashlool: ['anytime'],
};

const ZIYARAT_SCHEDULE_MAP: Record<string, MafatihEntry['schedule']> = {
  ashura: 'occasion',
  arbaeen: 'occasion',
  daily: 'daily',
  imam: 'anytime',
  general: 'weekly',
};

function buildSearchText(entry: Partial<MafatihEntry>): string {
  return [
    entry.titles?.en,
    entry.titles?.ur,
    entry.titles?.ar,
    entry.subtitles?.en,
    entry.subtitles?.ur,
    entry.description?.en,
    entry.description?.ur,
    entry.source?.en,
    entry.mafatihRef,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function duaEntries(): MafatihEntry[] {
  const mafatihRefs: Record<string, string> = {
    dua_kumail: '1.14',
    dua_tawassul: '1.22',
    dua_ahad: '1.8',
    dua_nudba: '1.16',
    dua_sabah: '1.5',
    dua_mashlool: '1.12',
  };

  return DUA_CATALOG.map((d, i) => ({
    ref: toMafatihRef('dua', d.id),
    kind: 'dua' as const,
    contentId: d.id,
    slug: d.slug,
    mafatihRef: mafatihRefs[d.id] ?? `1.${i + 1}`,
    collectionId: 'mafatih_al_jinan' as MafatihCollectionId,
    chapterId: 'duas_munajat',
    schedule: DUA_SCHEDULE_MAP[d.category] ?? 'anytime',
    recommendedDays: DUA_DAYS_MAP[d.id],
    titles: d.titles,
    subtitles: d.subtitles,
    description: d.description,
    source: d.source,
    sectionCount: d.sectionCount,
    estimatedMinutes: d.estimatedMinutes,
    hasAudio: d.hasAudio,
    bundled: true,
    sortOrder: i + 1,
    searchText: '',
  })).map((e) => ({ ...e, searchText: buildSearchText(e) }));
}

function ziyaratEntries(): MafatihEntry[] {
  const mafatihRefs: Record<string, string> = {
    ziyarat_ashura: '3.1',
    ziyarat_waritha: '3.2',
    ziyarat_aminullah: '3.8',
    ziyarat_arbaeen: '3.3',
    ziyarat_jamia_kabira: '3.12',
    ziyarat_ale_yasin: '3.5',
  };

  return ZIYARAT_CATALOG.map((z, i) => ({
    ref: toMafatihRef('ziyarat', z.id),
    kind: 'ziyarat' as const,
    contentId: z.id,
    slug: z.slug,
    mafatihRef: mafatihRefs[z.id] ?? `3.${i + 1}`,
    collectionId: 'kamil_al_ziyarat' as MafatihCollectionId,
    chapterId: 'ziyarat',
    schedule: ZIYARAT_SCHEDULE_MAP[z.occasion] ?? 'anytime',
    recommendedDays:
      z.id === 'ziyarat_ashura'
        ? ['ashura']
        : z.id === 'ziyarat_arbaeen'
          ? ['arbaeen']
          : undefined,
    titles: z.titles,
    subtitles: z.subtitles,
    description: z.description,
    source: z.source,
    sectionCount: z.sectionCount,
    estimatedMinutes: z.estimatedMinutes,
    hasAudio: z.hasAudio,
    bundled: true,
    sortOrder: 100 + i + 1,
    searchText: '',
  })).map((e) => ({ ...e, searchText: buildSearchText(e) }));
}

function sahifaSchedule(themes: string[]): MafatihEntry['schedule'] {
  if (themes.includes('daily')) return 'daily';
  if (themes.includes('friday')) return 'weekly';
  if (themes.includes('occasion')) return 'occasion';
  return 'anytime';
}

function sahifaEntries(): MafatihEntry[] {
  return SAHIFA_CATALOG.map((s) => ({
    ref: toMafatihRef('sahifa', s.id),
    kind: 'sahifa' as const,
    contentId: s.id,
    slug: s.slug,
    mafatihRef: `SS.${s.number}`,
    collectionId: 'sahifa_sajjadia' as MafatihCollectionId,
    chapterId: 'duas_munajat',
    schedule: sahifaSchedule(s.themes),
    recommendedDays: s.number === 31 ? ['friday'] : undefined,
    titles: s.titles,
    subtitles: s.subtitles,
    description: s.description,
    source: {
      en: 'Imam Zayn al-Abidin (AS), Al-Sahifa al-Sajjadiyya',
      ur: 'امام زین العابدینؑ، الصحیفہ السجادیہ',
    },
    sectionCount: s.sectionCount,
    estimatedMinutes: s.estimatedMinutes,
    hasAudio: s.hasAudio,
    bundled: s.bundled,
    sortOrder: 200 + s.number,
    searchText: '',
  })).map((e) => ({ ...e, searchText: buildSearchText(e) }));
}

/** Flat searchable index of all Mafatih content. */
export const MAFATIH_INDEX: MafatihEntry[] = [
  ...duaEntries(),
  ...ziyaratEntries(),
  ...sahifaEntries(),
].sort(
  (a, b) => a.sortOrder - b.sortOrder,
);

export function getMafatihEntry(ref: MafatihRef): MafatihEntry | undefined {
  return MAFATIH_INDEX.find((e) => e.ref === ref);
}

export function getEntriesByChapter(chapterId: string): MafatihEntry[] {
  return MAFATIH_INDEX.filter((e) => e.chapterId === chapterId);
}

export function getEntriesByCollection(collectionId: MafatihCollectionId): MafatihEntry[] {
  return MAFATIH_INDEX.filter((e) => e.collectionId === collectionId);
}

export function getTodayRecommendation(): MafatihEntry | undefined {
  const day = new Date().getDay(); // 0 Sun … 4 Thu … 5 Fri
  if (day === 4) return getMafatihEntry('dua:dua_kumail');
  if (day === 5) return getMafatihEntry('dua:dua_nudba');
  if (day === 2) return getMafatihEntry('dua:dua_tawassul');
  return getMafatihEntry('dua:dua_sabah');
}

export function getCollection(id: MafatihCollectionId): MafatihCollection | undefined {
  return MAFATIH_COLLECTIONS.find((c) => c.id === id);
}

export function getChapter(id: string): MafatihChapter | undefined {
  return MAFATIH_CHAPTERS.find((c) => c.id === id);
}
