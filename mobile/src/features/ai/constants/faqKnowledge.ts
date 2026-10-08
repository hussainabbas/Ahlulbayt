export interface FaqEntry {
  id: string;
  keywords: string[];
  titleKey: string;
  bodyKey: string;
  citationKey?: string;
}

export const FAQ_KNOWLEDGE: FaqEntry[] = [
  {
    id: 'who_ahlulbayt',
    keywords: ['ahlul bayt', 'ahlulbayt', 'who are', 'family of prophet', 'اهل البیت'],
    titleKey: 'ai.faq.who_ahlulbayt.title',
    bodyKey: 'ai.faq.who_ahlulbayt.body',
    citationKey: 'ai.faq.who_ahlulbayt.citation',
  },
  {
    id: 'twelve_imams',
    keywords: ['twelve imam', '12 imam', 'imams', 'successor', 'ائمہ', 'الائمة'],
    titleKey: 'ai.faq.twelve_imams.title',
    bodyKey: 'ai.faq.twelve_imams.body',
    citationKey: 'ai.faq.twelve_imams.citation',
  },
  {
    id: 'karbala',
    keywords: ['karbala', 'ashura', 'husayn', 'husain', 'imam husayn', 'کربلا', 'حسین'],
    titleKey: 'ai.faq.karbala.title',
    bodyKey: 'ai.faq.karbala.body',
    citationKey: 'ai.faq.karbala.citation',
  },
  {
    id: 'ghadeer',
    keywords: ['ghadeer', 'ghadir', 'wilayah', 'succession', 'غدیر'],
    titleKey: 'ai.faq.ghadeer.title',
    bodyKey: 'ai.faq.ghadeer.body',
    citationKey: 'ai.faq.ghadeer.citation',
  },
  {
    id: 'fatwa_disclaimer',
    keywords: ['fatwa', 'haram', 'halal', 'wajib', 'mustahab', 'ruling', 'marja say'],
    titleKey: 'ai.faq.fatwa.title',
    bodyKey: 'ai.faq.fatwa.body',
  },
  {
    id: 'tawassul',
    keywords: ['tawassul', 'intercession', 'waseela', 'توسل'],
    titleKey: 'ai.faq.tawassul.title',
    bodyKey: 'ai.faq.tawassul.body',
    citationKey: 'ai.faq.tawassul.citation',
  },
  {
    id: 'mahdi',
    keywords: ['mahdi', 'imam mahdi', 'occultation', 'منتظر', 'مهدی'],
    titleKey: 'ai.faq.mahdi.title',
    bodyKey: 'ai.faq.mahdi.body',
    citationKey: 'ai.faq.mahdi.citation',
  },
  {
    id: 'sahifa',
    keywords: ['sahifa', 'sajjadiya', 'sajjad', 'صحیفہ', 'الصحيفة'],
    titleKey: 'ai.faq.sahifa.title',
    bodyKey: 'ai.faq.sahifa.body',
    citationKey: 'ai.faq.sahifa.citation',
  },
];
