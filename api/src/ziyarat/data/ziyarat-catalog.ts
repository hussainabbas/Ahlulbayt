export interface ZiyaratCatalogEntry {
  id: string;
  titles: { en: string; ar: string; ur: string };
  category: string;
  tags: string[];
  occasion?: string;
}

export const ZIYARAT_CATALOG: ZiyaratCatalogEntry[] = [
  {
    id: 'ziyarat_ashura',
    titles: { en: 'Ziyarat Ashura', ar: 'زيارة عاشura', ur: 'زیارت عاشور' },
    category: 'karbala',
    tags: ['ashura', 'muharram', 'imam_husayn'],
    occasion: 'muharram_10',
  },
  {
    id: 'ziyarat_arbaeen',
    titles: { en: 'Ziyarat Arbaeen', ar: 'زيارة الأربعين', ur: 'زیارت اربعین' },
    category: 'karbala',
    tags: ['arbaeen', 'imam_husayn'],
    occasion: 'arbaeen',
  },
  {
    id: 'ziyarat_waritha',
    titles: { en: 'Ziyarat Waritha', ar: 'زيارة وارث', ur: 'زیارت وارث' },
    category: 'karbala',
    tags: ['daily', 'imam_husayn'],
  },
  {
    id: 'ziyarat_aminullah',
    titles: { en: 'Ziyarat Aminullah', ar: 'زيارة أمين الله', ur: 'زیارت امین اللہ' },
    category: 'karbala',
    tags: ['daily', 'imam_husayn'],
  },
  {
    id: 'ziyarat_ale_yasin',
    titles: { en: 'Ziyarat Ale Yasin', ar: 'زيارة آل يasin', ur: 'زیارت آل یاسین' },
    category: 'masoomeen',
    tags: ['daily', 'ahlebayt'],
  },
  {
    id: 'ziyarat_jami_a',
    titles: { en: 'Ziyarat Jami\'a', ar: 'الزيارة الجامعة', ur: 'زیارت جامعہ' },
    category: 'masoomeen',
    tags: ['friday', 'ahlebayt'],
    occasion: 'friday',
  },
];
