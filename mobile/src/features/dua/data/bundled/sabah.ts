import type { DuaBundle } from '../../types';
import { DUA_CATALOG } from '../../constants/catalog';

const meta = DUA_CATALOG.find((d) => d.id === 'dua_sabah')!;

export const DUA_SABAH: DuaBundle = {
  meta,
  bundleVersion: 1,
  sections: [
    {
      id: 'opening',
      title: { en: 'Opening', ur: 'آغاز' },
      arabic:
        'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n' +
        'اللّهُمَّ إِنِّي أَسْأَلُكَ بِاسْمِكَ يَا اللّٰهُ\n' +
        'وَأَسْأَلُكَ بِاسْمِكَ يَا رَحْمَٰنُ وَأَسْأَلُكَ بِاسْمِكَ يَا رَحِيمُ',
      translations: {
        en: 'In the name of Allah, the Most Gracious, the Most Merciful. O Allah, I ask You by Your name — O Allah, and I ask You by Your name O Most Gracious, and I ask You by Your name O Most Merciful…',
        ur: 'اللہ کے نام سے۔ اے اللہ! میں تیرے نام "اللہ" کے وسیلے سے، "رحمان" کے وسیلے سے، "رحیم" کے وسیلے سے سوال کرتا ہوں…',
      },
    },
    {
      id: 'praise',
      title: { en: 'Praise of Allah', ur: 'حمد باری تعالیٰ' },
      arabic:
        'سُبْحَانَكَ يَا لَا إِلَٰهَ إِلَّا أَنْتَ\n' +
        'الْخَالِقَ الْبَارِئَ الْمُصَوِّرَ\n' +
        'لَكَ الْأَسْمَاءُ الْحُسْنَىٰ وَلَكَ الْمَثَلُ الْأَعْلَىٰ',
      translations: {
        en: 'Glory be to You — there is no god but You, the Creator, the Maker, the Fashioner. To You belong the most beautiful names and the highest attribute…',
        ur: 'پاک ہے تو اے وہ ذات! جس کے سوا کوئی معبود نہیں، خالق، بارئ، مصور…',
      },
    },
    {
      id: 'blessings',
      title: { en: 'Blessings on the Prophet & Ahlul Bayt', ur: 'درود' },
      arabic:
        'اللّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ\n' +
        'وَبَارِكْ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ\n' +
        'كَمَا صَلَّيْتَ وَبَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَآلِ إِبْرَاهِيمَ',
      translations: {
        en: 'O Allah, send blessings upon Muhammad and the family of Muhammad, and grant them abundance, as You sent blessings and abundance upon Ibrahim and the family of Ibrahim…',
        ur: 'اے اللہ! محمدؐ و آل محمدؑ پر درود و برکت نازل فرما…',
      },
    },
    {
      id: 'morning',
      title: { en: 'Morning Supplication', ur: 'صبح کی دعا' },
      arabic:
        'اللّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ\n' +
        'وَأُشْهِدُ حَمَلَةَ عَرْشِكَ\n' +
        'وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ\n' +
        'أَنَّكَ أَنْتَ اللّٰهُ لَا إِلَٰهَ إِلَّا أَنْتَ',
      translations: {
        en: 'O Allah, this morning I call You to witness, and the bearers of Your Throne, Your angels, and all Your creation, that You are Allah — there is no god but You…',
        ur: 'اے اللہ! میں نے صبح کی اور تجھے گواہ بنایا، تیرے عرش اٹھانے والوں اور فرشتوں کو گواہ بنایا…',
      },
    },
    {
      id: 'protection',
      title: { en: 'Protection for the Day', ur: 'دن کی حفاظت' },
      arabic:
        'اللّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هٰذَا الْيَوْمِ\n' +
        'فَتْحَهُ وَنَصْرَهُ وَنُورَهُ وَبَرَكَتَهُ\n' +
        'وَهُدَاهُ وَأَعُوذُ بِكَ مِنْ شَرِّهِ',
      translations: {
        en: 'O Allah, I ask You for the good of this day — its opening, victory, light, blessings, and guidance — and I seek refuge in You from its evil…',
        ur: 'اے اللہ! میں آج کے دن کی بھلائی، فتح، نور اور برکت مانگتا ہوں…',
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
        ur: 'درود ہو محمدؐ و آل محمدؑ الطاہرین پر۔ آمین۔',
      },
    },
  ],
};
