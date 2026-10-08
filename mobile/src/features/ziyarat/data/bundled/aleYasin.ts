import type { ZiyaratBundle } from '../../types';
import { ZIYARAT_CATALOG } from '../../constants/catalog';

const meta = ZIYARAT_CATALOG.find((z) => z.id === 'ziyarat_ale_yasin')!;

export const ZIYARAT_ALE_YASIN: ZiyaratBundle = {
  meta,
  bundleVersion: 1,
  sections: [
    {
      id: 'opening',
      title: { en: 'Opening', ur: 'آغاز' },
      arabic:
        'السَّلَامُ عَلَيْكَ يَا أَبَا عَبْدِ اللّٰهِ\n' +
        'السَّلَامُ عَلَيْكَ يَا بْنَ رَسُولِ اللّٰهِ\n' +
        'السَّلَامُ عَلَيْكَ يَا بْنَ أَمِيرِ الْمُؤْمِنِينَ',
      translations: {
        en: 'Peace be upon you, O Aba Abdillah. Peace be upon you, O son of the Messenger of Allah. Peace be upon you, O son of the Commander of the Faithful.',
        ur: 'سلام ہو آپ پر اے ابا عبداللہ! سلام ہو آپ پر اے رسول اللہ کے فرزند! سلام ہو آپ پر اے امیرالمؤمنینؑ کے فرزند!',
      },
      sacred: true,
    },
    {
      id: 'yasin',
      title: { en: 'The Family of Yasin', ur: 'آل یاسین' },
      arabic:
        'السَّلَامُ عَلَيْكَ يَا بْنَ سَيِّدَةِ نِسَاءِ الْعَالَمِينَ\n' +
        'السَّلَامُ عَلَيْكَ يَا بْنَ خَاتَمِ النَّبِيِّينَ\n' +
        'السَّلَامُ عَلَيْكَ يَا بْنَ خِيَرَةِ اللّٰهِ مِنْ خَلْقِهِ',
      translations: {
        en: 'Peace be upon you, O son of the mistress of the women of the worlds. Peace be upon you, O son of the seal of the Prophets. Peace be upon you, O son of the best of Allah\'s creation.',
        ur: 'سلام ہو آپ پر اے سیدة نساء العالمینؑ کے فرزند! سلام ہو آپ پر اے خاتم النبیینؑ کے فرزند!',
      },
      sacred: true,
    },
    {
      id: 'testimony',
      title: { en: 'Testimony', ur: 'گواہی' },
      arabic:
        'أَشْهَدُ أَنَّكَ إِمَامٌ هَادٍ مَهْدِيٌّ\n' +
        'أَشْهَدُ أَنَّكَ قَدْ أَقَمْتَ الصَّلَاةَ وَآتَيْتَ الزَّكَاةَ\n' +
        'وَأَمَرْتَ بِالْمَعْرُوفِ وَنَهَيْتَ عَنِ الْمُنْكَرِ',
      translations: {
        en: 'I bear witness that you are a rightly guided Imam who established prayer, gave zakat, enjoined good, and forbade evil.',
        ur: 'میں گواہی دیتا ہوں کہ آپ ہدایت یافتہ امام ہیں، نماز قائم کی، زکوٰة دی، نیکی کا حکم دیا۔',
      },
    },
    {
      id: 'martyrdom',
      title: { en: 'Martyrdom', ur: 'شہادت' },
      arabic:
        'أَشْهَدُ أَنَّكَ قَدْ أُصِبْتَ وَأُهِرِيقَ دَمُكَ\n' +
        'وَأُزِيلَتْ مِنَ الدُّنْيَا أَعْظَمُ نِعَمِ اللّٰهِ عَلَيْهَا\n' +
        'وَجَاهَدْتَ فِي اللّٰهِ حَقَّ جِهَادِهِ حَتَّىٰ أَتَاكَ الْيَقِينُ',
      translations: {
        en: 'I bear witness that you were afflicted, your blood was shed, the greatest blessings upon the world were removed with you, and you strove in the way of Allah until certainty came to you.',
        ur: 'میں گواہی دیتا ہوں کہ آپ پر مصیبت آئی، آپ کا خون بہایا گیا، اور آپ نے اللہ کی راہ میں جihad کیا۔',
      },
    },
    {
      id: 'closing',
      title: { en: 'Closing', ur: 'اختتام' },
      arabic:
        'السَّلَامُ عَلَيْكَ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ\n' +
        'وَصَلَّى اللّٰهُ عَلَىٰ مُحَمَّدٍ وَآلِهِ\n' +
        'آمِينَ رَبَّ الْعَالَمِينَ',
      translations: {
        en: 'Peace, mercy, and blessings of Allah be upon you. And may Allah bless Muhammad and his family. Amen, Lord of the worlds.',
        ur: 'سلام ہو آپ پر۔ درود ہو محمدؐ و آل محمدؑ پر۔ آمین۔',
      },
      sacred: true,
    },
  ],
};
