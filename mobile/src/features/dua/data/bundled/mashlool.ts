import type { DuaBundle } from '../../types';
import { DUA_CATALOG } from '../../constants/catalog';

const meta = DUA_CATALOG.find((d) => d.id === 'dua_mashlool')!;

export const DUA_MASHLOOL: DuaBundle = {
  meta,
  bundleVersion: 1,
  sections: [
    {
      id: 'opening',
      title: { en: 'Opening', ur: 'آغاز' },
      arabic:
        'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n' +
        'يَا مَنْ يَقْبَلُ يَسِيرًا وَيَعْفُو عَنِ الْكَثِيرِ\n' +
        'اقْبَلْ مِنِّي يَسِيرًا وَاعْفُ عَنِّي كَثِيرًا',
      translations: {
        en: 'In the name of Allah, the Most Gracious, the Most Merciful. O He who accepts the little and pardons much — accept my little and pardon my much…',
        ur: 'اللہ کے نام سے۔ اے وہ ذات! جو تھوڑا قبول کرتی اور بہت معاف کرتی ہے…',
      },
    },
    {
      id: 'praise',
      title: { en: 'Praise', ur: 'حمد' },
      arabic:
        'الْحَمْدُ لِلّٰهِ الَّذِي لَيْسَ لَهُ مُضَادٌّ وَلاَ مُشَاكِلٌ\n' +
        'وَلاَ مُضِيرٌ وَلاَ مُغَالِبٌ\n' +
        'الْحَمْدُ لِلّٰهِ الَّذِي لَيْسَ لَهُ شَرِيكٌ فِي مُلْكِهِ',
      translations: {
        en: 'Praise be to Allah who has no equal, no likeness, no harm-doer against Him, no overpowering rival. Praise be to Allah who has no partner in His sovereignty…',
        ur: 'تمام تعریفیں اللہ کے لیے ہیں جس کا کوئی مد مقابل نہیں…',
      },
    },
    {
      id: 'affliction',
      title: { en: 'Seeking Relief', ur: 'شفا کی التجا' },
      arabic:
        'يَا مُدَبِّرَ كُلِّ شَيْءٍ لَا يُدَبِّرُ عَلَيْكَ شَيْءٌ\n' +
        'يَا مُنَوِّرَ كُلِّ شَيْءٍ لَا يُنَوِّرُ عَلَيْكَ شَيْءٌ\n' +
        'يَا حَيُّ يَا قَيُّومُ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
      translations: {
        en: 'O Disposer of all things — nothing disposes over You. O Illuminator of all things — nothing illuminates over You. O Ever-Living, O Self-Subsisting, O Possessor of majesty and honor…',
        ur: 'اے ہر چیز کے منظم! تجھ پر کوئی حاکم نہیں۔ اے ہر چیز کے روشن کرنے والے!…',
      },
    },
    {
      id: 'healing',
      title: { en: 'Healing', ur: 'شفا' },
      arabic:
        'اللّهُمَّ إِنِّي أَسْأَلُكَ بِاسْمِكَ الْعَظِيمِ الْأَعْظَمِ\n' +
        'أَنْ تُشْفِيَنِي وَتَعَافِيَنِي\n' +
        'وَتَرْحَمَنِي وَتَغْفِرَ لِي',
      translations: {
        en: 'O Allah, I ask You by Your greatest, most magnificent name to heal me, restore me, have mercy upon me, and forgive me…',
        ur: 'اے اللہ! میں تیرے عظیم ترین نام کے وسیلے سے شفا، عافیت، رحمت اور مغفرت مانگتا ہوں…',
      },
    },
    {
      id: 'closing',
      title: { en: 'Closing', ur: 'اختتام' },
      arabic:
        'وَصَلَّى اللّٰهُ عَلَىٰ مُحَمَّدٍ وَآلِهِ\n' +
        'وَلاَ حَوْلَ وَلاَ قُوَّةَ إِلَّا بِاللّٰهِ\n' +
        'آمِينَ رَبَّ الْعَالَمِينَ',
      translations: {
        en: 'And may Allah bless Muhammad and his family. There is no power nor strength except through Allah. Amen, Lord of the worlds.',
        ur: 'درود ہو محمدؐ و آل محمدؑ پر۔ لا حول و لا قوة الا باللہ۔ آمین۔',
      },
    },
  ],
};
