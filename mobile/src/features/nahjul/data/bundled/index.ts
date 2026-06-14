import type { NahjulBundle, NahjulCategory, NahjulId } from '../../types';
import { getNahjulMetaByNumber } from '../../constants/catalog';
import { NAHJUL_ENTRIES, nahjulId } from '../../constants/entries';

function bundle(category: NahjulCategory, n: number, sections: NahjulBundle['sections']): NahjulBundle {
  const meta = getNahjulMetaByNumber(category, n)!;
  return { meta, bundleVersion: 1, sections };
}

const FULL: NahjulBundle[] = [
  bundle('sermon', 1, [
    {
      id: 'praise',
      title: { en: 'Praise of Allah', ur: 'حمدِ باری' },
      arabic:
        'الْحَمْدُ لِلّٰهِ الَّذِي بَسَطَ الْأَرْضَ وَنَصَبَ الْجِبَالَ\n' +
        'وَجَعَلَ الظُّلُمَاتِ وَالْأَنْوَارَ',
      translations: {
        en: 'Praise be to Allah who spread out the earth and set up mountains, and made darkness and light.',
        ur: 'حمد ہے اللہ کی جس نے زمین بچھائی، پہاڑ کھڑے کیے، اندھیرے اور روشنی پیدا کی۔',
      },
    },
    {
      id: 'creation',
      title: { en: 'On Creation', ur: 'تخلیق پر' },
      arabic:
        'ثُمَّ أَنْشَأَ السَّمَاءَ وَالْأَرْضَ بِحُكْمَةٍ\n' +
        'لِيَعْلَمَ عِبَادُهُ قُدْرَتَهُ وَحِكْمَتَهُ',
      translations: {
        en: 'Then He created the heavens and the earth with wisdom, so His servants may know His power and wisdom.',
        ur: 'پھر آسمان و زمین کو حکمت سے پیدا کیا تاکہ بندے اس کی قدرت و حکمت جانیں۔',
      },
    },
  ]),
  bundle('sermon', 2, [
    {
      id: 'muttaqeen',
      title: { en: 'The Pious', ur: 'متقین' },
      arabic:
        'هُمْ أُمَنَاءُ اللّٰهِ فِي أَرْضِهِ\n' +
        'وَدُعَاةٌ إِلَىٰ دِينِهِ',
      translations: {
        en: 'They are the trustees of Allah on His earth and callers to His religion.',
        ur: 'وہ اللہ کے نائب ہیں زمین پر اور اس کے دین کی طرف بلاتے ہیں۔',
      },
    },
    {
      id: 'qualities',
      title: { en: 'Their Qualities', ur: 'ان کی صفات' },
      arabic:
        'قَدْ أَسْكَنُواٰ أَجْسَادَهُمْ فِي الدُّنْيَا\n' +
        'وَأَحْيَوْاٰ أَرْوَاحَهُمْ بِالْآخِرَةِ',
      translations: {
        en: 'They have settled their bodies in this world while their souls live for the hereafter.',
        ur: 'انہوں نے دنیا میں جسم ٹھہرائے اور آخرت کے لیے روحیں زندہ رکھی ہیں۔',
      },
    },
  ]),
  bundle('sermon', 3, [
    {
      id: 'shiqshiqiyyah',
      title: { en: 'Al-Shiqshiqiyyah', ur: 'الشقشیقیہ' },
      arabic:
        'وَاللّٰهِ لَقَدْ تَلَقَّيْتُهَا لَقْلَقَةً\n' +
        'وَرَدَّدْتُهَا حَوْلَ فِرَاشِي',
      translations: {
        en: 'By Allah, I was made to accept it reluctantly, and I rolled with it around my bed.',
        ur: 'قسم ہے اللہ کی، مجھے یہ رٹ لگائی گئی اور میں بستر پر اس کے ساتھ لڑتا رہا۔',
      },
    },
  ]),
  bundle('sermon', 24, [
    {
      id: 'quran',
      title: { en: 'The Quran', ur: 'قرآن' },
      arabic:
        'الْقُرْآنُ عَهْدُ اللّٰهِ إِلَىٰ خَلْقِهِ\n' +
        'وَحَبْلُهُ الْمَمْدُودُ بَيْنَ السَّمَاءِ وَالْأَرْضِ',
      translations: {
        en: 'The Quran is the covenant of Allah to His creation and His rope stretched between heaven and earth.',
        ur: 'قرآن اللہ کا عہد ہے اپنی مخلوق سے اور اس کی رسی ہے آسمان و زمین کے درمیان۔',
      },
    },
  ]),
  bundle('sermon', 109, [
    {
      id: 'zuhd',
      title: { en: 'Asceticism', ur: 'زہد' },
      arabic:
        'إِنَّ الدُّنْيَا دَارُ عُبُورٍ\n' +
        'وَلَيْسَتْ دَارُ إِقَامَةٍ',
      translations: {
        en: 'This world is a place of transit, not a place of rest.',
        ur: 'یہ دنیا راہگزر ہے، ٹھہرنے کی جگہ نہیں۔',
      },
    },
  ]),
  bundle('letter', 1, [
    {
      id: 'opening',
      title: { en: 'Opening', ur: 'آغاز' },
      arabic:
        'مِنْ عَبْدِ اللّٰهِ عَلِيٍّ بْنِ أَبِي طَالِبٍ\n' +
        'إِلَىٰ مُعَاوِيَةَ بْنِ أَبِي سُفْيَانَ',
      translations: {
        en: 'From the servant of Allah, Ali ibn Abi Talib, to Muawiyah ibn Abi Sufyan.',
        ur: 'اللہ کے بندے علیؑ ابنِ ابی طالبؑ سے معاویہ بن ابی سفیان کو۔',
      },
    },
    {
      id: 'counsel',
      title: { en: 'Counsel', ur: 'نصیحت' },
      arabic:
        'أَمَّا بَعْدُ فَإِنَّ الْحَقَّ لَا يُعْرَفُ بِالرِّجَالِ\n' +
        'اعْرِفِ الْحَقَّ تَعْرِفْ أَهْلَهُ',
      translations: {
        en: 'Know that truth is not known through men — know the truth and you will know its people.',
        ur: 'سنو! حق لوگوں سے نہیں پہچانا جاتا — حق کو پہچانو تو اہلِ حق پہچان لو گے۔',
      },
    },
  ]),
  bundle('letter', 31, [
    {
      id: 'governance',
      title: { en: 'On Governance', ur: 'حکمرانی' },
      arabic:
        'أَوْصِيكَ يَا مَالِكُ أَنْ تَخُصَّ نَفْسَكَ\n' +
        'بِخَاصَّةِ الْخِلْقَةِ الْبَشَرِيَّةِ',
      translations: {
        en: 'I advise you, O Malik, to develop in yourself the human qualities of compassion.',
        ur: 'اے مالک! میں تجھے نصیحت کرتا ہوں کہ اپنے اندر انسانی رحمدلی پیدا کرو۔',
      },
    },
    {
      id: 'justice',
      title: { en: 'Justice', ur: 'عدل' },
      arabic:
        'اجْعَلْ لِلنَّاسِ عِنْدَكَ مَنْزِلَةً\n' +
        'وَاجْعَلْ لِلْخَيْرِ عِنْدَكَ مَنْزِلَةً',
      translations: {
        en: 'Give people their due station with you, and give goodness its due station.',
        ur: 'لوگوں کو ان کا حق مقام دو اور بھلائی کو اس کا مقام دو۔',
      },
    },
    {
      id: 'people',
      title: { en: 'Love for People', ur: 'محبتِ خلق' },
      arabic:
        'أَحْبِبْ لِلنَّاسِ مَا تُحِبُّ لِنَفْسِكَ\n' +
        'وَاكْرَهْ لَهُمْ مَا تَكْرَهُ لَهَا',
      translations: {
        en: 'Love for people what you love for yourself, and dislike for them what you dislike for yourself.',
        ur: 'لوگوں کے لیے وہی پسند کرو جو اپنے لیے، اور وہی ناپسند جو اپنے لیے۔',
      },
    },
  ]),
  bundle('letter', 47, [
    {
      id: 'counsel',
      title: { en: 'To Hasan (AS)', ur: 'حسنؑ کو' },
      arabic:
        'يَا بُنَيَّ إِنَّ الدُّنْيَا دَارُ عُبُورٍ\n' +
        'فَخُذْ مِنْهَا لِآخِرَتِكَ',
      translations: {
        en: 'My son, the world is a place of transit — take from it for your hereafter.',
        ur: 'بیٹا، دنیا راہگزر ہے — اپنی آخرت کے لیے اس سے لے لو۔',
      },
    },
  ]),
  bundle('letter', 53, [
    {
      id: 'ashura',
      title: { en: 'Before Ashura', ur: 'عاشورا سے پہلے' },
      arabic:
        'يَا عُمَيْرُ إِنَّ الْمَوْتَ جِسْرٌ\n' +
        'يُوصِلُ الْحَبِيبَ إِلَىٰ الْحَبِيبِ',
      translations: {
        en: 'O Umayr, death is a bridge that takes the friend to the Friend.',
        ur: 'اے عمیر! موت پل ہے جو دوست کو دوست (اللہ) تک لے جاتی ہے۔',
      },
    },
  ]),
  ...([1, 2, 3, 4, 5, 10, 15, 20, 25, 30] as const).map((n) => {
    const meta = getNahjulMetaByNumber('saying', n)!;
    return bundle('saying', n, [
      {
        id: 'quote',
        title: { en: 'Quote', ur: 'قول' },
        arabic: meta.titles.ar,
        translations: {
          en: meta.excerpt.en,
          ur: meta.excerpt.ur,
        },
      },
    ]);
  }),
];

export function createStubBundle(category: NahjulCategory, number: number): NahjulBundle {
  const meta = getNahjulMetaByNumber(category, number)!;
  return {
    meta,
    bundleVersion: 1,
    sections: [
      {
        id: 'opening',
        title: { en: 'Opening', ur: 'آغاز' },
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        translations: {
          en: `${meta.titles.en} — full text coming in a future update.`,
          ur: `${meta.titles.ur} — مکمل متن جلد آ رہا ہے۔`,
        },
      },
      {
        id: 'excerpt',
        title: { en: 'Excerpt', ur: 'اقتباس' },
        arabic: meta.titles.ar,
        translations: {
          en: meta.excerpt.en,
          ur: meta.excerpt.ur,
        },
      },
    ],
  };
}

export function getAllBundles(): Record<NahjulId, NahjulBundle> {
  const result = {} as Record<NahjulId, NahjulBundle>;
  for (const b of FULL) {
    result[b.meta.id] = b;
  }
  for (const entry of NAHJUL_ENTRIES) {
    const id = nahjulId(entry.category, entry.number);
    if (!result[id]) {
      result[id] = createStubBundle(entry.category, entry.number);
    }
  }
  return result;
}

export const BUNDLED_NAHJUL = getAllBundles();
