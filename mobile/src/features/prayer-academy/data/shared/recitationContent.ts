import type { LocalizedText } from '../../types';
import type { PrayerGuideStep } from '../../types';
import { L } from './contentHelpers';

/** Bundled recitation with Arabic + trilingual transliteration/translation. */
export interface PrayerRecitation {
  arabic: string;
  transliteration: LocalizedText;
  translation: LocalizedText;
}

const INLINE_FATIHA_ARABIC = [
  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
  'الرَّحْمَٰنِ الرَّحِيمِ',
  'مَالِكِ يَوْمِ الدِّينِ',
  'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
  'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
  'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
].join('\n');

const INLINE_QADR_ARABIC = [
  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  'إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ',
  'وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ',
  'لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ',
  'تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ',
  'سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ',
].join('\n');

export const FATIHA: PrayerRecitation = {
  arabic: INLINE_FATIHA_ARABIC,
  transliteration: L(
    'Bismillahir rahmanir rahim. Al hamdu lil lahi rabbil \'alamin. Arrahmanir rahim. Maliki yawmiddin. Iyyaka na\'budu wa iyyaka nasta\'in. Ihdinas siratal mustaqim. Siratal ladhina an\'amta\'alaihim, ghairil maghdubi\'alaihim wa lad dhallin.',
    'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ، الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ، الرَّحْمَٰنِ الرَّحِيمِ، مَالِكِ يَوْمِ الدِّينِ، إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ، اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ، صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    'بسم الله الرحمن الرحيم...',
  ),
  translation: L(
    'In the name of Allah, the most Gracious, the most Merciful. All praise is for Allah, the Lord of the worlds. The most Beneficent, the most Merciful; Master of the Day of Judgment. You alone we worship, from You alone we seek help. Guide us on the straight path — the path of those upon whom You have favoured, not of those who earned Your anger or went astray.',
    'اللہ کے نام سے شروع جو نہایت مہربان بے حد رحم والا ہے۔ سب تعریفیں اللہ ہی کے لیے ہیں جو سارے جہانوں کا پروردگار ہے۔ نہایت مہربان بے حد رحم والا۔ روز جزا کا مالک۔ ہم تیری ہی عبادت کرتے ہیں اور تجھ سے مدد مانگتے ہیں۔ ہمیں سیدھا راستہ دکھا — ان لوگوں کا راستہ جن پر تو نے انعام فرمایا، نہ ان کا جن پر غضب ہوا اور نہ گمراہوں کا۔',
    'بسم الله الرحمن الرحيم. الحمد لله رب العالمين...',
  ),
};

export const QADR: PrayerRecitation = {
  arabic: INLINE_QADR_ARABIC,
  transliteration: L(
    'Bismillahir rahmanir rahim. Innaa anzalnaahu fi laylatil qadr. Wa maa adraaka maa laylatul qadr. Laylatul qadri khayrun min alfi shahr. Tanazzalul malaaikatu war ruuhu fiyhaa bi idhni rabbihim min kulli amr. Salaamun hiya hattaa matla\'il fajr.',
    'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ، إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ...',
    'بسم الله... إنا أنزلناه في ليلة القدر...',
  ),
  translation: L(
    'In the name of Allah, the most Gracious, the most Merciful. Surely We revealed it on the night of power. And what will make you comprehend what the night of power is? The night of power is better than a thousand months. The angels and spirit descend in it by the permission of their Lord for every affair. Peace! It is till the break of dawn.',
    'اللہ کے نام سے۔ بے شک ہم نے اس (قرآن) کو شب قدر میں نازل کیا۔ اور تم کیا جانتے ہو شب قدر کیا ہے؟ شب قدر ہزار مہینوں سے بہتر ہے۔ فرشتے اور روح اس میں اپنے رب کے حکم سے ہر معاملے کے لیے اترتے ہیں۔ یہ (رات) سلامتی کی ہے فجر طلوع ہونے تک۔',
    'بسم الله الرحمن الرحيم. إنا أنزلناه في ليلة القدر...',
  ),
};

export const QUNOOT: PrayerRecitation = {
  arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
  transliteration: L(
    'Rabbanaa aatinaa fi\'d-dunyaa hasanatan wa fi\'l-aakhirati hasanatan wa qinaa \'adhaab an-naar',
    'اے ہمارے رب! ہمیں دنیا میں بھی bhalaai دے اور آخرت میں بھی bhalaai دے، اور ہمیں آگ کے عذاب سے بچا۔',
    'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار',
  ),
  translation: L(
    'O our Lord! Bestow upon us good in this world and good in the Hereafter, and protect us from the torment of the fire. (Qur\'an 2:201)',
    'اے ہمارے رب! ہمیں دنیا میں بھی نیکی عطا فرما اور آخرت میں بھی نیکی عطا فرما، اور ہمیں آگ کے عذاب سے محفوظ رکھ۔ (قرآن 2:201)',
    'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار',
  ),
};

export const TASHAHHUD: PrayerRecitation = {
  arabic:
    'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ',
  transliteration: L(
    'Ash hadu an laa ilaaha illallaahu wahdahu laa shareeka lah, wa ash hadu anna Muhammadan \'abduhu wa rasuluh, Allaahumma salli \'alaa Muhammadin wa Aali Muhammad',
    'میں گواہی دیتا/دیتی ہوں کہ اللہ کے سوا کوئی معبود نہیں، وہ اکela ہے، اس کا کوئی شریک نہیں، اور میں گواہی دیتا/دیتی ہوں کہ محمدؐ اس کے بندے اور رسول ہیں، خداوند محمدؐ اور آل محمدؐ پر رحمت فرما۔',
    'أشهد أن لا إله إلا الله وحده لا شريك له...',
  ),
  translation: L(
    'I bear witness that there is no god apart from Allah, Who is unique and without partners. I also bear witness that Muhammad is His servant and His Prophet. O God, bless Muhammad and the progeny of Muhammad.',
    'میں گواہی دیتا/دیتی ہوں کہ اللہ کے سوا کوئی معبود نہیں، وہ یکتا ہے، اس کا کوئی شریک نہیں، اور میں گواہی دیتا/دیتی ہوں کہ محمدؐ اس کے بندے اور رسول ہیں۔ اے اللہ! محمدؐ اور آل محمدؐ پر درود بھیج۔',
    'أشهد أن لا إله إلا الله...',
  ),
};

export const TASLIM: PrayerRecitation = {
  arabic:
    'السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ، السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ',
  transliteration: L(
    'Assalaamu \'alayka ayyuhan nabiyyu wa rahmatullaahi wa barakaatuh. Assalamu \'alaynaa wa \'alaa \'ibaadillaahis saaliheen. Assalamu \'alaykum wa rahmatullaahi wa barakaatuh',
    'سلام ہو آپ پر اے نبیؐ! اور اللہ کی رحمت و برکتیں۔ سلام ہو ہم پر اور اللہ کے نیک بندوں پر۔ سلام ہو تم سب پر اور اللہ کی رحمت و برکتیں۔',
    'السلام عليك أيها النبي...',
  ),
  translation: L(
    'Peace be upon you, O Prophet, and God\'s mercy and blessing. Peace be upon us, and upon the righteous servants of God. Peace be upon you [all], and God\'s mercy and blessing.',
    'سلام ہو آپ پر اے نبیؐ! اور اللہ کی رحمت و برکات۔ سلام ہو ہم پر اور اللہ کے صالح بندوں پر۔ سلام ہو تم سب پر اور اللہ کی رحمت و برکات۔',
    'السلام عليك أيها النبي...',
  ),
};

export const TASBIHAT: PrayerRecitation = {
  arabic: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ',
  transliteration: L(
    'Subhaanallaahi wa\'l hamdu lillaahi wa laa ilaaha illallaahu wallaahu akbar',
    'پاک ہے اللہ، اور سب تعریف اللہ کے لیے ہے، اور اللہ کے سوا کوئی معبود نہیں، اور اللہ سب سے بڑا ہے۔',
    'سبحان الله والحمد لله...',
  ),
  translation: L(
    'Glory be to God, and praise be to God; there is no god but Allah, and Allah is Greater. (Recite three times.)',
    'اللہ پاک ہے، اور تمام تعریف اللہ کے لیے ہے، اللہ کے سوا کوئی معبود نہیں، اور اللہ سب سے بڑا ہے۔ (تین بار پڑھیں۔)',
    'سبحان الله والحمد لله...',
  ),
};

export const RUKU_DHIKR: PrayerRecitation = {
  arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ',
  transliteration: L(
    'Subhaana rabbiyal \'azeemi wa bihamdih',
    'پاک ہے میرا رب جو بہت عظیم ہے، اور اسی کی تعریف کے ساتھ۔',
    'سبحان ربي العظيم وبحمده',
  ),
  translation: L(
    'Glory be to my Lord, the Great, and praise belongs to Him.',
    'پاک ہے میرا رب جو بہت عظیم ہے، اور اسی کی حمد کے ساتھ۔',
    'سبحان ربي العظيم وبحمده',
  ),
};

export const SUJUD_DHIKR: PrayerRecitation = {
  arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَىٰ وَبِحَمْدِهِ',
  transliteration: L(
    'Subhaana rabbiyal a\'laa wa bihamdih',
    'پاک ہے میرا رب جو بلند و برتر ہے، اور اسی کی تعریف کے ساتھ۔',
    'سبحان ربي الأعلى وبحمده',
  ),
  translation: L(
    'Glory be to my Exalted Lord, and praise belongs to Him.',
    'پاک ہے میرا رب جو سب سے بلند ہے، اور اسی کی حمد کے ساتھ۔',
    'سبحان ربي الأعلى وبحمده',
  ),
};

export const TAKBIR: PrayerRecitation = {
  arabic: 'ٱللَّٰهُ أَكْبَرُ',
  transliteration: L('Allahu Akbar', 'اللہ سب سے بڑا ہے', 'الله أكبر'),
  translation: L('Allah is the Greatest.', 'اللہ سب سے بڑا ہے۔', 'الله أكبر'),
};

export const SAMI_ALLAH: PrayerRecitation = {
  arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ',
  transliteration: L('Sami\'allahu liman hamidah', 'اللہ نے سنا اس ki حمد کرنے والے کو', 'سمع الله لمن حمده'),
  translation: L(
    'Allah hears those who praise Him.',
    'اللہ نے سنا اس ki حمد کرنے والے کو۔',
    'سمع الله لمن حمده',
  ),
};

export const ASTAGHFIR: PrayerRecitation = {
  arabic: 'أَسْتَغْفِرُ اللَّهَ رَبِّي وَأَتُوبُ إِلَيْهِ',
  transliteration: L(
    'Astaghfirullaaha rabbee wa atoobu ilayh',
    'میں اللہ سے معافی مانگتا/مانگتی ہوں، میرا رب، اور اس ki طرف رجوع کرتا/کرتی ہوں۔',
    'أستغفر الله ربي وأتوب إليه',
  ),
  translation: L(
    'I ask forgiveness of God, my Lord, and turn towards Him.',
    'میں اپنے رب اللہ سے بخشش مانگتا/مانگتی ہوں اور اس ki طرف رجوع کرتا/کرتی ہوں۔',
    'أستغفر الله ربي وأتوب إليه',
  ),
};

export const STAND_DUA: PrayerRecitation = {
  arabic: 'بِحَوْلِ اللَّهِ وَقُوَّتِهِ أَقُومُ وَأَقْعُدُ',
  transliteration: L(
    'Bihawlillaahi wa quwwatihi aqoomu wa aq\'ud',
    'اللہ ki مدد اور اس ki quwwat se میں کھڑا/بیٹhta ہوں۔',
    'بحول الله وقوته أقوم وأقعد',
  ),
  translation: L(
    'With God\'s help and through His power I stand and sit.',
    'اللہ ki مدد اور اس ki taqat se میں کھڑا اور بیٹhta ہوں۔',
    'بحول الله وقوته أقوم وأقعد',
  ),
};

/** Apply recitation fields onto a step. */
export function withRecitation(step: PrayerGuideStep, recitation: PrayerRecitation): PrayerGuideStep {
  return {
    ...step,
    arabic: recitation.arabic,
    transliteration: recitation.transliteration,
    translation: recitation.translation,
  };
}

export const SURAH_AL_FATIHA_ARABIC = FATIHA.arabic;
export const SURAH_AL_QADR_ARABIC = QADR.arabic;
