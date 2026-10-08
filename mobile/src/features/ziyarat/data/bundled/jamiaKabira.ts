import type { ZiyaratBundle } from '../../types';
import { ZIYARAT_CATALOG } from '../../constants/catalog';

const meta = ZIYARAT_CATALOG.find((z) => z.id === 'ziyarat_jamia_kabira')!;

export const ZIYARAT_JAMIA_KABIRA: ZiyaratBundle = {
  meta,
  bundleVersion: 1,
  sections: [
    {
      id: 'opening',
      title: { en: 'Opening', ur: 'آغاز' },
      arabic:
        'السَّلَامُ عَلَيْكَ يَا رَسُولَ اللّٰهِ\n' +
        'السَّلَامُ عَلَيْكَ يَا أَمِيرَ الْمُؤْمِنِينَ\n' +
        'السَّلَامُ عَلَيْكِ يَا فَاطِمَةَ الزَّهْرَاءَ',
      translations: {
        en: 'Peace be upon you, O Messenger of Allah. Peace be upon you, O Commander of the Faithful. Peace be upon you, O Fatimah al-Zahra.',
        ur: 'سلام ہو آپ پر اے رسول اللہ! سلام ہو آپ پر اے امیرالمؤمنینؑ! سلام ہو آپ پر اے فاطمہ زہراءؑ!',
      },
      sacred: true,
    },
    {
      id: 'imams_hasan_husayn',
      title: { en: 'Hasan & Husayn (AS)', ur: 'حسنؑ و حسینؑ' },
      arabic:
        'السَّلَامُ عَلَيْكَ يَا أَبَا مُحَمَّدٍ الْحَسَنَ بْنَ عَلِيٍّ\n' +
        'السَّلَامُ عَلَيْكَ يَا أَبَا عَبْدِ اللّٰهِ الْحُسَيْنَ بْنَ عَلِيٍّ\n' +
        'السَّلَامُ عَلَيْكُمَا يَا بَنَيْ رَسُولِ اللّٰهِ',
      translations: {
        en: 'Peace be upon you, O Aba Muhammad, Hasan son of Ali. Peace be upon you, O Aba Abdillah, Husayn son of Ali. Peace be upon you both, O sons of the Messenger of Allah.',
        ur: 'سلام ہو آپ پر اے ابا محمد حسن بن علیؑ! سلام ہو آپ پر اے ابا عبداللہ حسین بن علیؑ!',
      },
      sacred: true,
    },
    {
      id: 'imams_mediator',
      title: { en: 'Imams of the Mediators', ur: 'ائمہؑ وسطی' },
      arabic:
        'السَّلَامُ عَلَيْكَ يَا أَبَا جَعْفَرٍ مُحَمَّدَ بْنَ عَلِيٍّ\n' +
        'السَّلَامُ عَلَيْكَ يَا أَبَا عَبْدِ اللّٰهِ جَعْفَرَ بْنَ مُحَمَّدٍ\n' +
        'السَّلَامُ عَلَيْكَ يَا أَبَا الْحَسَنِ مُوسَىٰ بْنَ جَعْفَرٍ',
      translations: {
        en: 'Peace be upon you, O Aba Jafar, Muhammad son of Ali. Peace be upon you, O Aba Abdillah, Jafar son of Muhammad. Peace be upon you, O Aba al-Hasan, Musa son of Jafar.',
        ur: 'سلام ہو امام محمد باقرؑ، امام جafar صادقؑ، اور امام موسیٰ کاظمؑ پر۔',
      },
      sacred: true,
    },
    {
      id: 'imams_later',
      title: { en: 'Later Imams (AS)', ur: 'بعد کے ائمہؑ' },
      arabic:
        'السَّلَامُ عَلَيْكَ يَا أَبَا الْحَسَنِ عَلِيَّ بْنَ مُوسَىٰ\n' +
        'السَّلَامُ عَلَيْكَ يَا أَبَا جَعْفَرٍ مُحَمَّدَ بْنَ عَلِيٍّ\n' +
        'السَّلَامُ عَلَيْكَ يَا أَبَا الْحَسَنِ عَلِيَّ بْنَ مُحَمَّدٍ',
      translations: {
        en: 'Peace be upon you, O Aba al-Hasan, Ali son of Musa. Peace be upon you, O Aba Jafar, Muhammad son of Ali. Peace be upon you, O Aba al-Hasan, Ali son of Muhammad.',
        ur: 'سلام ہو امام رضاؑ، امام جوادؑ، اور امام ہادیؑ پر۔',
      },
      sacred: true,
    },
    {
      id: 'imams_final',
      title: { en: 'Askari & Mahdi (AS/AJ)', ur: 'عسکریؑ و مہدیؑ' },
      arabic:
        'السَّلَامُ عَلَيْكَ يَا أَبَا الْحَسَنِ الْحَسَنَ بْنَ عَلِيٍّ\n' +
        'السَّلَامُ عَلَيْكَ يَا حُجَّةَ اللّٰهِ\n' +
        'السَّلَامُ عَلَيْكَ يَا بَقِيَّةَ اللّٰهِ فِي أَرْضِهِ',
      translations: {
        en: 'Peace be upon you, O Aba al-Hasan, Hasan son of Ali. Peace be upon you, O proof of Allah. Peace be upon you, O remnant of Allah in His earth.',
        ur: 'سلام ہو امام حسن عسکریؑ پر! سلام ہو اے اللہ کے حجت! سلام ہو اے اللہ کی بقیہ زمین میں!',
      },
      sacred: true,
    },
    {
      id: 'testimony',
      title: { en: 'Comprehensive Testimony', ur: 'جامع گواہی' },
      arabic:
        'أَشْهَدُ أَنَّكُمْ أَئِمَّةٌ هُدَاةٌ مَهْدِيُّونَ\n' +
        'أَشْهَدُ أَنَّكُمْ قَدْ أَدَّيْتُمْ الَّذِي عَلَيْكُمْ\n' +
        'وَجَاهَدْتُمْ فِي اللّٰهِ حَقَّ جِهَادِهِ',
      translations: {
        en: 'I bear witness that you are guiding, rightly guided Imams who fulfilled your duties and strove in the way of Allah as striving deserves.',
        ur: 'میں گواہی دیتا ہوں کہ آپ سب ہدایت یافتہ امام ہیں، اپنا فرض ادا کیا، اور اللہ کی راہ میں جihad کیا۔',
      },
    },
    {
      id: 'loyalty',
      title: { en: 'Pledge of Allegiance', ur: 'بیعت' },
      arabic:
        'أَشْهَدُ أَنِّي مُؤْمِنٌ بِكُمْ وَبِمَا جِئْتُمْ بِهِ\n' +
        'مُصَدِّقٌ بِكُمْ وَبِمَا أَنْتُمْ عَلَيْهِ\n' +
        'مُسْلِمٌ بِكُمْ وَبِمَا دَعَوْتُمْ إِلَيْهِ',
      translations: {
        en: 'I bear witness that I believe in you and what you brought, affirm you and what you stand upon, and submit to you and what you called toward.',
        ur: 'میں گواہی دیتا ہوں کہ میں آپ سب پر ایمان رکھتا ہوں، آپ کی تصدیق کرتا ہوں، اور آپ کی دعوت پر عمل کرتا ہوں۔',
      },
    },
    {
      id: 'closing',
      title: { en: 'Closing', ur: 'اختتام' },
      arabic:
        'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ\n' +
        'وَصَلَّى اللّٰهُ عَلَىٰ مُحَمَّدٍ وَآلِهِ الأَطْهَارِ\n' +
        'آمِينَ رَبَّ الْعَالَمِينَ',
      translations: {
        en: 'Peace, mercy, and blessings of Allah be upon you all. And may Allah bless Muhammad and his pure family. Amen, Lord of the worlds.',
        ur: 'سلام ہو آپ سب پر۔ درود ہو محمدؐ و آل محمدؑ پر۔ آمین۔',
      },
      sacred: true,
    },
  ],
};
