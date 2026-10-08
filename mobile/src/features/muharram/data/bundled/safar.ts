import type { SafarEvent } from '../../types';
import { cite } from './citations';

export const SAFAR_EVENTS: SafarEvent[] = [
  {
    id: 'safar_d1',
    safarDay: 1,
    title: { en: 'Beginning of Safar — grief continues', ur: 'صفر کا آغاز — غم جاری' },
    narrative: {
      en: 'The second Hijri month opens as the Ahlul Bayt continue their journey of captivity and mourning.',
      ur: 'دوسرا ہجری مہینہ شروع ہوتا ہے جب اہل بیت اسیری و سوگ کا سفر جاری رکھتے ہیں۔',
    },
    significance: {
      en: 'Mourning for Husayn (as) extends beyond Muharram into Safar.',
      ur: 'حسینؑ پر سوگ محرم سے آگے صفر میں بھی جاری رہتا ہے۔',
    },
    citations: [
      cite('Bihar al-Anwar', { volume: 45, page: '128', scholar: 'Allama Majlisi', unverified: true }),
    ],
    relatedMasoomeenIds: ['masoom_husayn', 'masoom_zainulabideen'],
  },
  {
    id: 'safar_d7',
    safarDay: 7,
    title: { en: 'Shahadat of Imam Hasan (as)', ur: 'شہادت امام حسنؑ' },
    narrative: {
      en: '7 Safar marks the martyrdom of Imam Hasan al-Mujtaba (as), elder brother of Imam Husayn (as).',
      ur: '۷ صفر امام حسن مجتبیؑ کی شہادت کا دن ہے۔',
    },
    significance: {
      en: 'The two brothers who bore the weight of the Ummah are commemorated in succession.',
      ur: 'وہ دو بھائی جنہوں نے امت کا بوجھ اٹھایا، پے در پے یاد کیے جاتے ہیں۔',
    },
    citations: [
      cite('Kitab al-Irshad', { volume: 2, page: '1-30', scholar: 'Shaykh al-Mufid' }),
      cite('Bihar al-Anwar', { volume: 44, page: '1-20', scholar: 'Allama Majlisi' }),
    ],
    relatedMasoomeenIds: ['masoom_hasan'],
  },
  {
    id: 'safar_d20',
    safarDay: 20,
    title: { en: 'Arbaeen — 40 days after Ashura', ur: 'اربعین — عاشورا کے ۴۰ دن بعد' },
    narrative: {
      en: 'Forty days after Ashura, Jabir ibn Abdullah visits Karbala. Millions now walk this path annually.',
      ur: 'عاشورا کے چالیس دن بعد جابر کربلا تشریف لاتے ہیں۔ آج لاکھوں یہ راستہ چلتے ہیں۔',
    },
    significance: {
      en: 'Arbaeen is the culmination of mourning and the renewal of allegiance to Imam Husayn (as).',
      ur: 'اربعین عزاداری کی تکمیل اور امام حسینؑ سے تجدیدِ بیعت ہے۔',
    },
    citations: [
      cite('Kamil al-Ziyarat', { chapter: 'Ziyarat Arbaeen', scholar: 'Ibn Qulawayh' }),
      cite('Mafatih al-Jinan', { chapter: 'Amaal of Arbaeen', scholar: 'Shaykh Abbas Qummi' }),
    ],
    relatedMasoomeenIds: ['masoom_husayn'],
  },
  {
    id: 'safar_d28',
    safarDay: 28,
    title: { en: 'Shahadat of Prophet Muhammad (s)', ur: 'شہادت نبیؐ محمد' },
    narrative: {
      en: '28 Safar is widely observed as the passing of the Prophet Muhammad (s), though some traditions differ.',
      ur: '۲۸ صفر کو نبیؐ کی وفات منائی جاتی ہے، اگرچہ روایات میں اختلاف ہے۔',
    },
    significance: {
      en: 'The grief of Safar connects the loss of the Prophet (s) with the tragedy of his household.',
      ur: 'صفر کا غم نبیؐ کی رحلت کو اہل بیت کی مصیبت سے جوڑتا ہے۔',
    },
    citations: [
      cite('Bihar al-Anwar', { volume: 22, page: '450', scholar: 'Allama Majlisi', unverified: true }),
    ],
    relatedMasoomeenIds: ['masoom_prophet'],
  },
  {
    id: 'safar_d29',
    safarDay: 29,
    title: { en: 'Shahadat of Imam Reza (as)', ur: 'شہادت امام رضاؑ' },
    narrative: {
      en: '29 Safar commemorates the martyrdom of Imam Ali al-Rida (as) in Tus, Persia.',
      ur: '۲۹ صفر امام علی رضاؑ کی شہادت منائی جاتی ہے۔',
    },
    significance: {
      en: 'The eighth Imam\'s martyrdom reminds the Ummah of ongoing oppression against the Prophet\'s heirs.',
      ur: 'آٹھویں امام کی شہادت نبیؑ کے وارثوں پر مسلط ظلم کی یاد دہانی ہے۔',
    },
    citations: [
      cite('Kitab al-Irshad', { volume: 2, page: '200-220', scholar: 'Shaykh al-Mufid' }),
    ],
    relatedMasoomeenIds: ['masoom_reza'],
  },
];
