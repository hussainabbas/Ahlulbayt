export interface SurahMeta {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  nameTransliteration: string;
  revelation: 'meccan' | 'medinan';
  ayahCount: number;
  juzStart?: number;
}

export const QURAN_SURAHS: SurahMeta[] = [
  { number: 1, nameArabic: 'الفاتحة', nameEnglish: 'Al-Fatiha', nameTransliteration: 'Al-Fatiha', revelation: 'meccan', ayahCount: 7, juzStart: 1 },
  { number: 2, nameArabic: 'البقرة', nameEnglish: 'Al-Baqarah', nameTransliteration: 'Al-Baqarah', revelation: 'medinan', ayahCount: 286, juzStart: 1 },
  { number: 3, nameArabic: 'آل عمران', nameEnglish: 'Ali Imran', nameTransliteration: 'Ali Imran', revelation: 'medinan', ayahCount: 200, juzStart: 3 },
  { number: 4, nameArabic: 'النساء', nameEnglish: 'An-Nisa', nameTransliteration: 'An-Nisa', revelation: 'medinan', ayahCount: 176, juzStart: 4 },
  { number: 5, nameArabic: 'المائدة', nameEnglish: 'Al-Maidah', nameTransliteration: 'Al-Maidah', revelation: 'medinan', ayahCount: 120, juzStart: 6 },
  { number: 30, nameArabic: 'الروم', nameEnglish: 'Ar-Rum', nameTransliteration: 'Ar-Rum', revelation: 'meccan', ayahCount: 60, juzStart: 21 },
  { number: 36, nameArabic: 'يس', nameEnglish: 'Ya-Sin', nameTransliteration: 'Ya-Sin', revelation: 'meccan', ayahCount: 83, juzStart: 22 },
  { number: 55, nameArabic: 'الرحمن', nameEnglish: 'Ar-Rahman', nameTransliteration: 'Ar-Rahman', revelation: 'medinan', ayahCount: 78, juzStart: 27 },
  { number: 67, nameArabic: 'الملك', nameEnglish: 'Al-Mulk', nameTransliteration: 'Al-Mulk', revelation: 'meccan', ayahCount: 30, juzStart: 29 },
  { number: 112, nameArabic: 'الإخلاص', nameEnglish: 'Al-Ikhlas', nameTransliteration: 'Al-Ikhlas', revelation: 'meccan', ayahCount: 4, juzStart: 30 },
  { number: 113, nameArabic: 'الفلق', nameEnglish: 'Al-Falaq', nameTransliteration: 'Al-Falaq', revelation: 'meccan', ayahCount: 5, juzStart: 30 },
  { number: 114, nameArabic: 'الناس', nameEnglish: 'An-Nas', nameTransliteration: 'An-Nas', revelation: 'meccan', ayahCount: 6, juzStart: 30 },
];
