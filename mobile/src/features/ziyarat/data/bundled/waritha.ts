import type { ZiyaratBundle } from '../../types';
import { ZIYARAT_CATALOG } from '../../constants/catalog';

const meta = ZIYARAT_CATALOG.find((z) => z.id === 'ziyarat_waritha')!;

export const ZIYARAT_WARITHA: ZiyaratBundle = {
  meta,
  bundleVersion: 1,
  sections: [
    {
      id: 'opening',
      title: { en: 'Opening', ur: 'آغاز' },
      arabic:
        'السَّلَامُ عَلَيْكَ يَا وَارِثَ آدَمَ صَلَوَاتُ اللّٰهِ عَلَيْهِ\n' +
        'السَّلَامُ عَلَيْكَ يَا وَارِثَ نُوحٍ وَإِبْرَاهِيمَ وَمُوسَىٰ وَعِيسَىٰ\n' +
        'السَّلَامُ عَلَيْكَ يَا وَارِثَ مُحَمَّدٍ صَلَّى اللّٰهُ عَلَيْهِ وَآلِهِ',
      translations: {
        en: 'Peace be upon you, O heir of Adam — may Allah bless him. Peace be upon you, O heir of Nuh, Ibrahim, Musa, and Isa. Peace be upon you, O heir of Muhammad — may Allah bless him and his family.',
        ur: 'سلام ہو آپ پر اے وارث آدمؑ! سلام ہو آپ پر اے نوحؑ، ابراہیمؑ، موسیٰؑ اور عیسیٰؑ کے وارث! سلام ہو آپ پر اے محمدؐ کے وارث!',
      },
      sacred: true,
    },
    {
      id: 'address',
      title: { en: 'Address to the Imam', ur: 'امام سے خطاب' },
      arabic:
        'السَّلَامُ عَلَيْكَ يَا وَارِثَ الْحَسَنِ وَالْحُسَيْنِ\n' +
        'السَّلَامُ عَلَيْكَ يَا وَلِيَّ اللّٰهِ وَابْنَ وَلِيِّهِ\n' +
        'السَّلَامُ عَلَيْكَ يَا حُجَّةَ اللّٰهِ وَابْنَ حُجَّتِهِ',
      translations: {
        en: 'Peace be upon you, O heir of Hasan and Husayn. Peace be upon you, O friend of Allah and son of His friend. Peace be upon you, O proof of Allah and son of His proof.',
        ur: 'سلام ہو آپ پر اے حسنؑ و حسینؑ کے وارث! سلام ہو آپ پر اے ولی اللہ اور ولی اللہ کے فرزند!',
      },
      sacred: true,
    },
    {
      id: 'testimony',
      title: { en: 'Testimony', ur: 'گواہی' },
      arabic:
        'أَشْهَدُ أَنَّكَ قَدْ أَقَمْتَ الصَّلَاةَ وَآتَيْتَ الزَّكَاةَ\n' +
        'وَأَمَرْتَ بِالْمَعْرُوفِ وَنَهَيْتَ عَنِ الْمُنْكَرِ\n' +
        'وَجَاهَدْتَ فِي اللّٰهِ حَقَّ جِهَادِهِ',
      translations: {
        en: 'I bear witness that you established prayer, gave zakat, enjoined good, forbade evil, and strove in the way of Allah as striving deserves.',
        ur: 'میں گواہی دیتا ہوں کہ آپ نے نماز قائم کی، زکوٰة دی، نیکی کا حکم دیا، برائی سے روکا، اور اللہ کی راہ میں جihad کیا۔',
      },
    },
    {
      id: 'martyrdom',
      title: { en: 'Martyrdom at Karbala', ur: 'شہادت کربلا' },
      arabic:
        'أَشْهَدُ أَنَّكَ قَدْ أُصِبْتَ وَأُهِرِيقَ دَمُكَ\n' +
        'وَأُزِيلَتْ مِنَ الدُّنْيَا أَعْظَمُ نِعَمِ اللّٰهِ عَلَيْهَا\n' +
        'وَأُزِيلَتْ مِنْهَا أَعْظَمُ شُعَبِ الْإِيمَانِ',
      translations: {
        en: 'I bear witness that you were afflicted, your blood was shed, and the greatest blessings of Allah upon the world were removed with you — the greatest branches of faith.',
        ur: 'میں گواہی دیتا ہوں کہ آپ پر مصیبت آئی، آپ کا خون بہایا گیا، اور دنیا سے اللہ کی سب سے بڑی نعمتیں آپ کے ساتھ اٹھا لی گئیں۔',
      },
    },
    {
      id: 'loyalty',
      title: { en: 'Pledge', ur: 'عہد' },
      arabic:
        'أَشْهَدُ أَنَّكَ إِمَامٌ هَادٍ مَهْدِيٌّ بَارٌّ تَقِيٌّ\n' +
        'أَشْهَدُ أَنَّكَ قَدْ أَدَّيْتَ الَّذِي عَلَيْكَ\n' +
        'وَصَبَرْتَ فِي اللّٰهِ حَقَّ صَبْرِهِ',
      translations: {
        en: 'I bear witness that you are a rightly guided, pious Imam. I bear witness that you fulfilled your duty and were patient for Allah as patience deserves.',
        ur: 'میں گواہی دیتا ہوں کہ آپ ہدایت یافتہ، پرہیزگار امام ہیں، آپ نے اپنا فرض ادا کیا اور اللہ کے لیے صبر کیا۔',
      },
    },
    {
      id: 'closing',
      title: { en: 'Closing', ur: 'اختتام' },
      arabic:
        'السَّلَامُ عَلَيْكَ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ\n' +
        'وَصَلَّى اللّٰهُ عَلَىٰ مُحَمَّدٍ وَآلِهِ الأَطْهَارِ',
      translations: {
        en: 'Peace, mercy, and blessings of Allah be upon you. And may Allah bless Muhammad and his pure family.',
        ur: 'سلام ہو آپ پر اور اللہ کی رحمت و برکتیں۔ درود ہو محمدؐ و آل محمدؑ الطاہرین پر۔',
      },
      sacred: true,
    },
  ],
};
