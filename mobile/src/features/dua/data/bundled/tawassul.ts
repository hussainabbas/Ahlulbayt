import type { DuaBundle } from '../../types';
import { DUA_CATALOG } from '../../constants/catalog';

const meta = DUA_CATALOG.find((d) => d.id === 'dua_tawassul')!;

export const DUA_TAWASSUL: DuaBundle = {
  meta,
  bundleVersion: 1,
  sections: [
    {
      id: 'opening',
      title: { en: 'Opening', ur: 'آغاز' },
      arabic:
        'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n' +
        'اللّهُمَّ إِنِّي أَسْأَلُكَ وَأَتَوَجَّهُ إِلَيْكَ بِنَبِيِّكَ نَبِيِّ الرَّحْمَةِ\n' +
        'مُحَمَّدٍ صَلَّى اللّٰهُ عَلَيْهِ وَآلِهِ',
      translations: {
        en: 'In the name of Allah, the Most Gracious, the Most Merciful. O Allah, I ask You and turn to You through Your Prophet, the Prophet of mercy — Muhammad, may Allah bless him and his family.',
        ur: 'اللہ کے نام سے۔ اے اللہ! میں تیرے نبیؐ، نبی رحمت محمدؐ کے وسیلے سے تجھ سے سوال کرتا ہوں۔',
      },
    },
    {
      id: 'tawassul_prophet',
      title: { en: 'Through the Prophet (SA)', ur: 'نبیؐ کے وسیلے سے' },
      arabic:
        'يَا أَبَا الْقَاسِمِ يَا رَسُولَ اللّٰهِ\n' +
        'يَا أَمِينَ اللّٰهِ فِي خَلْقِهِ\n' +
        'أَشْكُو إِلَيْكَ وَأَتَوَسَّلُ بِكَ إِلَى اللّٰهِ رَبِّي وَرَبِّكَ',
      translations: {
        en: 'O Abal-Qasim, O Messenger of Allah, O trustee of Allah among His creation — I complain to you and seek your intercession with Allah, my Lord and your Lord.',
        ur: 'اے ابا القاسم! اے رسول اللہ! میں تمہارے وسیلے سے اپنے رب سے التجا کرتا ہوں۔',
      },
    },
    {
      id: 'tawassul_ahlulbayt',
      title: { en: 'Through Ahlul Bayt (AS)', ur: 'اہل بیتؑ کے وسیلے سے' },
      arabic:
        'يَا أَبَا عَبْدِ اللّٰهِ يَا أَبَا عَبْدِ اللّٰهِ\n' +
        'يَا حُسَيْنُ بْنَ عَلِيٍّ\n' +
        'أَشْكُو إِلَيْكَ وَأَتَوَسَّلُ بِكَ إِلَى اللّٰهِ',
      translations: {
        en: 'O Aba Abdillah, O Husayn son of Ali — I complain to you and seek your intercession with Allah…',
        ur: 'اے ابا عبداللہ! اے امام حسینؑ! میں تمہارے وسیلے سے اللہ سے التجا کرتا ہوں۔',
      },
    },
    {
      id: 'supplication',
      title: { en: 'Supplication', ur: 'دعا' },
      arabic:
        'اللّهُمَّ بِحَقِّ مُحَمَّدٍ وَآلِ مُحَمَّدٍ\n' +
        'اجْعَلْنِي مِمَّنْ تَوَسَّلَ بِهِمْ إِلَيْكَ فَكَفَيْتَهُ\n' +
        'وَشَفَيْتَهُ وَقَضَيْتَ لَهُ حَاجَتَهُ',
      translations: {
        en: 'O Allah, by the right of Muhammad and the family of Muhammad, make me among those who sought intercession through them to You — so You sufficed them, healed them, and fulfilled their needs.',
        ur: 'اے اللہ! محمدؐ و آل محمدؑ کے حق سے مجھے ان لوگوں میں شامل فرما جنہوں نے ان کے وسیلے سے تجھ سے التجا کی…',
      },
    },
    {
      id: 'needs',
      title: { en: 'Needs', ur: 'حاجات' },
      arabic:
        'اللّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ مَا سَأَلَكَ بِهِ عِبَادُكَ الصَّالِحُونَ\n' +
        'وَأَعُوذُ بِكَ مِنْ شَرِّ مَا اسْتَعَاذَ بِكَ مِنْهُ عِبَادُكَ الصَّالِحُونَ',
      translations: {
        en: 'O Allah, I ask You for the best of what Your righteous servants have asked You, and I seek refuge in You from the evil from which Your righteous servants sought refuge…',
        ur: 'اے اللہ! میں تجھ سے وہ بہترین چیز مانگتا ہوں جو تیرے نیک بندوں نے مانگی…',
      },
    },
    {
      id: 'closing',
      title: { en: 'Closing', ur: 'اختتام' },
      arabic:
        'وَصَلَّى اللّٰهُ عَلَىٰ مُحَمَّدٍ وَآلِهِ الأَطْهَارِ\n' +
        'وَحَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ\n' +
        'آمِينَ رَبَّ الْعَالَمِينَ',
      translations: {
        en: 'And may Allah bless Muhammad and his pure family. Allah is sufficient for us and He is the best disposer of affairs. Amen, Lord of the worlds.',
        ur: 'درود ہو محمدؐ و آل محمدؑ پر۔ حسبنا اللہ و نعم الوکیل۔ آمین۔',
      },
    },
  ],
};
