import type { SurahBundle } from '../../types';
import { SURAH_METADATA } from '../../constants/surahMetadata';

/** Fully featured bundled surah — word-by-word, tajweed, tafsir, audio timestamps. */
export const SURAH_001: SurahBundle = {
  surah: 1,
  meta: SURAH_METADATA[0]!,
  bundleVersion: 1,
  audioDurationMs: 95000,
  ayahs: [
    {
      surah: 1, ayah: 1, juz: 1, page: 1,
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      words: [
        { index: 0, arabic: 'بِسْمِ', transliteration: 'bis-mi', translation: { en: 'In (the) name', ur: 'نام سے', roman_ur: 'Naam se' }, tajweed: 'default', audioStartMs: 0, audioEndMs: 800 },
        { index: 1, arabic: 'اللَّهِ', transliteration: 'Allāh', translation: { en: 'of Allah', ur: 'اللہ کے', roman_ur: 'Allah ke' }, tajweed: 'default', audioStartMs: 800, audioEndMs: 1600 },
        { index: 2, arabic: 'الرَّحْمَٰنِ', transliteration: 'ar-Raḥmān', translation: { en: 'the Most Gracious', ur: 'بہت مہربان', roman_ur: 'Bohat meharban' }, tajweed: 'madda_normal', audioStartMs: 1600, audioEndMs: 2800 },
        { index: 3, arabic: 'الرَّحِيمِ', transliteration: 'ar-Raḥīm', translation: { en: 'the Most Merciful', ur: 'نہایت رحم والے', roman_ur: 'Nihayat reham wale' }, tajweed: 'madda_normal', audioStartMs: 2800, audioEndMs: 4000 },
      ],
      translations: {
        en: 'In the name of Allah, the Most Gracious, the Most Merciful.',
        ur: 'اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔',
        roman_ur: 'Allah ke naam se jo bada meharban nihayat reham wala hai.',
      },
      tafsir: {
        en: 'Bismillah opens every surah except At-Tawbah. It invokes Allah\'s mercy before any action — the hallmark of worship in Islam.',
        ur: 'بسم اللہ ہر سورت کے آغاز میں ہے (سورت توبہ کے سوا)۔',
        source: 'Al-Mizan (summary)',
      },
    },
    {
      surah: 1, ayah: 2, juz: 1, page: 1,
      arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      words: [
        { index: 0, arabic: 'الْحَمْدُ', transliteration: 'al-ḥamdu', translation: { en: 'All praise', ur: 'تمام تعریف', roman_ur: 'Tamam tareef' }, tajweed: 'default' },
        { index: 1, arabic: 'لِلَّهِ', transliteration: 'lillāh', translation: { en: 'is for Allah', ur: 'اللہ کے لیے', roman_ur: 'Allah ke liye' }, tajweed: 'default' },
        { index: 2, arabic: 'رَبِّ', transliteration: 'rabb', translation: { en: 'Lord', ur: 'رب', roman_ur: 'Rub' }, tajweed: 'qalaqah' },
        { index: 3, arabic: 'الْعَالَمِينَ', transliteration: 'al-ʿālamīn', translation: { en: 'of the worlds', ur: 'تمام جہانوں کا', roman_ur: 'Tamam jahanon ka' }, tajweed: 'madda_normal' },
      ],
      translations: {
        en: 'All praise is due to Allah, Lord of the worlds.',
        ur: 'سب تعریف اللہ ہی کے لیے ہے جو تمام جہانوں کا پروردگار ہے۔',
        roman_ur: 'Sab tareef Allah hi ke liye hai jo tamam jahanon ka parwardigar hai.',
      },
      tafsir: {
        en: 'Al-Hamd encompasses all forms of praise — Allah alone is worthy of absolute praise as Creator and Sustainer of all existence.',
        source: 'Tafsir al-Mizan',
      },
    },
    {
      surah: 1, ayah: 3, juz: 1, page: 1,
      arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
      words: [
        { index: 0, arabic: 'الرَّحْمَٰنِ', transliteration: 'ar-Raḥmān', translation: { en: 'the Most Gracious', ur: 'بہت مہربان', roman_ur: 'Bohat meharban' }, tajweed: 'madda_normal' },
        { index: 1, arabic: 'الرَّحِيمِ', transliteration: 'ar-Raḥīm', translation: { en: 'the Most Merciful', ur: 'نہایت رحم والے', roman_ur: 'Nihayat reham wale' }, tajweed: 'madda_normal' },
      ],
      translations: {
        en: 'The Most Gracious, the Most Merciful.',
        ur: 'بڑا مہربان نہایت رحم والا۔',
        roman_ur: 'Bada meharban nihayat reham wala.',
      },
    },
    {
      surah: 1, ayah: 4, juz: 1, page: 1,
      arabic: 'مَالِكِ يَوْمِ الدِّينِ',
      words: [
        { index: 0, arabic: 'مَالِكِ', transliteration: 'māliki', translation: { en: 'Master', ur: 'مالک', roman_ur: 'Malik' }, tajweed: 'default' },
        { index: 1, arabic: 'يَوْمِ', transliteration: 'yawmi', translation: { en: 'of (the) Day', ur: 'دن', roman_ur: 'Din' }, tajweed: 'default' },
        { index: 2, arabic: 'الدِّينِ', transliteration: 'ad-dīn', translation: { en: 'of Judgment', ur: 'جزا', roman_ur: 'Jaza' }, tajweed: 'default' },
      ],
      translations: {
        en: 'Master of the Day of Judgment.',
        ur: 'جزا کے دن کا مالک۔',
        roman_ur: 'Jaza ke din ka malik.',
      },
    },
    {
      surah: 1, ayah: 5, juz: 1, page: 1,
      arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
      words: [
        { index: 0, arabic: 'إِيَّاكَ', transliteration: 'iyyāka', translation: { en: 'You alone', ur: 'صرف تجھ', roman_ur: 'Sirf tujhe' }, tajweed: 'default' },
        { index: 1, arabic: 'نَعْبُدُ', transliteration: 'naʿbudu', translation: { en: 'we worship', ur: 'ہم عبادت کرتے ہیں', roman_ur: 'Hum ibadat karte hain' }, tajweed: 'default' },
        { index: 2, arabic: 'وَإِيَّاكَ', transliteration: 'wa iyyāka', translation: { en: 'and You alone', ur: 'اور صرف تجھ', roman_ur: 'Aur sirf tujhe' }, tajweed: 'default' },
        { index: 3, arabic: 'نَسْتَعِينُ', transliteration: 'nastaʿīn', translation: { en: 'we ask for help', ur: 'مدد چاہتے ہیں', roman_ur: 'Madad chahte hain' }, tajweed: 'madda_normal' },
      ],
      translations: {
        en: 'You alone we worship, and You alone we ask for help.',
        ur: 'ہم صرف تیری ہی عبادت کرتے ہیں اور صرف تجھ سے مدد چاہتے ہیں۔',
        roman_ur: 'Hum sirf teri hi ibadat karte hain aur sirf tujh se madad chahte hain.',
      },
      tafsir: {
        en: 'The essence of Tawhid — exclusive worship and reliance upon Allah alone, rejecting all forms of shirk.',
        source: 'Tafsir al-Qummi (summary)',
      },
    },
    {
      surah: 1, ayah: 6, juz: 1, page: 1,
      arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
      words: [
        { index: 0, arabic: 'اهْدِنَا', transliteration: 'ihdinā', translation: { en: 'Guide us', ur: 'ہمیں ہدایت دے', roman_ur: 'Hamein hidayat de' }, tajweed: 'default' },
        { index: 1, arabic: 'الصِّرَاطَ', transliteration: 'aṣ-ṣirāṭ', translation: { en: 'the path', ur: 'راستہ', roman_ur: 'Raasta' }, tajweed: 'default' },
        { index: 2, arabic: 'الْمُسْتَقِيمَ', transliteration: 'al-mustaqīm', translation: { en: 'the straight', ur: 'سیدھا', roman_ur: 'Seedha' }, tajweed: 'madda_normal' },
      ],
      translations: {
        en: 'Guide us to the straight path.',
        ur: 'ہمیں سیدھے راستے کی ہدایت فرما۔',
        roman_ur: 'Hamein seedhe raaste ki hidayat farma.',
      },
    },
    {
      surah: 1, ayah: 7, juz: 1, page: 2,
      arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
      words: [
        { index: 0, arabic: 'صِرَاطَ', transliteration: 'ṣirāṭa', translation: { en: 'The path', ur: 'راستہ', roman_ur: 'Raasta' }, tajweed: 'default' },
        { index: 1, arabic: 'الَّذِينَ', transliteration: 'alladhīna', translation: { en: 'of those', ur: 'ان لوگوں کا', roman_ur: 'Un logon ka' }, tajweed: 'default' },
        { index: 2, arabic: 'أَنْعَمْتَ', transliteration: 'anʿamta', translation: { en: 'You have favored', ur: 'تو نے انعام کیا', roman_ur: 'Tu ne inaam kiya' }, tajweed: 'default' },
        { index: 3, arabic: 'عَلَيْهِمْ', transliteration: 'ʿalayhim', translation: { en: 'upon them', ur: 'ان پر', roman_ur: 'Un par' }, tajweed: 'default' },
        { index: 4, arabic: 'غَيْرِ', transliteration: 'ghayri', translation: { en: 'not', ur: 'نه', roman_ur: 'Na' }, tajweed: 'default' },
        { index: 5, arabic: 'الْمَغْضُوبِ', transliteration: 'al-maghḍūb', translation: { en: 'those who earned wrath', ur: 'جن پر غضب', roman_ur: 'Jin par ghazab' }, tajweed: 'default' },
        { index: 6, arabic: 'وَلَا', transliteration: 'wa lā', translation: { en: 'and not', ur: 'اور نہ', roman_ur: 'Aur na' }, tajweed: 'default' },
        { index: 7, arabic: 'الضَّالِّينَ', transliteration: 'aḍ-ḍāllīn', translation: { en: 'those who go astray', ur: 'گمراہ', roman_ur: 'Gumrah' }, tajweed: 'default' },
      ],
      translations: {
        en: 'The path of those upon whom You have bestowed favor, not of those who have earned wrath nor of those who go astray.',
        ur: 'ان لوگوں کا راستہ جن پر تو نے انعام فرمایا، نہ ان کا جن پر غضب ہوا اور نہ گمراہوں کا۔',
        roman_ur: 'Un logon ka raasta jin par tu ne inaam farmaya, na un ka jin par ghazab hua aur na gumrahon ka.',
      },
      tafsir: {
        en: 'The straight path is that of the prophets, truthful ones, martyrs, and righteous — not the Jews (wrath) nor misguided sects.',
        source: 'Al-Mizan · hadith of Imam Ali (as)',
      },
    },
  ],
};

/** Ayat al-Kursi — bundled for search & reader demo. */
export const AYAH_2_255: import('../../types').QuranAyah = {
  surah: 2, ayah: 255, juz: 3, page: 42,
  arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
  words: [
    { index: 0, arabic: 'اللَّهُ', translation: { en: 'Allah', ur: 'اللہ', roman_ur: 'Allah' }, tajweed: 'default' },
    { index: 1, arabic: 'لَا', translation: { en: 'no', ur: 'نہ', roman_ur: 'Nah' }, tajweed: 'default' },
    { index: 2, arabic: 'إِلَٰهَ', translation: { en: 'deity', ur: 'معبود', roman_ur: 'Ma\'bood' }, tajweed: 'default' },
    { index: 3, arabic: 'إِلَّا', translation: { en: 'except', ur: 'سوائے', roman_ur: 'Siwaaye' }, tajweed: 'default' },
    { index: 4, arabic: 'هُوَ', translation: { en: 'Him', ur: 'وہ', roman_ur: 'Woh' }, tajweed: 'default' },
    { index: 5, arabic: 'الْحَيُّ', translation: { en: 'the Ever-Living', ur: 'زندہ', roman_ur: 'Zinda' }, tajweed: 'default' },
    { index: 6, arabic: 'الْقَيُّومُ', translation: { en: 'the Sustainer', ur: 'قائم', roman_ur: 'Qayyam' }, tajweed: 'madda_normal' },
  ],
  translations: {
    en: 'Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence.',
    ur: 'اللہ، اس کے سوا کوئی معبود نہیں، وہ زندہ ہے، سب کا تھامنے والا ہے۔',
    roman_ur: 'Allah, us ke siwa koi ma\'bood nahin, woh zinda hai, sab ka thaamne wala hai.',
  },
  tafsir: {
    en: 'Ayat al-Kursi is the greatest verse of the Quran. Imam Ali (as) said it describes Allah\'s attributes of life and self-subsistence.',
    source: 'Bihar al-Anwar',
  },
};

export const BUNDLED_SURAHS: Record<number, SurahBundle> = {
  1: SURAH_001,
};

export const BUNDLED_STANDALONE_AYAHS = [AYAH_2_255];
