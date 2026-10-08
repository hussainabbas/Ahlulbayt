import type { DuaBundle } from '../../types';
import { DUA_CATALOG } from '../../constants/catalog';

const meta = DUA_CATALOG.find((d) => d.id === 'dua_kumail')!;

export const DUA_KUMAIL: DuaBundle = {
  meta,
  bundleVersion: 1,
  sections: [
    {
      id: 'opening',
      title: { en: 'Opening', ur: 'آغاز' },
      arabic:
        'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n' +
        'اللّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ وَبِقُوَّتِكَ الَّتِي قَهَرْتَ بِهَا كُلَّ شَيْءٍ\n' +
        'وَخَضَعَ لَهَا كُلُّ شَيْءٍ وَذَلَّ لَهَا كُلُّ شَيْءٍ',
      translations: {
        en: 'In the name of Allah, the Most Gracious, the Most Merciful. O Allah, I ask You by Your mercy which encompasses all things, and by Your power by which You have overcome all things…',
        ur: 'اللہ کے نام سے جو بے حد رحم والا مہربان ہے۔ اے اللہ! میں تجھ سے تیری رحمت کے وسیلے سے سوال کرتا ہوں جس نے ہر چیز کو گھیر رکھا ہے…',
      },
    },
    {
      id: 'praise',
      title: { en: 'Praise', ur: 'حمد' },
      arabic:
        'اللّهُمَّ إِنِّي أَسْأَلُكَ بِاسْمِكَ الَّذِي أَشْرَقَتْ بِهِ السَّمَاوَاتُ وَالْأَرْضُ\n' +
        'وَبِاسْمِكَ الَّذِي يَصْلُحُ بِهِ أَوَّلُنَا وَآخِرُنَا\n' +
        'اللّهُمَّ إِنِّي أَسْأَلُكَ بِاسْمِكَ الْعَظِيمِ الْأَعْظَمِ الْكَبِيرِ الْمُتَعَالِ',
      translations: {
        en: 'O Allah, I ask You by Your name through which the heavens and earth have become illuminated, and by Your name through which the first and last of us are set aright…',
        ur: 'اے اللہ! میں تیرے اس نام کے وسیلے سے سوال کرتا ہوں جس سے آسمان و زمین روشن ہوئے…',
      },
    },
    {
      id: 'repentance',
      title: { en: 'Repentance', ur: 'استغفار' },
      arabic:
        'اللّهُمَّ إِنِّي أَسْأَلُكَ أَنْ تُصَلِّيَ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ\n' +
        'وَأَنْ تَغْفِرَ لِي ذَنْبِي الْعَظِيمَ كَمَا يَلِيقُ بِعَظَمَتِكَ\n' +
        'وَأَنْ تَقْبَلَ مِنِّي تَوْبَتِي كَمَا يَلِيقُ بِرَحْمَتِكَ',
      translations: {
        en: 'O Allah, I ask You to send blessings upon Muhammad and the family of Muhammad, and to forgive my grave sin as befits Your greatness, and to accept my repentance as befits Your mercy…',
        ur: 'اے اللہ! محمدؐ و آل محمدؐ پر درود بھیج اور میرے بڑے گناہ معاف فرما جیسا تیری عظمت کے لائق ہے…',
      },
    },
    {
      id: 'forgiveness',
      title: { en: 'Seeking Forgiveness', ur: 'مغفرت' },
      arabic:
        'يَا اللّٰهُ يَا رَحْمَٰنُ يَا رَحِيمُ يَا كَرِيمُ يَا مُقِيمُ\n' +
        'اغْفِرْ لِي ذُنُوبِي كُلَّهَا يَا إِلَٰهِي بِعَفْوِكَ وَرَحْمَتِكَ\n' +
        'وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
      translations: {
        en: 'O Allah, O Most Merciful, O Most Compassionate, O Generous, O Everlasting — forgive all my sins, my God, by Your pardon and mercy, and turn toward me; indeed You are the Oft-Returning, the Merciful.',
        ur: 'اے اللہ! اے رحمان! اے رحیم! میرے تمام گناہ معاف فرما اپنی عفو و رحمت سے…',
      },
    },
    {
      id: 'intercession',
      title: { en: 'Intercession', ur: 'وسیلہ' },
      arabic:
        'وَبِحَقِّ مُحَمَّدٍ وَعَلِيٍّ وَفَاطِمَةَ وَالْحَسَنِ وَالْحُسَيْنِ\n' +
        'وَعَلِيِّ بْنِ الْحُسَيْنِ وَمُحَمَّدِ بْنِ عَلِيٍّ وَجَعْفَرِ بْنِ مُحَمَّدٍ\n' +
        'وَمُوسَىٰ بْنِ جَعْفَرٍ وَعَلِيِّ بْنِ مُوسَىٰ وَمُحَمَّدِ بْنِ عَلِيٍّ وَعَلِيِّ بْنِ مُحَمَّدٍ',
      translations: {
        en: 'And by the right of Muhammad, Ali, Fatimah, Hasan, and Husayn — and the right of the Imams of guidance who followed — bestow upon me what I ask…',
        ur: 'اور محمدؐ، علیؑ، فاطمہؑ، حسنؑ، حسینؑ اور گ guided ائمہؑ کے حق کے وسیلے سے…',
      },
    },
    {
      id: 'needs',
      title: { en: 'Worldly & Otherworldly Needs', ur: 'حاجات' },
      arabic:
        'اللّهُمَّ إِنِّي أَسْأَلُكَ بِكَ لَكَ أَسْأَلُكَ\n' +
        'وَأَتَوَجَّهُ إِلَيْكَ بِكَ إِلَيْكَ\n' +
        'فَاغْفِرْ لِي مَا قَدَّمْتُ وَمَا أَخَّرْتُ وَمَا أَسْرَرْتُ وَمَا أَعْلَنتُ',
      translations: {
        en: 'O Allah, I ask You by You, for You I ask, and toward You I turn by You — so forgive what I have sent ahead, delayed, concealed, and declared openly…',
        ur: 'اے اللہ! میں تجھ سے تیرے ہی وسیلے سے سوال کرتا ہوں، تجھ ہی کی طرف رجوع کرتا ہوں…',
      },
    },
    {
      id: 'protection',
      title: { en: 'Protection', ur: 'حفاظت' },
      arabic:
        'اللّهُمَّ احْفَظْنِي وَاحْفَظْ مَا تَحْتَ حِفْظِكَ\n' +
        'وَاجْعَلْنِي مِنْ أَهْلِ طَاعَتِكَ وَمَحَبَّتِكَ\n' +
        'وَلاَ تَكِلْنِي إِلَىٰ نَفْسِي طَرْفَةَ عَيْنٍ',
      translations: {
        en: 'O Allah, protect me and protect what is under Your protection. Make me among the people of Your obedience and love, and do not leave me to myself for the blink of an eye…',
        ur: 'اے اللہ! میری حفاظت فرما اور مجھے اپنی اطاعت و محبت والوں میں شامل رکھ…',
      },
    },
    {
      id: 'closing',
      title: { en: 'Closing', ur: 'اختتام' },
      arabic:
        'وَصَلَّى اللّٰهُ عَلَىٰ مُحَمَّدٍ وَآلِهِ الطَّاهِرِينَ\n' +
        'وَسَلَّمَ تَسْلِيمًا كَثِيرًا كَثِيرًا\n' +
        'آمِينَ رَبَّ الْعَالَمِينَ',
      translations: {
        en: 'And may Allah send abundant blessings and peace upon Muhammad and his pure family. Amen, Lord of the worlds.',
        ur: 'اور درود و سلام ہو محمدؐ و آل محمدؑ الطاہرین پر۔ آمین یا رب العالمین۔',
      },
    },
  ],
};
