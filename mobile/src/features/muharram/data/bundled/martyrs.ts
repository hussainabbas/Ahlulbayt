import type { MartyrProfile } from '../../types';
import { cite } from './citations';

export const MARTYRS: MartyrProfile[] = [
  {
    id: 'martyr_husayn',
    name: { en: 'Imam Husayn ibn Ali', ur: 'امام حسین بن علی' },
    honorific: { en: '(as)', ur: 'ؑ' },
    role: { en: 'Third Imam, Master of Martyrs', ur: 'تیسرے امام، سید الشہداء' },
    shahadatDay: 10,
    narrative: {
      en: 'Refused bay\'ah to Yazid and stood at Karbala with 72 companions. Martyred on Ashura after all were killed.',
      ur: 'یزید کی بیعت سے انکار کیا اور ۷۲ ساتھیوں کے ساتھ کربلا میں کھڑے ہوئے۔ عاشورا پر شہید ہوئے۔',
    },
    significance: {
      en: 'The stand of Husayn (as) revived Islam and established refusal of injustice as a sacred duty.',
      ur: 'حسینؑ کا قیام اسلام کو زندہ کیا اور ظلم کے انکار کو مقدس فرض بنایا۔',
    },
    citations: [
      cite('Kitab al-Irshad', { volume: 2, page: '110-115', scholar: 'Shaykh al-Mufid' }),
      cite('Bihar al-Anwar', { volume: 44, page: '1-50', scholar: 'Allama Majlisi' }),
    ],
    masoomeenId: 'masoom_husayn',
  },
  {
    id: 'martyr_abbas',
    name: { en: 'Abbas ibn Ali', ur: 'عباس بن علی' },
    honorific: { en: '(as)', ur: 'ؑ' },
    role: { en: 'Standard-bearer, Qamar Bani Hashim', ur: 'علمدار، قمر بنی ہاشم' },
    shahadatDay: 10,
    narrative: {
      en: 'Brother of Imam Husayn (as) and guardian of the camp. Martyred at the Euphrates while seeking water for the thirsty.',
      ur: 'امام حسینؑ کے بھائی اور خیمے کے محافظ۔ پیاسوں کے لیے پانی لیتے ہوئے فرات پر شہید ہوئے۔',
    },
    significance: {
      en: 'Abbas (as) is the epitome of loyalty, courage, and selfless service to the Imam.',
      ur: 'عباسؑ وفاداری، بہادری اور امام کی بے لوث خدمت کی مثال ہیں۔',
    },
    citations: [
      cite('Bihar al-Anwar', { volume: 45, page: '78-85', scholar: 'Allama Majlisi' }),
      cite('Al-Luhuf fi Qatla al-Tufuf', { page: '145-150', scholar: 'Ibn Tawus' }),
    ],
    masoomeenId: 'masoom_ali',
  },
  {
    id: 'martyr_ali_akbar',
    name: { en: 'Ali al-Akbar ibn Husayn', ur: 'علی اکبر بن حسین' },
    honorific: { en: '(as)', ur: 'ؑ' },
    role: { en: 'Son of Imam Husayn (as)', ur: 'امام حسینؑ کے فرزند' },
    shahadatDay: 10,
    narrative: {
      en: 'Eighteen years old, resembling the Prophet (s) in appearance. Martyred in battle before his father.',
      ur: 'اٹھارہ سال کے، نبیؐ سے مشابہ۔ اپنے والد سے پہلے میدان میں شہید ہوئے۔',
    },
    significance: {
      en: 'Youth at Karbala chose martyrdom over submission to tyranny.',
      ur: 'کربلا کے نوجوان نے ظلم کے سامنے جھکنے کے بجائے شہادت چنی۔',
    },
    citations: [
      cite('Maqtal al-Husayn', { page: '235-240', scholar: 'al-Khwarazmi' }),
      cite('Bihar al-Anwar', { volume: 45, page: '70-75', scholar: 'Allama Majlisi', unverified: true }),
    ],
  },
  {
    id: 'martyr_ali_asghar',
    name: { en: 'Ali al-Asghar ibn Husayn', ur: 'علی اصغر بن حسین' },
    honorific: { en: '(as)', ur: 'ؑ' },
    role: { en: 'Infant martyr of Karbala', ur: 'کربلا کے شیر خوار شہید' },
    shahadatDay: 10,
    narrative: {
      en: 'Six-month-old infant martyred by an arrow in the arms of his father while thirsty.',
      ur: 'چھ ماہ کا بچہ والد کی گود میں پیاسا تیر لگ کر شہید ہوا۔',
    },
    significance: {
      en: 'The innocence of al-Asghar exposes the cruelty inflicted upon the Prophet\'s household.',
      ur: 'اصغرؑ کی بے گناہی نبیؐ کے اہل بیت پر ظلم کی انتہا ظاہر کرتی ہے۔',
    },
    citations: [
      cite('Bihar al-Anwar', { volume: 45, page: '95-98', scholar: 'Allama Majlisi' }),
    ],
  },
  {
    id: 'martyr_muslim_awsaja',
    name: { en: 'Muslim ibn Awsaja', ur: 'مسلم بن عوسجہ' },
    role: { en: 'Companion of Imam Husayn (as)', ur: 'امام حسینؑ کے ساتھی' },
    shahadatDay: 10,
    narrative: {
      en: 'Among the first companions to pledge allegiance at Karbala. Martyred on Ashura after fighting valiantly.',
      ur: 'کربلا میں بیعت کرنے والے پہلے ساتھیوں میں سے۔ عاشورا پر بہادری سے لڑ کر شہید ہوئے۔',
    },
    significance: {
      en: 'Exemplifies steadfast companionship when the world deserted the Imam.',
      ur: 'جب دنیا نے امام کو چھوڑ دیا، ان کی وفاداری مثال ہے۔',
    },
    citations: [
      cite('Tarikh al-Tabari', { volume: 4, page: '340', scholar: 'al-Tabari', unverified: true }),
      cite('Maqtal al-Husayn', { page: '210', scholar: 'al-Khwarazmi' }),
    ],
  },
  {
    id: 'martyr_habib',
    name: { en: 'Habib ibn Muzahir', ur: 'حبیب بن مظاہر' },
    role: { en: 'Companion from Kufa', ur: 'کوفہ کے ساتھی' },
    shahadatDay: 10,
    narrative: {
      en: 'A loyal supporter from Kufa who joined Imam Husayn (as) at Karbala and was martyred on Ashura.',
      ur: 'کوفہ کے وفادار ساتھی جو کربلا میں امامؑ سے ملے اور عاشورا پر شہید ہوئے۔',
    },
    significance: {
      en: 'Represents those few who honoured their invitation when Kufa betrayed the Imam.',
      ur: 'ان چند لوگوں کی نمائندگی جو کوفہ کے دھوکہ کے باوجود دعوت پر عمل کیا۔',
    },
    citations: [
      cite('Bihar al-Anwar', { volume: 45, page: '55', scholar: 'Allama Majlisi', unverified: true }),
    ],
  },
  {
    id: 'martyr_zainab',
    name: { en: 'Sayyida Zainab bint Ali', ur: 'سیدہ زینب بنت علی' },
    honorific: { en: '(sa)', ur: 'ؑ' },
    role: { en: 'Sister of Imam Husayn (as), defender of Karbala', ur: 'امام حسینؑ کی بہن، مدافع کربلا' },
    shahadatDay: 10,
    narrative: {
      en: 'Witnessed the massacre at Karbala and led the caravan of captives. Delivered sermons in Kufa and Damascus.',
      ur: 'کربلا کا قتل عام دیکھا اور قیدی قافلے کی قیادت کی۔ کوفہ و شام میں خطبات دیے۔',
    },
    significance: {
      en: 'Zainab (sa) preserved the message of Karbala through eloquence and patience in captivity.',
      ur: 'زینبؑ نے اسیری میں فصاحت و صبر سے کربلا کا پیغام محفوظ رکھا۔',
    },
    citations: [
      cite('Bihar al-Anwar', { volume: 45, page: '120-135', scholar: 'Allama Majlisi' }),
      cite('Kitab al-Irshad', { volume: 2, page: '118', scholar: 'Shaykh al-Mufid' }),
    ],
    masoomeenId: 'masoom_fatima',
  },
  {
    id: 'martyr_zainulabideen',
    name: { en: 'Imam Ali Zain ul-Abideen', ur: 'امام علی زین العابدین' },
    honorific: { en: '(as)', ur: 'ؑ' },
    role: { en: 'Fourth Imam, survivor of Karbala', ur: 'چوتھے امام، کربلا کے گواہ' },
    shahadatDay: 10,
    narrative: {
      en: 'Ill during Ashura, spared from battle. Bore witness to the tragedy and later revived mourning through Sahifa Sajjadiya.',
      ur: 'عاشورا پر بیمار تھے۔ مصیبت کے گواہ بنے اور بعد میں صحیفہ سجادیہ سے عزاداری کو زندہ کیا۔',
    },
    significance: {
      en: 'The Imam of patience who transformed tears into timeless supplication.',
      ur: 'صبر کے امام جنہوں نے آنسوؤں کو ابدی دعا میں بدلا۔',
    },
    citations: [
      cite('Kitab al-Irshad', { volume: 2, page: '120-125', scholar: 'Shaykh al-Mufid' }),
      cite('Bihar al-Anwar', { volume: 46, page: '1-20', scholar: 'Allama Majlisi' }),
    ],
    masoomeenId: 'masoom_zainulabideen',
  },
];

export const MARTYRS_BY_ID = Object.fromEntries(MARTYRS.map((m) => [m.id, m])) as Record<
  string,
  MartyrProfile
>;

export const MARTYRS_BY_DAY = MARTYRS.reduce(
  (acc, martyr) => {
    const bucket = acc[martyr.shahadatDay] ?? [];
    bucket.push(martyr);
    acc[martyr.shahadatDay] = bucket;
    return acc;
  },
  {} as Record<number, MartyrProfile[]>,
);
