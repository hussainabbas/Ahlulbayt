export interface DuaCatalogEntry {
  id: string;
  titles: { en: string; ar: string; ur: string };
  category: string;
  tags: string[];
  recommendedDays?: string[];
}

export const DUAS_CATALOG: DuaCatalogEntry[] = [
  {
    id: 'dua_kumail',
    titles: { en: 'Dua Kumayl', ar: 'دعاء كميل', ur: 'دعائے کمیل' },
    category: 'weekly',
    tags: ['thursday', 'forgiveness', 'night'],
    recommendedDays: ['thursday'],
  },
  {
    id: 'dua_tawassul',
    titles: { en: 'Dua Tawassul', ar: 'دعاء التوسل', ur: 'دعائے توسل' },
    category: 'masoomeen',
    tags: ['intercession', 'ahlebayt'],
    recommendedDays: ['wednesday'],
  },
  {
    id: 'dua_sabah',
    titles: { en: 'Dua al-Sabah', ar: 'دعاء الصباح', ur: 'دعائے صبح' },
    category: 'daily',
    tags: ['morning'],
    recommendedDays: ['daily'],
  },
  {
    id: 'dua_ahad',
    titles: { en: 'Dua Ahad', ar: 'دعاء الاحد', ur: 'دعائے احد' },
    category: 'masoomeen',
    tags: ['imam_mahdi', 'friday'],
    recommendedDays: ['friday'],
  },
  {
    id: 'dua_mashlool',
    titles: { en: 'Dua Mashlool', ar: 'دعاء المشلول', ur: 'دعائے مشلول' },
    category: 'healing',
    tags: ['healing', 'muharram'],
  },
  {
    id: 'dua_nudba',
    titles: { en: 'Dua Nudba', ar: 'دعاء الندبة', ur: 'دعائے ندبہ' },
    category: 'masoomeen',
    tags: ['friday', 'imam_mahdi'],
    recommendedDays: ['friday'],
  },
];
