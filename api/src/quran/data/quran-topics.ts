export interface QuranTopicEntry {
  id: string;
  labels: { en: string; ur: string; ar: string };
  synonyms: string[];
  ayahRefs: string[];
  summary: { en: string; ur: string };
}

/** Keep in sync with mobile/src/features/quran/search/data/quranTopics.ts */
export const QURAN_TOPIC_INDEX: QuranTopicEntry[] = [
  {
    id: 'patience',
    labels: { en: 'Patience (Sabr)', ur: 'صبر', ar: 'الصبر' },
    synonyms: [
      'patience', 'sabr', 'صبر', 'صبر کرنا', 'persevere', 'endure', 'steadfast',
      'forbearance', 'remain firm', 'trust in Allah', 'hardship', 'trial', 'test',
    ],
    ayahRefs: ['2:153', '2:155', '2:156', '2:157', '3:200', '8:46', '11:115', '16:96', '31:17', '39:10', '41:35', '46:35', '70:5', '103:3'],
    summary: {
      en: 'Verses on steadfastness through trials and trusting Allah.',
      ur: 'آزمائشوں میں ثابت قدم رہنے اور اللہ پر بھروسہ کرنے والے آیات۔',
    },
  },
  {
    id: 'imam_ali',
    labels: { en: 'Imam Ali (AS)', ur: 'امام علیؑ', ar: 'الإمام علي' },
    synonyms: [
      'imam ali', 'ali ibn abi talib', 'amir al-muminin', 'mawla', 'wilaya',
      'guardianship', 'imam ali as', 'امام علی', ' علی ', 'ولایت', 'مولا',
      'ahlulbayt', 'ahl al-bayt', 'panj tan', 'hazrat ali',
    ],
    ayahRefs: ['5:67', '5:3', '5:55', '33:33', '42:23', '61:6', '98:7', '11:17', '2:269', '4:59'],
    summary: {
      en: 'Verses linked to wilayah, Ahlul Bayt, and Imam Ali (AS) in Shia tafsir.',
      ur: 'ولایت، اہل بیت، اور امام علیؑ سے منسلک آیات (شیعی تفسیر)۔',
    },
  },
  {
    id: 'charity',
    labels: { en: 'Charity (Sadaqah)', ur: 'صدقہ و خیرات', ar: 'الصدقة' },
    synonyms: [
      'charity', 'sadaqah', 'sadaqa', 'donate', 'giving', 'spending in way of Allah',
      'صدقہ', 'خیرات', 'زکوٰة', 'zakat', 'alms', 'help the poor', 'generosity',
      'spend', 'infaaq', 'economic justice',
    ],
    ayahRefs: ['2:261', '2:262', '2:265', '2:267', '2:271', '2:276', '2:277', '57:18', '57:7', '9:60', '47:38', '76:8', '76:9', '90:14'],
    summary: {
      en: "Verses encouraging charity, sadaqah, and spending for Allah's sake.",
      ur: 'صدقہ، خیرات، اور اللہ کی راہ میں خرچ کرنے کی آیات۔',
    },
  },
  {
    id: 'ahlulbayt',
    labels: { en: 'Ahlul Bayt (AS)', ur: 'اہل بیتؑ', ar: 'أهل البيت' },
    synonyms: [
      'ahlulbayt', 'ahl al-bayt', 'household of prophet', 'panjetan', 'five pure ones',
      'fatima', 'imam hassan', 'imam hussain', 'اهل البیت', 'اہل بیت', 'پانچ تن',
      'purification verse', 'tathir', '33:33',
    ],
    ayahRefs: ['33:33', '42:23', '3:61', '5:55', '5:67', '2:124', '4:54'],
    summary: {
      en: 'Verses honoring the purified household of the Prophet (SA).',
      ur: 'نبیؐ کے پاک گھرانے کی تعظیم سے متعلق آیات۔',
    },
  },
  {
    id: 'imam_hussain',
    labels: { en: 'Imam Hussain (AS) & Karbala', ur: 'امام حسینؑ', ar: 'الإمام الحسين' },
    synonyms: [
      'imam hussain', 'husayn', 'karbala', 'ashura', 'martyrdom', 'shahadat',
      'امام حسین', 'کربلا', 'عاشور', 'ظلم', 'oppression', 'stand against tyranny',
    ],
    ayahRefs: ['2:154', '2:155', '3:169', '3:170', '3:195', '22:58', '22:59', '41:46', '42:23'],
    summary: {
      en: 'Verses on martyrdom, standing against injustice, and divine reward for the steadfast.',
      ur: 'شہادت، ظلم کے خلاف کھڑے ہونے، اور ثابت قدموں کے اجر کی آیات۔',
    },
  },
  {
    id: 'prayer',
    labels: { en: 'Prayer (Salah)', ur: 'نماز', ar: 'الصلاة' },
    synonyms: ['prayer', 'salah', 'salat', 'namaz', 'نماز', 'صلوٰة', 'establish prayer', 'worship'],
    ayahRefs: ['2:43', '2:45', '2:153', '2:238', '4:103', '11:114', '17:78', '20:14', '29:45', '70:23'],
    summary: { en: 'Verses commanding and describing salah.', ur: 'نماز کے حکم اور فضیلت کی آیات۔' },
  },
  {
    id: 'gratitude',
    labels: { en: 'Gratitude (Shukr)', ur: 'شکر', ar: 'الشكر' },
    synonyms: ['gratitude', 'thankful', 'shukr', 'شکر', 'thanks', 'blessings', 'count favors'],
    ayahRefs: ['2:152', '14:7', '16:114', '31:12', '31:14', '55:13', '76:3'],
    summary: { en: 'Verses on thanking Allah for His favors.', ur: 'اللہ کے احسانوں کا شکر کرنے کی آیات۔' },
  },
  {
    id: 'forgiveness',
    labels: { en: 'Forgiveness', ur: 'معافی', ar: 'المغفرة' },
    synonyms: ['forgiveness', 'forgive', 'mercy', 'repent', 'tawbah', 'معافی', 'توبہ', 'رحم'],
    ayahRefs: ['2:199', '2:286', '3:135', '3:159', '7:23', '39:53', '42:25', '66:8'],
    summary: { en: 'Verses on divine mercy, repentance, and forgiving others.', ur: 'اللہ کی رحمت، توبہ، اور معاف کرنے کی آیات۔' },
  },
  {
    id: 'justice',
    labels: { en: 'Justice (Adl)', ur: 'انصاف', ar: 'العدل' },
    synonyms: ['justice', 'fairness', 'adl', 'انصاف', 'عدل', 'oppression', 'zulm', 'ظلم', 'equity'],
    ayahRefs: ['4:58', '4:135', '5:8', '16:90', '42:15', '57:25', '7:29'],
    summary: { en: 'Verses commanding justice and forbidding oppression.', ur: 'انصاف کے حکم اور ظلم سے منع کی آیات۔' },
  },
  {
    id: 'knowledge',
    labels: { en: 'Knowledge (Ilm)', ur: 'علم', ar: 'العلم' },
    synonyms: ['knowledge', 'ilm', 'learn', 'wisdom', 'hikmah', 'علم', 'حکمت', 'reflect', 'think'],
    ayahRefs: ['2:269', '20:114', '39:9', '58:11', '96:1', '96:5', '3:7'],
    summary: { en: 'Verses elevating knowledge and reflection.', ur: 'علم اور غور و فکر کی فضیلت کی آیات۔' },
  },
  {
    id: 'parents',
    labels: { en: 'Parents', ur: 'والدین', ar: 'الوالدين' },
    synonyms: ['parents', 'mother', 'father', 'والدین', 'ماں', 'باپ', 'kindness to parents', 'birr'],
    ayahRefs: ['2:83', '4:36', '6:151', '17:23', '17:24', '31:14', '46:15'],
    summary: { en: 'Verses on honoring and caring for parents.', ur: 'والدین کے ساتھ حسن سلوک کی آیات۔' },
  },
  {
    id: 'marriage',
    labels: { en: 'Marriage & Family', ur: 'ازدواج', ar: 'النكاح' },
    synonyms: ['marriage', 'nikah', 'spouse', 'wife', 'husband', 'family', 'ازدواج', 'shadi', 'mawaddah'],
    ayahRefs: ['2:187', '4:1', '4:34', '30:21', '24:32', '42:23'],
    summary: { en: 'Verses on marriage, family bonds, and compassion.', ur: 'ازدواج، خاندان، اور محبت کی آیات۔' },
  },
  {
    id: 'death_afterlife',
    labels: { en: 'Death & Hereafter', ur: 'موت و آخرت', ar: 'الآخرة' },
    synonyms: ['death', 'afterlife', 'hereafter', 'akhirah', 'judgment', 'resurrection', 'موت', 'آخرت', 'قیامت'],
    ayahRefs: ['3:185', '6:62', '21:35', '23:15', '29:57', '32:11', '67:2', '75:36'],
    summary: { en: 'Verses on mortality, resurrection, and the Day of Judgment.', ur: 'موت، دوبارہ زندگی، اور قیامت کی آیات۔' },
  },
  {
    id: 'trust_allah',
    labels: { en: 'Trust in Allah (Tawakkul)', ur: 'توکل', ar: 'التوكل' },
    synonyms: ['trust', 'tawakkul', 'rely on Allah', 'توکل', 'hasbunallah', 'Allah is sufficient'],
    ayahRefs: ['3:159', '3:160', '8:61', '9:51', '11:123', '14:12', '65:3', '39:38'],
    summary: { en: 'Verses on relying upon Allah in all affairs.', ur: 'تمام معاملات میں اللہ پر بھروسہ کی آیات۔' },
  },
  {
    id: 'humility',
    labels: { en: 'Humility', ur: 'عاجزی', ar: 'التواضع' },
    synonyms: ['humility', 'humble', 'arrogance', 'pride', 'عاجزی', 'تکبر', 'modesty', 'kibr'],
    ayahRefs: ['2:45', '17:37', '25:63', '31:18', '57:23', '7:13'],
    summary: { en: 'Verses warning against arrogance and praising humility.', ur: 'تکبر سے تنبیہ اور عاجزی کی تعریف کی آیات۔' },
  },
  {
    id: 'quran_itself',
    labels: { en: 'The Quran', ur: 'قرآن', ar: 'القرآن' },
    synonyms: ['quran', 'recite', 'book', 'guidance', 'furqan', 'قرآن', 'تلاوت', 'ہدایت'],
    ayahRefs: ['2:2', '17:9', '39:41', '56:77', '59:21', '75:17', '96:1'],
    summary: { en: 'Verses describing the Quran as divine guidance.', ur: 'قرآن کو الہی ہدایت بیان کرنے والی آیات۔' },
  },
];

export const SYNONYM_GROUPS = QURAN_TOPIC_INDEX.map((t) => t.synonyms);
