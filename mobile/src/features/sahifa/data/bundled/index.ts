import type { SahifaBundle, SahifaId } from '../../types';
import { getSahifaMetaByNumber } from '../../constants/catalog';
import { sahifaId } from '../../constants/titles';
import { SAHIFA_001 } from './dua01';

function bundle(n: number, sections: SahifaBundle['sections']): SahifaBundle {
  const meta = getSahifaMetaByNumber(n)!;
  return { meta, bundleVersion: 1, sections };
}

const SAHIFA_002 = bundle(2, [
  {
    id: 'opening',
    title: { en: 'Salutations', ur: 'درود' },
    arabic:
      'اللّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ\n' +
      'الْأَوْصِيَاءِ الْمَرْضِيِّينَ الْمَظْلُومِينَ',
    translations: {
      en: 'O Allah, send blessings upon Muhammad and the family of Muhammad — the approved, wronged successors.',
      ur: 'اے اللہ! محمدؐ و آل محمدؑ — مرضی والے، مظلوم وصیوں — پر درود بھیج۔',
    },
  },
  {
    id: 'body',
    title: { en: 'Blessings', ur: 'برکتیں' },
    arabic:
      'اللّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ خَاتَمِ النَّبِيِّينَ\n' +
      'وَعَلَىٰ آلِهِ الطَّاهِرِينَ الطَّيِّبِينَ',
    translations: {
      en: 'O Allah, send blessings upon Muhammad, the seal of the Prophets, and upon his pure, good family.',
      ur: 'اے اللہ! خاتم النبیینؐ محمدؐ اور ان کے پاک و طیب گھرانے پر درود بھیج۔',
    },
  },
]);

const SAHIFA_003 = bundle(3, [
  {
    id: 'morning',
    title: { en: 'Morning', ur: 'صبح' },
    arabic:
      'اللّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ\n' +
      'أَنَّكَ أَنْتَ اللّٰهُ لَا إِلَٰهَ إِلَّا أَنْتَ وَحْدَكَ',
    translations: {
      en: 'O Allah, this morning I call You to witness, and the bearers of Your Throne, that You are Allah — there is no god but You alone.',
      ur: 'اے اللہ! میں نے صبح کی اور تجھے گواہ بنایا کہ تو ہی اللہ ہے، تیرے سوا کوئی معبود نہیں۔',
    },
  },
  {
    id: 'evening',
    title: { en: 'Evening', ur: 'شام' },
    arabic:
      'اللّهُمَّ إِنِّي أَمْسَيْتُ لَكَ وَبِكَ وَإِلَيْكَ\n' +
      'فَقَبِّلْنِي فِيمَا أَمْسَيْتُ بِقَبُولٍ حَسَنٍ',
    translations: {
      en: 'O Allah, this evening I belong to You, through You, and toward You — so accept my evening with a beautiful acceptance.',
      ur: 'اے اللہ! میں نے شام کی، تجھے اور تیری طرف، پس میری شام کو قبول فرما۔',
    },
  },
]);

const SAHIFA_011 = bundle(11, [
  {
    id: 'opening',
    title: { en: 'Seeking Forgiveness', ur: 'استغفار' },
    arabic:
      'اللّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ\n' +
      'أَنْ تَغْفِرَ لِي ذُنُوبِي كُلَّهَا',
    translations: {
      en: 'O Allah, I ask You by Your mercy which encompasses all things to forgive all my sins.',
      ur: 'اے اللہ! میں تیری وسعت والی رحمت کے وسیلے سے اپنے تمام گناہ معاف فرمانے کو کہتا ہوں۔',
    },
  },
  {
    id: 'repentance',
    title: { en: 'Repentance', ur: 'توبہ' },
    arabic:
      'اللّهُمَّ إِنِّي أَسْأَلُكَ تَوْبَةً قَبْلَ الْمَوْتِ\n' +
      'وَرَحْمَةً عِنْدَ الْمَوْتِ\n' +
      'وَمَغْفِرَةً بَعْدَ الْمَوْتِ',
    translations: {
      en: 'O Allah, I ask You for repentance before death, mercy at death, and forgiveness after death.',
      ur: 'اے اللہ! میں تجھ سے موت سے پہلے توبہ، موت کے وقت رحمت، اور موت کے بعد مغفرت مانگتا ہوں۔',
    },
  },
]);

const SAHIFA_015 = bundle(15, [
  {
    id: 'refuge',
    title: { en: 'Taking Refuge', ur: 'پناہ' },
    arabic:
      'اللّهُمَّ إِنِّي أَلْجَأُ إِلَيْكَ\n' +
      'وَأَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي\n' +
      'وَشَرِّ الشَّيْطَانِ وَشِرْكِهِ',
    translations: {
      en: 'O Allah, I seek refuge with You and take asylum in You from the evil of my soul, the evil of Satan and his polytheism.',
      ur: 'اے اللہ! میں تیری پناہ میں آتا ہوں، اپنے نفس، شیطان اور شرک کے شر سے پناہ مانگتا ہوں۔',
    },
  },
  {
    id: 'protection',
    title: { en: 'Protection', ur: 'حفاظت' },
    arabic:
      'اللّهُمَّ احْفَظْنِي بِحِفْظِكَ\n' +
      'وَاجْعَلْنِي فِي كَنَفِكَ وَضَمَانِكَ',
    translations: {
      en: 'O Allah, protect me with Your protection and place me in Your care and guarantee.',
      ur: 'اے اللہ! اپنی حفاظت میں رکھ، مجھے اپنے کنف و ضمان میں شامل فرما۔',
    },
  },
]);

const SAHIFA_020 = bundle(20, [
  {
    id: 'distress',
    title: { en: 'In Distress', ur: 'مصیبت' },
    arabic:
      'اللّهُمَّ رَحْمَتَكَ أَرْجُو فَلَا تَكِلْنِي إِلَىٰ نَفْسِي طَرْفَةَ عَيْنٍ\n' +
      'وَأَصْلِحْ لِي شَأْنِي كُلَّهُ',
    translations: {
      en: 'O Allah, I hope for Your mercy — do not leave me to myself for the blink of an eye, and set all my affairs aright.',
      ur: 'اے اللہ! میں تیری رحمت کا امیدوار ہوں، مجھے پل بھر کے لیے بھی اپنے نفس پر مت چھوڑ، میرے تمام معاملات درست فرما۔',
    },
  },
  {
    id: 'relief',
    title: { en: 'Seeking Relief', ur: 'رفاہ' },
    arabic:
      'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ\n' +
      'إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    translations: {
      en: 'There is no god but You — glory be to You! Indeed I was among the wrongdoers.',
      ur: 'تیرے سوا کوئی معبود نہیں، تو پاک ہے! بے شک میں ظالموں میں سے تھا۔',
    },
  },
]);

const SAHIFA_031 = bundle(31, [
  {
    id: 'friday',
    title: { en: 'Friday Supplication', ur: 'جمعہ کی دعا' },
    arabic:
      'اللّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ\n' +
      'الْأَوْصِيَاءِ الْمَرْضِيِّينَ',
    translations: {
      en: 'O Allah, send blessings upon Muhammad and the family of Muhammad — the approved successors.',
      ur: 'اے اللہ! محمدؐ و آل محمدؑ — مرضی والے وصیوں — پر درود بھیج۔',
    },
  },
  {
    id: 'community',
    title: { en: 'For the Community', ur: 'امت کے لیے' },
    arabic:
      'اللّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ مَا فِي هٰذَا الْيَوْمِ\n' +
      'وَخَيْرَ مَا بَعْدَهُ\n' +
      'وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هٰذَا الْيَوْمِ',
    translations: {
      en: 'O Allah, I ask You for the good of this day and the good after it, and I seek refuge in You from the evil of this day.',
      ur: 'اے اللہ! میں آج اور اس کے بعد کی بھلائی مانگتا ہوں، آج کے شر سے پناہ مانگتا ہوں۔',
    },
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
  },
]);

const SAHIFA_054 = bundle(54, [
  {
    id: 'parting',
    title: { en: 'Parting from the World', ur: 'دنیا سے رخصتی' },
    arabic:
      'اللّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْخَرَاجِ\n' +
      'وَخَيْرَ مَا بَعْدَ الْخَرَاجِ',
    translations: {
      en: 'O Allah, I ask You for the best departure and the best of what comes after departure.',
      ur: 'اے اللہ! میں تجھ سے بہترین رخصتی اور رخصتی کے بعد کی بھلائی مانگتا ہوں۔',
    },
  },
  {
    id: 'farewell',
    title: { en: 'Farewell', ur: 'الوداع' },
    arabic:
      'اللّهُمَّ ارْزُقْنِي حُسْنَ الْخَاتِمَةِ\n' +
      'وَاجْعَلْ آخِرَ كَلَامِي لَا إِلَٰهَ إِلَّا اللّٰهُ',
    translations: {
      en: 'O Allah, grant me a good ending and make my last words "There is no god but Allah."',
      ur: 'اے اللہ! مجھے حسن خاتمہ عطا فرما، میرے آخری کلمات "لا الہ الا اللہ" ہوں۔',
    },
  },
]);

const SAHIFA_008 = bundle(8, [
  {
    id: 'sleep',
    title: { en: 'Before Sleep', ur: 'سونے سے پہلے' },
    arabic:
      'اللّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا\n' +
      'وَبِكَ أَصْبِحُ وَبِكَ أَمْسِي',
    translations: {
      en: 'O Allah, in Your name I die and live; by You I rise in the morning and by You I enter the evening.',
      ur: 'اے اللہ! تیرے نام سے میں مرتا اور جیتا ہوں، تیرے ہی سے صبح و شام کرتا ہوں۔',
    },
  },
  {
    id: 'protection',
    title: { en: 'Protection', ur: 'حفاظت' },
    arabic:
      'اللّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي\n' +
      'وَعَنْ يَمِينِي وَعَنْ شِمَالِي',
    translations: {
      en: 'O Allah, protect me from before me and behind me, from my right and from my left.',
      ur: 'اے اللہ! مجھے آگے، پیچھے، دائیں اور بائیں سے محفوظ رکھ۔',
    },
  },
]);

const SAHIFA_024 = bundle(24, [
  {
    id: 'parents',
    title: { en: 'For Parents', ur: 'والدین کے لیے' },
    arabic:
      'اللّهُمَّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا\n' +
      'وَاغْفِرْ لَهُمَا وَارْحَمْهُمَا',
    translations: {
      en: 'O Allah, have mercy on them as they raised me when I was small; forgive them and have mercy on them.',
      ur: 'اے اللہ! جیسے انہوں نے مجھے بچپن میں پالا، ان پر رحم فرما، انہیں بخش دے۔',
    },
  },
  {
    id: 'mercy',
    title: { en: 'Mercy', ur: 'رحمت' },
    arabic:
      'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    translations: {
      en: 'My Lord, have mercy on them as they raised me when I was small.',
      ur: 'اے میرے رب! جیسے انہوں نے مجھے بچپن میں پالا، ان پر رحم فرما۔',
    },
  },
]);

const SAHIFA_047 = bundle(47, [
  {
    id: 'community',
    title: { en: 'For the Community', ur: 'امت کے لیے' },
    arabic:
      'اللّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ\n' +
      'وَاغْفِرْ لِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ',
    translations: {
      en: 'O Allah, send blessings upon Muhammad and his family, and forgive the believing men and women.',
      ur: 'اے اللہ! محمدؐ و آل محمدؑ پر درود بھیج، مومن مردوں اور عورتوں کو بخش دے۔',
    },
  },
  {
    id: 'guidance',
    title: { en: 'Guidance', ur: 'ہدایت' },
    arabic:
      'اللّهُمَّ اهْدِنَا بِأَحْسَنِ هُدًى\n' +
      'وَعَافِنَا بِأَفْضَلِ عَافِيَةٍ',
    translations: {
      en: 'O Allah, guide us with the best guidance and grant us the finest well-being.',
      ur: 'اے اللہ! بہترین ہدایت سے ہمیں ہدایت فرما، بہترین عافیت عطا فرما۔',
    },
  },
]);

export const FULL_BUNDLES: Record<string, SahifaBundle> = {
  [sahifaId(1)]: SAHIFA_001,
  [sahifaId(2)]: SAHIFA_002,
  [sahifaId(3)]: SAHIFA_003,
  [sahifaId(8)]: SAHIFA_008,
  [sahifaId(11)]: SAHIFA_011,
  [sahifaId(15)]: SAHIFA_015,
  [sahifaId(20)]: SAHIFA_020,
  [sahifaId(24)]: SAHIFA_024,
  [sahifaId(31)]: SAHIFA_031,
  [sahifaId(47)]: SAHIFA_047,
  [sahifaId(54)]: SAHIFA_054,
};

export function createStubBundle(number: number): SahifaBundle {
  const meta = getSahifaMetaByNumber(number)!;
  return {
    meta,
    bundleVersion: 1,
    sections: [
      {
        id: 'opening',
        title: { en: 'Opening', ur: 'آغاز' },
        arabic:
          'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n' +
          'الْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ',
        translations: {
          en: `Opening of Supplication ${number}: ${meta.titles.en}. Full text available in bundled update.`,
          ur: `دعا نمبر ${number}: ${meta.titles.ur} — مکمل متن جلد آ رہا ہے۔`,
        },
      },
      {
        id: 'supplication',
        title: { en: 'Supplication', ur: 'دعا' },
        arabic:
          'اللّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ\n' +
          'وَاجْعَلْنِي مِنْ أَهْلِ طَاعَتِكَ',
        translations: {
          en: 'O Allah, send blessings upon Muhammad and his family, and make me among the people of Your obedience.',
          ur: 'اے اللہ! محمدؐ و آل محمدؑ پر درود بھیج، مجھے اپنی اطاعت والوں میں شامل فرما۔',
        },
      },
    ],
  };
}

export function getAllBundles(): Record<SahifaId, SahifaBundle> {
  const result = { ...FULL_BUNDLES } as Record<SahifaId, SahifaBundle>;
  for (let n = 1; n <= 54; n++) {
    const id = sahifaId(n);
    if (!result[id]) {
      result[id] = createStubBundle(n);
    }
  }
  return result;
}

export const BUNDLED_SAHIFA = getAllBundles();
