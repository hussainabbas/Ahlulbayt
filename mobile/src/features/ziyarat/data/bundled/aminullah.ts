import type { ZiyaratBundle } from '../../types';
import { ZIYARAT_CATALOG } from '../../constants/catalog';

const meta = ZIYARAT_CATALOG.find((z) => z.id === 'ziyarat_aminullah')!;

export const ZIYARAT_AMINULLAH: ZiyaratBundle = {
  meta,
  bundleVersion: 1,
  sections: [
    {
      id: 'opening',
      title: { en: 'Opening', ur: 'آغاز' },
      arabic:
        'السَّلَامُ عَلَيْكَ يَا أَمِينَ اللّٰهِ فِي أَرْضِهِ\n' +
        'وَحُجَّتَهُ عَلَىٰ عِبَادِهِ\n' +
        'أَشْهَدُ أَنَّكَ قَدْ أَقَمْتَ الصَّلَاةَ وَآتَيْتَ الزَّكَاةَ',
      translations: {
        en: 'Peace be upon you, O trusted one of Allah in His earth, His proof upon His servants. I bear witness that you established prayer and gave zakat.',
        ur: 'سلام ہو آپ پر اے اللہ کے زمین میں امین! میں گواہی دیتا ہوں کہ آپ نے نماز قائم کی اور زکوٰة دی۔',
      },
      sacred: true,
    },
    {
      id: 'testimony',
      title: { en: 'Testimony of Faith', ur: 'ایمان کی گواہی' },
      arabic:
        'أَشْهَدُ أَنَّكَ إِمَامٌ هَادٍ مَهْدِيٌّ\n' +
        'أَشْهَدُ أَنَّكَ قَدْ أَدَّيْتَ الَّذِي عَلَيْكَ\n' +
        'وَجَاهَدْتَ فِي اللّٰهِ حَقَّ جِهَادِهِ حَتَّىٰ أَتَاكَ الْيَقِينُ',
      translations: {
        en: 'I bear witness that you are a rightly guided Imam. I bear witness that you fulfilled your duty and strove in the way of Allah until certainty came to you.',
        ur: 'میں گواہی دیتا ہوں کہ آپ ہدایت یافتہ امام ہیں، آپ نے اپنا فرض ادا کیا اور اللہ کی راہ میں جihad کیا۔',
      },
    },
    {
      id: 'loyalty',
      title: { en: 'Loyalty to Ahlul Bayt', ur: 'ولایت' },
      arabic:
        'أَشْهَدُ أَنَّ الْحَقَّ مَعَكُمْ وَمَعَ أَوْلِيَائِكُمْ\n' +
        'وَأَشْهَدُ أَنَّ الْبَاطِلَ مَعَ مَنْ خَالَفَكُمْ\n' +
        'وَأَشْهَدُ أَنَّكُمْ أَئِمَّةٌ هُدَاةٌ مَهْدِيُّونَ',
      translations: {
        en: 'I bear witness that truth is with you and your friends, and falsehood is with those who oppose you. I bear witness that you are guiding, rightly guided Imams.',
        ur: 'میں گواہی دیتا ہوں کہ حق آپ کے ساتھ ہے، باطل آپ کے مخالفین کے ساتھ ہے، اور آپ ہدایت یافتہ امام ہیں۔',
      },
    },
    {
      id: 'disassociation',
      title: { en: 'Disassociation', ur: 'براءت' },
      arabic:
        'أَبْرَأُ إِلَى اللّٰهِ وَإِلَيْكُمْ مِنْ أَعْدَائِكُمْ\n' +
        'وَأَتَبَرَّأُ إِلَى اللّٰهِ وَإِلَيْكُمْ مِنْ أَشْيَاعِهِمْ\n' +
        'وَأَنْصَارِهِمْ وَأَتْبَاعِهِمْ',
      translations: {
        en: 'I declare before Allah and before you my disassociation from your enemies, their allies, supporters, and followers.',
        ur: 'میں اللہ اور آپ کے سامنے آپ کے دشمنوں اور ان کے حمایتیوں سے براءت کا اعلان کرتا ہوں۔',
      },
    },
    {
      id: 'salutations',
      title: { en: 'Salutations', ur: 'سلام' },
      arabic:
        'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ\n' +
        'جَعَلَنَا اللّٰهُ مِنْ أَنْصَارِكُمْ وَأَشْيَاعِكُمْ\n' +
        'وَالذَّابِّينَ عَنْكُمْ وَالْمُسْتَشْهَدِينَ بَيْنَ يَدَيْكُمْ',
      translations: {
        en: 'Peace, mercy, and blessings of Allah be upon you. May Allah make us among your helpers, allies, defenders, and martyrs before you.',
        ur: 'سلام ہو آپ سب پر۔ اللہ ہمیں آپ کے مددگاروں، حمایتیوں اور شہیدوں میں شامل فرمائے۔',
      },
      sacred: true,
    },
    {
      id: 'closing',
      title: { en: 'Closing', ur: 'اختتام' },
      arabic:
        'وَصَلَّى اللّٰهُ عَلَىٰ مُحَمَّدٍ وَآلِهِ\n' +
        'آمِينَ رَبَّ الْعَالَمِينَ',
      translations: {
        en: 'And may Allah bless Muhammad and his family. Amen, Lord of the worlds.',
        ur: 'درود ہو محمدؐ و آل محمدؑ پر۔ آمین۔',
      },
      sacred: true,
    },
  ],
};
