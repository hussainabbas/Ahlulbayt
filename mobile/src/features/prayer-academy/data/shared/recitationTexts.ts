import { BUNDLED_SURAHS } from '@/features/quran/data/bundled/surah001';

/** Join bundled ayah Arabic for a surah, or fall back to inline text. */
function joinSurahAyahs(surahNumber: number): string {
  const bundled = BUNDLED_SURAHS[surahNumber];
  if (bundled) {
    return bundled.ayahs.map((ayah) => ayah.arabic).join('\n');
  }
  return INLINE_SURAHS[surahNumber]?.join('\n') ?? '';
}

const INLINE_SURAHS: Record<number, readonly string[]> = {
  97: [
    'إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ',
    'وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ',
    'لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ',
    'تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ',
    'سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ',
  ],
  112: [
    'قُلْ هُوَ اللَّهُ أَحَدٌ',
    'اللَّهُ الصَّمَدُ',
    'لَمْ يَلِدْ وَلَمْ يُولَدْ',
    'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
  ],
  113: [
    'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
    'مِن شَرِّ مَا خَلَقَ',
    'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
    'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
    'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
  ],
  114: [
    'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
    'مَلِكِ النَّاسِ',
    'إِلَٰهِ النَّاسِ',
    'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
    'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
    'مِنَ الْجِنَّةِ وَالنَّاسِ',
  ],
};

export const SURAH_AL_FATIHA_ARABIC = joinSurahAyahs(1);
export const SURAH_AL_IKHLAS_ARABIC = joinSurahAyahs(112);
export const SURAH_AL_QADR_ARABIC = joinSurahAyahs(97);
export const SURAH_AL_FALAQ_ARABIC = joinSurahAyahs(113);
export const SURAH_AN_NAS_ARABIC = joinSurahAyahs(114);

export const AYAT_AL_KURSI_ARABIC =
  'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ';

/** Al-Hamd + a second surah — default qira'at in 1st and 2nd rakats. */
export const HAMD_AND_IKHLAS_ARABIC = [SURAH_AL_FATIHA_ARABIC, SURAH_AL_IKHLAS_ARABIC].join('\n\n');

/** Namaz-e-Wahshat — 1st rakat after al-Hamd. */
export const WAHSHAT_R1_RECITATION_ARABIC = [SURAH_AL_FATIHA_ARABIC, AYAT_AL_KURSI_ARABIC].join('\n\n');

/** Namaz-e-Wahshat — 2nd rakat: al-Qadr 3×, al-Falaq, an-Nas. */
export const WAHSHAT_R2_RECITATION_ARABIC = [
  SURAH_AL_FATIHA_ARABIC,
  SURAH_AL_QADR_ARABIC,
  SURAH_AL_QADR_ARABIC,
  SURAH_AL_QADR_ARABIC,
  SURAH_AL_FALAQ_ARABIC,
  SURAH_AN_NAS_ARABIC,
].join('\n\n');
