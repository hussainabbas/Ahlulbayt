import type { IslamicReference } from '../types';

/** Structured sources backing offline AI FAQ entries. */
export const FAQ_REFERENCE_CATALOG: Record<string, IslamicReference[]> = {
  who_ahlulbayt: [
    {
      id: 'faq-ahlulbayt-quran',
      kind: 'quran',
      primarySource: { en: 'Holy Quran', ur: 'قرآن مجید', ar: 'القرآن الكريم' },
      surah: 33,
      ayah: 33,
      translationSource: { en: 'Clear Quran (adapted)' },
      contentRef: 'quran:33:33',
      verification: 'verified',
    },
    {
      id: 'faq-ahlulbayt-hadith',
      kind: 'hadith',
      primarySource: { en: 'Al-Kafi', ur: 'الکافی', ar: 'الكافي' },
      volume: 2,
      bookName: { en: 'Kitab al-Hujjah' },
      hadithNumber: '13',
      scholar: { en: 'Imam Ja\'far al-Sadiq (as)' },
      verification: 'verified',
    },
  ],
  twelve_imams: [
    {
      id: 'faq-imams-hadith',
      kind: 'hadith',
      primarySource: { en: 'Al-Kafi', ur: 'الکافی', ar: 'الكافي' },
      volume: 1,
      bookName: { en: 'Kitab al-Hujjah' },
      hadithNumber: '286',
      scholar: { en: 'Imam Ja\'far al-Sadiq (as)' },
      verification: 'verified',
    },
  ],
  karbala: [
    {
      id: 'faq-karbala-maqtal',
      kind: 'history',
      primarySource: { en: 'Maqtal literature & Muharram observances' },
      bookName: { en: 'Tarikh al-Tabari (Battle of Karbala account)' },
      verification: 'verified',
    },
    {
      id: 'faq-karbala-ziyarat',
      kind: 'ziyarat',
      primarySource: { en: 'Kamil al-Ziyarat' },
      chapter: { en: 'Ziyarat Ashura' },
      verification: 'verified',
    },
  ],
  ghadeer: [
    {
      id: 'faq-ghadeer-quran',
      kind: 'quran',
      primarySource: { en: 'Holy Quran', ur: 'قرآن مجید', ar: 'القرآن الكريم' },
      surah: 5,
      ayah: 3,
      translationSource: { en: 'Clear Quran (adapted)' },
      contentRef: 'quran:5:3',
      verification: 'verified',
    },
    {
      id: 'faq-ghadeer-hadith',
      kind: 'hadith',
      primarySource: { en: 'Al-Kafi', ur: 'الکافی', ar: 'الكافي' },
      volume: 1,
      hadithNumber: '416',
      scholar: { en: 'Multiple narrations on Ghadir Khumm' },
      verification: 'verified',
    },
  ],
  tawassul: [
    {
      id: 'faq-tawassul-quran',
      kind: 'quran',
      primarySource: { en: 'Holy Quran', ur: 'قرآن مجید', ar: 'القرآن الكريم' },
      surah: 12,
      ayah: 97,
      contentRef: 'quran:12:97',
      verification: 'verified',
    },
    {
      id: 'faq-tawassul-hadith',
      kind: 'hadith',
      primarySource: { en: 'Al-Kafi', ur: 'الکافی', ar: 'الكافي' },
      volume: 2,
      hadithNumber: '573',
      verification: 'verified',
    },
  ],
};

export const AI_PRAYER_GUIDANCE_REFS: IslamicReference[] = [
  {
    id: 'ai-prayer-sistani',
    kind: 'fiqh',
    primarySource: { en: 'Islamic Laws — Sayyid Sistani' },
    bookName: { en: 'Rules of Prayer' },
    marja: 'sistani',
    url: 'https://www.sistani.org/english/book/48/',
    verification: 'verified',
  },
  {
    id: 'ai-prayer-leva',
    kind: 'scholar',
    primarySource: { en: 'Leva Institute Method' },
    scholar: { en: 'Jafari prayer time calculation' },
    verification: 'verified',
  },
];

export const AI_DUA_REFS: IslamicReference[] = [
  {
    id: 'ai-dua-mafatih',
    kind: 'dua',
    primarySource: { en: 'Mafatih al-Jinan' },
    bookName: { en: 'Duas & Amaal' },
    scholar: { en: 'Shaykh Abbas Qummi' },
    verification: 'verified',
  },
];

export const AI_ZIYARAT_REFS: IslamicReference[] = [
  {
    id: 'ai-ziyarat-kamil',
    kind: 'ziyarat',
    primarySource: { en: 'Kamil al-Ziyarat' },
    scholar: { en: 'Ibn Qulawayh' },
    verification: 'verified',
  },
];

export const AI_CALENDAR_REFS: IslamicReference[] = [
  {
    id: 'ai-calendar-shia',
    kind: 'calendar',
    primarySource: { en: 'Shia Islamic Calendar' },
    bookName: { en: 'Bundled observances & amaal keys' },
    verification: 'verified',
  },
];
