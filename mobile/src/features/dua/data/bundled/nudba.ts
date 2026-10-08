import type { DuaBundle } from '../../types';
import { DUA_CATALOG } from '../../constants/catalog';

const meta = DUA_CATALOG.find((d) => d.id === 'dua_nudba')!;

export const DUA_NUDBA: DuaBundle = {
  meta,
  bundleVersion: 1,
  sections: [
    {
      id: 'opening',
      title: { en: 'Opening', ur: 'آغاز' },
      arabic:
        'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n' +
        'الْحَمْدُ لِلّٰهِ الَّذِي لَمْ يَتَّخِذْ وَلَدًا\n' +
        'وَلَمْ يَكُنْ لَهُ شَرِيكٌ فِي الْمُلْكِ',
      translations: {
        en: 'In the name of Allah, the Most Gracious, the Most Merciful. Praise be to Allah who has not taken a son and has no partner in sovereignty…',
        ur: 'اللہ کے نام سے۔ تمام تعریفیں اللہ کے لیے ہیں جس نے کوئی بیٹا نہیں بنایا…',
      },
    },
    {
      id: 'lamentation',
      title: { en: 'Lamentation', ur: 'ندبہ' },
      arabic:
        'أَيْنَ الْمُسْتَخْلَفُ عَلَىٰ الْحُسَيْنِ\n' +
        'أَيْنَ الْمُنْتَقِمُ مِنْ دَمِ الْمَقْتُولِ بِكَرْبَلَاءَ\n' +
        'أَيْنَ الْمُخْتَلَفُ إِلَيْهِ فِي كُلِّ مُشْكِلَةٍ',
      translations: {
        en: 'Where is the successor appointed over Husayn? Where is the avenger of the blood shed at Karbala? Where is he to whom every difficult matter is referred…',
        ur: 'کربلا میں شہید ہونے والے کا بدلہ لینے والا کہاں ہے؟ ہر مشکل میں جس کی طرف رجوع کیا جائے وہ کہاں ہے؟',
      },
    },
    {
      id: 'occultation',
      title: { en: 'Occultation', ur: 'غیبت' },
      arabic:
        'أَيْنَ الطَّالِبُ بِذَحْرِ أَبِيهِ\n' +
        'أَيْنَ الْمُنْتَظَرُ لِإِقَامَةِ الْأَمْرِ وَالْقِسْطِ\n' +
        'أَيْنَ الْمُرْتَقَبُ لِإِزَالَةِ الْجَوْرِ وَالْعُدْوَانِ',
      translations: {
        en: 'Where is the one who will avenge his father? Where is the awaited one who will establish justice? Where is the one hoped for to remove oppression and tyranny…',
        ur: 'اپنے والدؑ کے خون کا بدلہ لینے والا کہاں ہے؟ عدل قائم کرنے والا منتظر امام کہاں ہے؟',
      },
    },
    {
      id: 'supplication',
      title: { en: 'Supplication', ur: 'دعا' },
      arabic:
        'اللّهُمَّ إِنَّا نَرْغَبُ إِلَيْكَ فِي وَلِيٍّ\n' +
        'يُقِيمُ الْحَقَّ وَيُمْحِي الْبَاطِلَ\n' +
        'وَيُقِيمُ الْقِسْطَ وَيُمْحِي الْجَوْرَ',
      translations: {
        en: 'O Allah, we turn to You desiring a guardian who establishes truth and eradicates falsehood, who establishes justice and eradicates oppression…',
        ur: 'اے اللہ! ہم تجھ سے ایک ولی چاہتے ہیں جو حق قائم کرے اور باطل مٹائے…',
      },
    },
    {
      id: 'blessings',
      title: { en: 'Blessings on Ahlul Bayt', ur: 'درود' },
      arabic:
        'اللّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ\n' +
        'الْأَئِمَّةِ الْهُدَاةِ الْمَهْدِيِّينَ\n' +
        'وَعَجِّلْ فَرَجَهُمْ',
      translations: {
        en: 'O Allah, send blessings upon Muhammad and the family of Muhammad — the guiding, rightly guided Imams — and hasten their relief.',
        ur: 'اے اللہ! محمدؐ و guided ائمہؑ پر درود بھیج اور ان کے فرج میں تعجیل فرما۔',
      },
    },
    {
      id: 'closing',
      title: { en: 'Closing', ur: 'اختتام' },
      arabic:
        'آمِينَ رَبَّ الْعَالَمِينَ\n' +
        'وَحَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ\n' +
        'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ الْعَلِيِّ الْعَظِيمِ',
      translations: {
        en: 'Amen, Lord of the worlds. Allah is sufficient for us and He is the best disposer of affairs. There is no power nor strength except through Allah, the Most High, the Most Great.',
        ur: 'آمین یا رب العالمین۔ حسبنا اللہ و نعم الوکیل۔',
      },
    },
  ],
};
