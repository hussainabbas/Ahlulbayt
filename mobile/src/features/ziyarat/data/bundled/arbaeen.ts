import type { ZiyaratBundle } from '../../types';
import { ZIYARAT_CATALOG } from '../../constants/catalog';

const meta = ZIYARAT_CATALOG.find((z) => z.id === 'ziyarat_arbaeen')!;

export const ZIYARAT_ARBAEEN: ZiyaratBundle = {
  meta,
  bundleVersion: 1,
  sections: [
    {
      id: 'opening',
      title: { en: 'Opening', ur: 'آغاز' },
      arabic:
        'السَّلَامُ عَلَيْكَ يَا أَبَا عَبْدِ اللّٰهِ\n' +
        'السَّلَامُ عَلَيْكَ يَا بْنَ رَسُولِ اللّٰهِ\n' +
        'السَّلَامُ عَلَيْكَ يَا خِيَرَةَ اللّٰهِ وَابْنَ خِيَرَتِهِ',
      translations: {
        en: 'Peace be upon you, O Aba Abdillah. Peace be upon you, O son of the Messenger of Allah. Peace be upon you, O chosen one of Allah and son of His chosen one.',
        ur: 'سلام ہو آپ پر اے ابا عبداللہ! سلام ہو آپ پر اے رسول اللہ کے فرزند! سلام ہو آپ پر اے اللہ کے برگزیدہ!',
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
      title: { en: 'The Tragedy of Karbala', ur: 'مصیبت کربلا' },
      arabic:
        'أَشْهَدُ أَنَّكَ قَدْ أُصِبْتَ ظُلْمًا\n' +
        'وَأُهِرِيقَ دَمُكَ مَظْلُومًا\n' +
        'وَأُزِيلَتْ مِنَ الدُّنْيَا أَعْظَمُ نِعَمِ اللّٰهِ عَلَيْهَا',
      translations: {
        en: 'I bear witness that you were afflicted unjustly, your blood was shed while oppressed, and the greatest blessings upon the world were removed with you.',
        ur: 'میں گواہی دیتا ہوں کہ آپ پر ظلم کیا گیا، آپ کا خون مظلومیت کے ساتھ بہایا گیا۔',
      },
    },
    {
      id: 'loyalty',
      title: { en: 'Eternal Loyalty', ur: 'ہمیشہ کی وفاداری' },
      arabic:
        'أَشْهَدُ أَنِّي مُؤْمِنٌ بِكَ وَبِمَا جِئْتَ بِهِ\n' +
        'مُصَدِّقٌ بِكَ وَبِمَا أَنْتَ عَلَيْهِ\n' +
        'مُسْلِمٌ بِكَ وَبِمَا دَعَوْتَ إِلَيْهِ',
      translations: {
        en: 'I bear witness that I believe in you and what you brought, affirm you and what you stand upon, and submit to you and what you called toward.',
        ur: 'میں گواہی دیتا ہوں کہ میں آپ پر ایمان رکھتا ہوں، آپ کی تصدیق کرتا ہوں، اور آپ کی دعوت پر عمل کرتا ہوں۔',
      },
    },
    {
      id: 'walk',
      title: { en: 'The Walk to Karbala', ur: 'کربلا کا سفر' },
      arabic:
        'لَوْ كُنَّا مَعَكَ لَفُزْنَا فَوْزًا عَظِيمًا\n' +
        'اللّهُمَّ اجْعَلْنَا مِمَّنْ يَزُورُهُ وَيَزُورُ مَقَامَهُ\n' +
        'وَيَشْهَدُ عَلَىٰ مَا شَهِدَ عَلَيْهِ',
      translations: {
        en: 'Had we been with you, we would have attained a great triumph. O Allah, make us among those who visit him and his sacred station, bearing witness to what he witnessed.',
        ur: 'اے اللہ! ہمیں ان لوگوں میں شامل فرما جو آپ کے مزار پر جاتے ہیں اور آپ کی گواہی دیتے ہیں۔',
      },
    },
    {
      id: 'curse',
      title: { en: 'Curse on Oppressors', ur: 'ظالموں پر لعنت' },
      arabic:
        'لَعَنَ اللّٰهُ أُمَّةً قَتَلَتْكَ\n' +
        'وَلَعَنَ اللّٰهُ أُمَّةً أَمَرَتْ بِقَتْلِكَ\n' +
        'وَلَعَنَ اللّٰهُ أُمَّةً أَمَتَتْكَ',
      translations: {
        en: 'May Allah curse the people who killed you, who ordered your killing, and who led you to be killed.',
        ur: 'اللہ کی لعنت ہو ان پر جنہوں نے آپ کو شہید کیا اور اس کا حکم دیا۔',
      },
    },
    {
      id: 'closing',
      title: { en: 'Closing', ur: 'اختتام' },
      arabic:
        'السَّلَامُ عَلَيْكَ وَعَلَىٰ أَرْوَاحِ مَنْ حَلَّ فِي رِحَابِكَ\n' +
        'وَصَلَّى اللّٰهُ عَلَىٰ مُحَمَّدٍ وَآلِهِ',
      translations: {
        en: 'Peace be upon you and upon the souls that dwell in your sanctuary. And may Allah bless Muhammad and his family.',
        ur: 'سلام ہو آپ پر اور آپ کے حرم میں موجود روحوں پر۔ درود ہو محمدؐ و آل محمدؑ پر۔',
      },
      sacred: true,
    },
  ],
};
