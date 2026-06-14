import type { ZiyaratBundle } from '../../types';
import { ZIYARAT_CATALOG } from '../../constants/catalog';

const meta = ZIYARAT_CATALOG.find((z) => z.id === 'ziyarat_ashura')!;

export const ZIYARAT_ASHURA: ZiyaratBundle = {
  meta,
  bundleVersion: 1,
  sections: [
    {
      id: 'opening',
      title: { en: 'Opening', ur: 'آغاز' },
      arabic:
        'السَّلَامُ عَلَيْكَ يَا أَبَا عَبْدِ اللّٰهِ\n' +
        'السَّلَامُ عَلَيْكَ يَا بْنَ رَسُولِ اللّٰهِ\n' +
        'السَّلَامُ عَلَيْكَ يَا بْنَ أَمِيرِ الْمُؤْمِنِينَ وَابْنَ سَيِّدَةِ نِسَاءِ الْعَالَمِينَ',
      translations: {
        en: 'Peace be upon you, O Aba Abdillah. Peace be upon you, O son of the Messenger of Allah. Peace be upon you, O son of the Commander of the Faithful and son of the mistress of the women of the worlds.',
        ur: 'سلام ہو آپ پر اے ابا عبداللہ! سلام ہو آپ پر اے رسول اللہ کے فرزند! سلام ہو آپ پر اے امیرالمؤمنینؑ اور سیدة نساء العالمینؑ کے فرزند!',
      },
      sacred: true,
    },
    {
      id: 'testimony',
      title: { en: 'Testimony', ur: 'گواہی' },
      arabic:
        'أَشْهَدُ أَنَّكَ قَدْ أَقَمْتَ الصَّلَاةَ وَآتَيْتَ الزَّكَاةَ\n' +
        'وَأَمَرْتَ بِالْمَعْرُوفِ وَنَهَيْتَ عَنِ الْمُنْكَرِ\n' +
        'وَأَطَعْتَ اللّٰهَ وَرَسُولَهُ حَتَّىٰ أَتَاكَ الْيَقِينُ',
      translations: {
        en: 'I bear witness that you established prayer, gave zakat, enjoined good and forbade evil, and obeyed Allah and His Messenger until certainty came to you.',
        ur: 'میں گواہی دیتا ہوں کہ آپ نے نماز قائم کی، زکوٰة دی، نیکی کا حکم دیا، برائی سے روکا، اور اللہ و رسولؐ کی اطاعت کی یہاں تک کہ یقین آپ کے پاس آیا۔',
      },
    },
    {
      id: 'martyrdom',
      title: { en: 'Acknowledging Martyrdom', ur: 'شہادت کا اعتراف' },
      arabic:
        'فَلَعَنَ اللّٰهُ أُمَّةً قَتَلَتْكَ\n' +
        'وَلَعَنَ اللّٰهُ أُمَّةً أَمَتَتْكَ\n' +
        'وَلَعَنَ اللّٰهُ أُمَّةً أَمَرَتْ بِقَتْلِكَ',
      translations: {
        en: 'May Allah curse the people who killed you, the people who led you to be killed, and the people who ordered your killing.',
        ur: 'اللہ کی لعنت ہو ان لوگوں پر جنہوں نے آپ کو شہید کیا، جنہوں نے آپ کے قتل کا حکم دیا، اور جنہوں نے اس پر رضامندی ظاہر کی۔',
      },
    },
    {
      id: 'loyalty',
      title: { en: 'Pledge of Loyalty', ur: 'وفاداری' },
      arabic:
        'أَشْهَدُ أَنَّكَ إِمَامٌ هَادٍ مَهْدِيٌّ\n' +
        'أَشْهَدُ أَنَّكَ قَدْ أَدَّيْتَ الَّذِي عَلَيْكَ\n' +
        'وَجَاهَدْتَ فِي اللّٰهِ حَقَّ جِهَادِهِ حَتَّىٰ أَتَاكَ الْيَقِينُ',
      translations: {
        en: 'I bear witness that you are a rightly guided Imam. I bear witness that you fulfilled your duty and strove in the way of Allah as striving deserves, until certainty came to you.',
        ur: 'میں گواہی دیتا ہوں کہ آپ ہدایت یافتہ امام ہیں، آپ نے اپنا فرض ادا کیا، اور اللہ کی راہ میں جihad کیا یہاں تک کہ یقین آپ کے پاس آیا۔',
      },
    },
    {
      id: 'curse',
      title: { en: 'Disassociation from Enemies', ur: 'براءت' },
      arabic:
        'أَبْرَأُ إِلَى اللّٰهِ وَإِلَيْكَ مِنْهُمْ\n' +
        'وَأَتَبَرَّأُ إِلَى اللّٰهِ وَإِلَيْكَ مِنْ أَعْدَائِكَ\n' +
        'وَمِنْ أَشْيَاعِهِمْ وَأَتْبَاعِهِمْ وَأَنْصَارِهِمْ',
      translations: {
        en: 'I declare before Allah and before you my disassociation from them, and I declare before Allah and before you my disassociation from your enemies, their allies, followers, and supporters.',
        ur: 'میں اللہ اور آپ کے سامنے ان سے براءت کا اعلان کرتا ہوں، اور آپ کے دشمنوں، ان کے حمایتیوں اور پیروکاروں سے براءت کا اعلان کرتا ہوں۔',
      },
    },
    {
      id: 'salutations',
      title: { en: 'Salutations', ur: 'سلام' },
      arabic:
        'السَّلَامُ عَلَيْكَ وَعَلَىٰ أَرْوَاحِ مَنْ حَلَّ فِي رِحَابِكَ\n' +
        'وَعَلَىٰ أَجْسَادِ مَنْ دُفِنَ بِفِنَائِكَ\n' +
        'لَعَنَ اللّٰهُ أَوَّلَ ظَالِمٍ ظَلَمَ حَقَّ مُحَمَّدٍ وَآلِ مُحَمَّدٍ',
      translations: {
        en: 'Peace be upon you and upon the souls that dwell in your sanctuary, and upon the bodies buried in your courtyard. May Allah curse the first oppressor who wronged the rights of Muhammad and the family of Muhammad.',
        ur: 'سلام ہو آپ پر اور ان روحوں پر جو آپ کے حرم میں ہیں، اور ان جسموں پر جو آپ کے صحن میں دفن ہیں۔',
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
        en: 'And may Allah send blessings upon Muhammad and his family. Amen, Lord of the worlds.',
        ur: 'درود ہو محمدؐ و آل محمدؑ پر۔ آمین یا رب العالمین۔',
      },
      sacred: true,
    },
  ],
};
