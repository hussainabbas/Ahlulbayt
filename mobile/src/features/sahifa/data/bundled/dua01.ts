import type { SahifaBundle } from '../../types';
import { getSahifaMetaByNumber } from '../../constants/catalog';

const meta = getSahifaMetaByNumber(1)!;

export const SAHIFA_001: SahifaBundle = {
  meta,
  bundleVersion: 1,
  sections: [
    {
      id: 'opening',
      title: { en: 'Opening', ur: 'آغاز' },
      arabic:
        'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n' +
        'الْحَمْدُ لِلّٰهِ الَّذِي لَيْسَ لَهُ كُفُوًا أَحَدٌ\n' +
        'وَلَيْسَ لَهُ شَرِيكٌ فِي الْمُلْكِ وَلَمْ يَكُنْ لَهُ وَلِيٌّ مِنَ الذُّلِّ',
      translations: {
        en: 'In the name of Allah, the Most Gracious, the Most Merciful. Praise be to Allah who has no equal, no partner in sovereignty, and no helper from weakness.',
        ur: 'اللہ کے نام سے۔ تمام تعریفیں اللہ کے لیے ہیں جس کا کوئی ہمسر نہیں، بادشاہی میں اس کا کوئی شریک نہیں۔',
      },
    },
    {
      id: 'praise',
      title: { en: 'Praise of Allah', ur: 'حمدِ باری' },
      arabic:
        'اللّهُمَّ إِنِّي أَسْأَلُكَ بِاسْمِكَ يَا اللّٰهُ\n' +
        'وَأَسْأَلُكَ بِاسْمِكَ يَا رَحْمَٰنُ\n' +
        'وَأَسْأَلُكَ بِاسْمِكَ يَا رَحِيمُ\n' +
        'اللّهُمَّ إِنِّي أَسْأَلُكَ بِاسْمِكَ الْعَظِيمِ',
      translations: {
        en: 'O Allah, I ask You by Your name — O Allah, and I ask You by Your name O Most Gracious, and I ask You by Your name O Most Merciful. O Allah, I ask You by Your greatest name.',
        ur: 'اے اللہ! میں تیرے نام "اللہ" کے وسیلے سے، "رحمان" کے وسیلے سے، "رحیم" کے وسیلے سے سوال کرتا ہوں۔',
      },
    },
    {
      id: 'morals',
      title: { en: 'Noble Moral Traits', ur: 'مکارم الاخلاق' },
      arabic:
        'اللّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ\n' +
        'وَاجْعَلْنِي مِمَّنْ تَوَاضَعَ لَكَ فَرَفَعْتَهُ\n' +
        'وَتَقَرَّبَ إِلَيْكَ فَقَرَّبْتَهُ\n' +
        'وَاسْتَغْفَرَكَ فَغَفَرْتَ لَهُ',
      translations: {
        en: 'O Allah, send blessings upon Muhammad and the family of Muhammad. Make me among those who humbled themselves before You so You raised them, drew near to You so You brought them close, and sought Your forgiveness so You forgave them.',
        ur: 'اے اللہ! محمدؐ و آل محمدؑ پر درود بھیج۔ مجھے ان لوگوں میں شامل فرما جنہوں نے تجھ سے عاجزی کی تو تو نے انہیں بلند کیا۔',
      },
    },
    {
      id: 'needs',
      title: { en: 'Asking for Needs', ur: 'حاجات' },
      arabic:
        'اللّهُمَّ إِنِّي أَسْأَلُكَ مِنْ خَيْرِ مَا سَأَلَكَ مِنْهُ نَبِيُّكَ مُحَمَّدٌ صَلَّى اللّٰهُ عَلَيْهِ وَآلِهِ\n' +
        'وَأَعُوذُ بِكَ مِنْ شَرِّ مَا اسْتَعَاذَ مِنْهُ نَبِيُّكَ مُحَمَّدٌ',
      translations: {
        en: 'O Allah, I ask You for the best of what Your Prophet Muhammad — may Allah bless him and his family — asked You for, and I seek refuge in You from the evil from which Your Prophet sought refuge.',
        ur: 'اے اللہ! میں تجھ سے وہ بہترین چیز مانگتا ہوں جو تیرے نبیؐ نے مانگی، اور اس برائی سے پناہ مانگتا ہوں جس سے تیرے نبیؐ نے پناہ مانگی۔',
      },
    },
    {
      id: 'closing',
      title: { en: 'Closing', ur: 'اختتام' },
      arabic:
        'وَصَلَّى اللّٰهُ عَلَىٰ مُحَمَّدٍ وَآلِهِ الطَّاهِرِينَ\n' +
        'آمِينَ رَبَّ الْعَالَمِينَ',
      translations: {
        en: 'And may Allah bless Muhammad and his pure family. Amen, Lord of the worlds.',
        ur: 'درود ہو محمدؐ و آل محمدؑ الطاہرین پر۔ آمین یا رب العالمین۔',
      },
    },
  ],
};
