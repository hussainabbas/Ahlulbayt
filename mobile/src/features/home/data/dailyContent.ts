import { getDailyHadithForHome } from '@/features/hadith/engine/dailyHadithService';

import type { DailyDua, DailyHadith, DailyVerse } from '../types';

export const DAILY_VERSES: DailyVerse[] = [
  {
    surah: 2,
    surahName: 'Al-Baqarah',
    ayah: 255,
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    translation:
      'Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence.',
    reference: '2:255',
  },
  {
    surah: 36,
    surahName: 'Ya-Sin',
    ayah: 58,
    arabic: 'سَلَامٌ قَوْلًا مِّن رَّبٍّ رَّحِيمٍ',
    translation: 'Peace — a word from a Merciful Lord.',
    reference: '36:58',
  },
  {
    surah: 13,
    surahName: "Ar-Ra'd",
    ayah: 28,
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    translation: 'Unquestionably, in the remembrance of Allah do hearts find rest.',
    reference: '13:28',
  },
  {
    surah: 3,
    surahName: 'Ali Imran',
    ayah: 173,
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    translation: 'Sufficient for us is Allah, and He is the best Disposer of affairs.',
    reference: '3:173',
  },
  {
    surah: 55,
    surahName: 'Ar-Rahman',
    ayah: 13,
    arabic: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ',
    translation: 'So which of the favors of your Lord would you deny?',
    reference: '55:13',
  },
  {
    surah: 24,
    surahName: 'An-Nur',
    ayah: 35,
    arabic: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ',
    translation: 'Allah is the Light of the heavens and the earth.',
    reference: '24:35',
  },
  {
    surah: 67,
    surahName: 'Al-Mulk',
    ayah: 2,
    arabic: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا',
    translation:
      'He who created death and life to test you as to which of you is best in deed.',
    reference: '67:2',
  },
];

export const DAILY_HADITHS: DailyHadith[] = [
  {
    text: 'I am the city of knowledge and Ali is its gate. Whoever desires knowledge, let him enter through its gate.',
    narrator: 'Prophet Muhammad (s)',
    source: 'Tirmidhi',
  },
  {
    text: 'The most complete of believers in faith are those with the best character.',
    narrator: 'Prophet Muhammad (s)',
    source: 'Tirmidhi',
  },
  {
    text: 'People are asleep; when they die, they awaken.',
    narrator: 'Imam Ali (as)',
    source: 'Nahj al-Balagha',
  },
  {
    text: 'The world is a prison for the believer and a paradise for the disbeliever.',
    narrator: 'Prophet Muhammad (s)',
    source: 'Muslim',
  },
  {
    text: 'Verily, Allah loves those who are mindful of Him in times of ease as they are in hardship.',
    narrator: 'Imam Ja\'far al-Sadiq (as)',
    source: 'Al-Kafi',
  },
  {
    text: 'The best jihad is a word of truth before a tyrannical ruler.',
    narrator: 'Prophet Muhammad (s)',
    source: 'Tirmidhi',
  },
  {
    text: 'He who knows himself knows his Lord.',
    narrator: 'Imam Ali (as)',
    source: 'Nahj al-Balagha',
  },
];

export const DAILY_DUAS: DailyDua[] = [
  {
    title: 'Dua al-Faraj',
    arabic: 'اللَّهُمَّ كُنْ لِوَلِيِّكَ الْحُجَّةِ بْنِ الْحَسَنِ',
    translation:
      'O Allah, be for Your representative, al-Hujjah ibn al-Hasan, a guardian and helper...',
    benefit: 'For the reappearance of Imam al-Mahdi (aj)',
  },
  {
    title: 'Morning Protection',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ',
    translation:
      'In the name of Allah, with whose name nothing on earth or in heaven can cause harm.',
    benefit: 'Protection through the day',
  },
  {
    title: 'Dua Kumayl (excerpt)',
    arabic: 'يَا مَنْ أَرْجُوهُ لِكُلِّ خَيْرٍ',
    translation: 'O He whom I hope for every good...',
    benefit: 'Thursday night devotion',
  },
  {
    title: 'Before Sleep',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    translation: 'In Your name, O Allah, I die and I live.',
    benefit: 'Night remembrance',
  },
  {
    title: 'Seeking Forgiveness',
    arabic: 'أَسْتَغْفِرُ اللَّهَ رَبِّي وَأَتُوبُ إِلَيْهِ',
    translation: 'I seek forgiveness from Allah, my Lord, and I repent to Him.',
    benefit: 'Daily istighfar',
  },
  {
    title: 'Dua al-Sabaḥ',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْيَوْمِ',
    translation: 'O Allah, I ask You for the good of this day...',
    benefit: 'Morning supplication',
  },
  {
    title: 'Ziyarat Ashura (excerpt)',
    arabic: 'السَّلَامُ عَلَيْكَ يَا أَبَا عَبْدِ اللَّهِ',
    translation: 'Peace be upon you, O Aba Abdillah...',
    benefit: 'Muharram remembrance',
  },
];

export function getDailyIndex(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86_400_000);
  return dayOfYear;
}

export function getTodaysVerse(date?: Date): DailyVerse {
  const idx = getDailyIndex(date) % DAILY_VERSES.length;
  return DAILY_VERSES[idx]!;
}

export function getTodaysHadith(date?: Date, locale = 'en'): DailyHadith {
  return getDailyHadithForHome(date, locale);
}

export function getTodaysDua(date?: Date): DailyDua {
  const idx = getDailyIndex(date) % DAILY_DUAS.length;
  return DAILY_DUAS[idx]!;
}
