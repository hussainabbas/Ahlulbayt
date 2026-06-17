import type { KarbalaEvent } from '../../types';
import { cite } from './citations';

export const KARBALA_EVENTS: KarbalaEvent[] = [
  {
    id: 'kb_d1_new_year',
    muharramDay: 1,
    hijriLabel: '1 Muharram 61 AH',
    order: 1,
    timeOfDay: 'morning',
    title: {
      en: 'Islamic New Year — The journey continues',
      ur: 'اسلامی نیا سال — سفر جاری',
    },
    narrative: {
      en: 'On 1 Muharram 61 AH the Hijri year begins while Imam Husayn (as) continues toward Iraq, having refused bay\'ah to Yazid in Medina and Mecca.',
      ur: '۶۱ ہجری کا نیا سال شروع ہوتا ہے جب امام حسینؑ عراق کی طرف سفر جاری رکھتے ہیں۔',
    },
    significance: {
      en: 'Muharram opens as a month of standing with truth, not merely a calendar turn.',
      ur: 'محرم صرف نیا سال نہیں — حق کے ساتھ کھڑے ہونے کا مہینہ ہے۔',
    },
    citations: [
      cite('Tarikh al-Tabari', { volume: 4, page: '304-306', scholar: 'al-Tabari' }),
      cite('Kitab al-Irshad', { volume: 2, page: '38-40', scholar: 'Shaykh al-Mufid' }),
    ],
  },
  {
    id: 'kb_d2_arrival',
    muharramDay: 2,
    hijriLabel: '2 Muharram 61 AH',
    order: 2,
    timeOfDay: 'afternoon',
    title: { en: 'Arrival at Karbala', ur: 'کربلا میں آمد' },
    narrative: {
      en: 'The caravan reaches the plains of Karbala. The Imam asks the name of the land and is told "Karbala" — a place of trial and affliction.',
      ur: 'قافلہ کربلا کے میدان میں پہنچتا ہے۔ امامؑ زمین کا نام پوچھتے ہیں — کربلا۔',
    },
    significance: {
      en: 'Karbala becomes the eternal stage where wilayah confronts tyranny.',
      ur: 'کربلا وہ ابدی میدان بن جاتا ہے جہاں ولایت ظلم کا مقابلہ کرتی ہے۔',
    },
    citations: [
      cite('Maqtal al-Husayn', { page: '142', scholar: 'al-Khwarazmi' }),
      cite('Bihar al-Anwar', { volume: 44, page: '326', scholar: 'Allama Majlisi' }),
    ],
  },
  {
    id: 'kb_d3_hur',
    muharramDay: 3,
    hijriLabel: '3 Muharram 61 AH',
    order: 3,
    title: { en: 'Camp established — Hur arrives', ur: 'خیمے — حر کی آمد' },
    narrative: {
      en: 'Imam Husayn (as) pitches camp. Hur ibn Yazid al-Riyahi arrives with troops, torn between Ibn Ziyad\'s orders and his conscience.',
      ur: 'امامؑ خیمے لگاتے ہیں۔ حر بن یزید ریاحی فوج کے ساتھ آتا ہے۔',
    },
    significance: {
      en: 'Hur represents every soul caught between fear and truth; repentance remains possible until the last breath.',
      ur: 'حر ہر اس روح کی نمائندگی کرتا ہے جو خوف اور حق کے درمیان ہے۔',
    },
    citations: [
      cite('Al-Luhuf fi Qatla al-Tufuf', { page: '88-92', scholar: 'Ibn Tawus' }),
      cite('Bihar al-Anwar', { volume: 44, page: '337-340', scholar: 'Allama Majlisi' }),
    ],
  },
  {
    id: 'kb_d4_siege',
    muharramDay: 4,
    hijriLabel: '4 Muharram 61 AH',
    order: 4,
    title: { en: 'The siege tightens', ur: 'محاصرہ سخت' },
    narrative: {
      en: 'Umar ibn Sa\'d\'s forces surround the camp. Companions including Muslim ibn Awsaja and Wahab affirm loyalty to the Imam.',
      ur: 'عمر بن سعد کی فوجیں خیمے گھیر لیتی ہیں۔ مسلم بن عوسجہ وغیرہ وفاداری کا اظہار کرتے ہیں۔',
    },
    significance: {
      en: 'Loyalty to Husayn (as) is measured when the world abandons him.',
      ur: 'حسینؑ سے وفاداری اس وقت سنجی جاتی ہے جب دنیا انہیں چھوڑ دیتی ہے۔',
    },
    citations: [
      cite('Tarikh al-Tabari', { volume: 4, page: '312-315', scholar: 'al-Tabari' }),
      cite('Maqtal al-Husayn', { page: '156-160', scholar: 'al-Khwarazmi' }),
    ],
  },
  {
    id: 'kb_d7_water',
    muharramDay: 7,
    hijriLabel: '7 Muharram 61 AH',
    order: 7,
    title: { en: 'Water cut off — Day of Makhzi', ur: 'پانی بند — یوم مذی' },
    narrative: {
      en: 'Access to the Euphrates is blocked. Women and children suffer thirst; Abbas (as) will later ride to the river.',
      ur: 'فرات کا پانی بند کر دیا جاتا ہے۔ خواتین و بچے پیاس سے تکلیف میں۔',
    },
    significance: {
      en: 'The cruelty of denying water foreshadows the thirst of Ashura and the stand of Abu al-Fadl al-Abbas (as).',
      ur: 'پانی سے محرومی عاشورا کی پیاس اور حضرت عباسؑ کے قیام کی پیشین گوئی ہے۔',
    },
    citations: [
      cite('Bihar al-Anwar', { volume: 45, page: '12-18', scholar: 'Allama Majlisi' }),
      cite('Al-Luhuf fi Qatla al-Tufuf', { page: '112', scholar: 'Ibn Tawus' }),
    ],
    martyrIds: ['martyr_abbas'],
  },
  {
    id: 'kb_d8_eve',
    muharramDay: 8,
    hijriLabel: '8 Muharram 61 AH',
    order: 8,
    timeOfDay: 'night',
    title: { en: 'Eve of battle', ur: 'جنگ کی شب' },
    narrative: {
      en: 'The night before the final stand. Companions request martyrdom before the Imam; Abbas, Ali Akbar, and Qasim prepare.',
      ur: 'آخری قیام سے پہلے کی رات۔ اصحاب شہادت کی درخواست کرتے ہیں۔',
    },
    significance: {
      en: 'The night of farewell teaches that love for the Imam transcends fear of death.',
      ur: 'الوداع کی رات سکھاتی ہے کہ امام سے محبت موت کے خوف سے بڑی ہے۔',
    },
    citations: [
      cite('Kitab al-Irshad', { volume: 2, page: '98-102', scholar: 'Shaykh al-Mufid' }),
      cite('Maqtal al-Husayn', { page: '198-205', scholar: 'al-Khwarazmi', unverified: true }),
    ],
  },
  {
    id: 'kb_d9_tasua',
    muharramDay: 9,
    hijriLabel: '9 Muharram 61 AH',
    order: 9,
    title: { en: 'Tasu\'a — Eve of Ashura', ur: 'تاسوعا — عاشورا کی شب' },
    narrative: {
      en: 'Shimr joins the army with orders for battle. The camp spends its final night; Sayyida Zainab (sa) gathers the women.',
      ur: 'شمر فوج میں شامل ہوتا ہے۔ خیمے میں آخری رات؛ سیدہ زینبؑ خواتین کو جمع کرتی ہیں۔',
    },
    significance: {
      en: 'Tasu\'a is the night of tears before the storm of Ashura.',
      ur: 'تاسوعا عاشورا کے طوفان سے پہلے آنسوؤں کی رات ہے۔',
    },
    citations: [
      cite('Bihar al-Anwar', { volume: 45, page: '45-52', scholar: 'Allama Majlisi' }),
    ],
  },
  {
    id: 'kb_d10_fajr',
    muharramDay: 10,
    hijriLabel: '10 Muharram 61 AH',
    order: 10,
    timeOfDay: 'dawn',
    title: { en: 'Ashura begins — Prayer at dawn', ur: 'عاشورا — فجر کی نماز' },
    narrative: {
      en: 'Imam Husayn (as) leads companions in Fajr prayer on the day of Ashura as the enemy army watches.',
      ur: 'عاشورا کے دن امامؑ اصحاب کے ساتھ فجر کی نماز ادا کرتے ہیں۔',
    },
    significance: {
      en: 'Worship precedes martyrdom — Karbala is prayer before sacrifice.',
      ur: 'شہادت سے پہلے عبادت — کربلا قربانی سے پہلے نماز ہے۔',
    },
    citations: [
      cite('Maqtal al-Husayn', { page: '220-222', scholar: 'al-Khwarazmi' }),
      cite('Mafatih al-Jinan', { chapter: 'Amaal of Ashura', scholar: 'Shaykh Abbas Qummi' }),
    ],
  },
  {
    id: 'kb_d10_abbas',
    muharramDay: 10,
    hijriLabel: '10 Muharram 61 AH',
    order: 11,
    timeOfDay: 'afternoon',
    title: { en: 'Martyrdom of Abbas (as)', ur: 'شہادت حضرت عباسؑ' },
    narrative: {
      en: 'Abbas (as) rides to the Euphrates for water and is martyred after both arms are struck.',
      ur: 'حضرت عباسؑ پانی لینے فرات کی طرف جاتے ہیں اور دونوں بازو کٹنے کے بعد شہید ہوتے ہیں۔',
    },
    significance: {
      en: 'Qamar Bani Hashim embodies loyalty, courage, and the standard of selfless service.',
      ur: 'قمر بنی ہاشم وفاداری، بہادری اور بے لوث خدمت کی مثال ہیں۔',
    },
    citations: [
      cite('Bihar al-Anwar', { volume: 45, page: '78-85', scholar: 'Allama Majlisi' }),
      cite('Al-Luhuf fi Qatla al-Tufuf', { page: '145-150', scholar: 'Ibn Tawus' }),
    ],
    martyrIds: ['martyr_abbas'],
  },
  {
    id: 'kb_d10_ali_akbar',
    muharramDay: 10,
    hijriLabel: '10 Muharram 61 AH',
    order: 12,
    timeOfDay: 'afternoon',
    title: { en: 'Martyrdom of Ali al-Akbar (as)', ur: 'شہادت علی اکبرؑ' },
    narrative: {
      en: 'Ali Akbar (as), resembling the Prophet (s), rides into battle and attains martyrdom before his father.',
      ur: 'علی اکبرؑ، جو نبیؐ سے مشابہ تھے، میدان میں جاتے ہیں اور اپنے والد سے پہلے شہید ہوتے ہیں۔',
    },
    significance: {
      en: 'The youth of Karbala prove that age does not limit sacrifice for truth.',
      ur: 'کربلا کے نوجوان ثابت کرتے ہیں کہ قربانی کے لیے عمر رکاوٹ نہیں۔',
    },
    citations: [
      cite('Maqtal al-Husayn', { page: '235-240', scholar: 'al-Khwarazmi' }),
    ],
    martyrIds: ['martyr_ali_akbar'],
  },
  {
    id: 'kb_d10_asghar',
    muharramDay: 10,
    hijriLabel: '10 Muharram 61 AH',
    order: 13,
    timeOfDay: 'afternoon',
    title: { en: 'Martyrdom of Ali al-Asghar (as)', ur: 'شہادت علی اصغرؑ' },
    narrative: {
      en: 'The six-month infant is martyred by an arrow while in the arms of Imam Husayn (as), thirsty and innocent.',
      ur: 'چھ ماہ کا بچہ امامؑ کی گود میں تیر لگ کر شہید ہوتا ہے۔',
    },
    significance: {
      en: 'The cradle of Karbala exposes the depth of cruelty faced by the Prophet\'s household.',
      ur: 'کربلا کا پالنا نبیؐ کے اہل بیت پر ظلم کی انتہا ظاہر کرتا ہے۔',
    },
    citations: [
      cite('Bihar al-Anwar', { volume: 45, page: '95-98', scholar: 'Allama Majlisi' }),
      cite('Al-Luhuf fi Qatla al-Tufuf', { page: '168', scholar: 'Ibn Tawus', unverified: true }),
    ],
    martyrIds: ['martyr_ali_asghar'],
  },
  {
    id: 'kb_d10_husayn',
    muharramDay: 10,
    hijriLabel: '10 Muharram 61 AH',
    order: 14,
    timeOfDay: 'afternoon',
    title: { en: 'Martyrdom of Imam Husayn (as)', ur: 'شہادت امام حسینؑ' },
    narrative: {
      en: 'After companions and family are martyred, Imam Husayn (as) falls on the plains of Karbala, alone yet victorious in spirit.',
      ur: 'اصحاب و اہل بیت کی شہادت کے بعد امام حسینؑ اکیلے گر جاتے ہیں — روحانی فتح کے ساتھ۔',
    },
    significance: {
      en: 'Ashura is the pivot of salvation history — the blood that revived the Ummah.',
      ur: 'عاشورا نجات کی تاریخ کا محور ہے — وہ خون جس نے امت کو زندہ کیا۔',
    },
    citations: [
      cite('Tarikh al-Tabari', { volume: 4, page: '353-360', scholar: 'al-Tabari' }),
      cite('Kitab al-Irshad', { volume: 2, page: '110-115', scholar: 'Shaykh al-Mufid' }),
      cite('Kamil al-Ziyarat', { chapter: 'Ziyarat Ashura', scholar: 'Ibn Qulawayh' }),
    ],
    martyrIds: ['martyr_husayn'],
  },
  {
    id: 'kb_d11_captives',
    muharramDay: 11,
    hijriLabel: '11 Muharram 61 AH',
    order: 15,
    title: { en: 'Captivity of Ahlul Bayt', ur: 'اہل بیتؑ اسیری' },
    narrative: {
      en: 'Women and children of the Prophet\'s household are taken captive; heads of martyrs are raised on spears.',
      ur: 'نبیؐ کے اہل بیت کی خواتین و بچے اسیر بنائے جاتے ہیں۔',
    },
    significance: {
      en: 'Zainab (sa) becomes the voice of Karbala in the courts of tyrants.',
      ur: 'زینبؑ ظالموں کے درباروں میں کربلا کی آواز بنتی ہیں۔',
    },
    citations: [
      cite('Bihar al-Anwar', { volume: 45, page: '120-128', scholar: 'Allama Majlisi' }),
    ],
  },
  {
    id: 'kb_d13_burial',
    muharramDay: 13,
    hijriLabel: '13 Muharram 61 AH',
    order: 16,
    title: { en: 'Burial of martyrs', ur: 'شہداء کی تدفین' },
    narrative: {
      en: 'Banu Asad bury the bodies of the martyrs of Karbala on 13 Muharram.',
      ur: 'بنو اسد ۱۳ محرم کو شہداء کی تدفین کرتے ہیں۔',
    },
    significance: {
      en: 'The earth of Karbala becomes the eternal resting place of the Master of Martyrs.',
      ur: 'کربلا کی زمین سید الشہداءؑ کا ابدی مزار بن جاتی ہے۔',
    },
    citations: [
      cite('Maqtal al-Husayn', { page: '280-285', scholar: 'al-Khwarazmi', unverified: true }),
      cite('Bihar al-Anwar', { volume: 45, page: '140', scholar: 'Allama Majlisi' }),
    ],
  },
];

export const KARBALA_EVENTS_BY_ID = Object.fromEntries(
  KARBALA_EVENTS.map((e) => [e.id, e]),
) as Record<string, KarbalaEvent>;

export const KARBALA_EVENTS_BY_DAY = KARBALA_EVENTS.reduce(
  (acc, event) => {
    const bucket = acc[event.muharramDay] ?? [];
    bucket.push(event);
    acc[event.muharramDay] = bucket;
    return acc;
  },
  {} as Record<number, KarbalaEvent[]>,
);
