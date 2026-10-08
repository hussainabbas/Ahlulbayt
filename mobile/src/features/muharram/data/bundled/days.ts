import type { MuharramDayEntry } from '../../types';
import { cite } from './citations';

function day(
  n: number,
  title: MuharramDayEntry['title'],
  narrative: MuharramDayEntry['narrative'],
  significance: MuharramDayEntry['significance'],
  worship: MuharramDayEntry['worship'],
  karbalaEventIds: string[],
  claims: MuharramDayEntry['claims'],
  relatedMasoomeenIds?: MuharramDayEntry['relatedMasoomeenIds'],
): MuharramDayEntry {
  return {
    day: n,
    legacyKey: `d${n}`,
    title,
    narrative,
    significance,
    worship,
    karbalaEventIds,
    claims,
    relatedMasoomeenIds,
  };
}

export const MUHARRAM_DAY_ENTRIES: MuharramDayEntry[] = [
  day(
    1,
    { en: 'Islamic New Year — The Stand Begins', ur: 'اسلامی نیا سال — قیام کا آغاز' },
    {
      en: 'On 1 Muharram 61 AH the Hijri year begins as Imam Husayn (as) continues toward Iraq, having refused bay\'ah to Yazid in Medina and Mecca.',
      ur: '۱ محرم ۶۱ ہجری میں نیا سال شروع ہوتا ہے جب امام حسینؑ یزید کی بیعت سے انکار کر کے عراق کی طرف بڑھ رہے ہیں۔',
    },
    {
      en: 'Muharram is not merely a calendar turn — it is the month of choosing wilayah over tyranny.',
      ur: 'محرم صرف نیا سال نہیں — یہ ظلم کے مقابلے میں ولایت کا مہینہ ہے۔',
    },
    {
      amalTitle: { en: 'Renew intentions for Muharram', ur: 'محرم کے ارادے تجدید کریں' },
      amalBody: {
        en: 'Begin the sacred month with reflection and commitment to the path of Ahlul Bayt (as).',
        ur: 'مقدس مہینے کا آغاز اہل بیتؑ کے راستے کے عزم سے کریں۔',
      },
      amalSteps: {
        en: '1. Ghusl if possible\n2. Recite 100× Salawat\n3. Recite Dua Tawassul\n4. Give charity (Sadaqah)\n5. Attend or listen to majlis',
        ur: '۱. غسل\n۲. ۱۰۰ مرتبہ صلوات\n۳. دعائے توسل\n۴. صدقہ\n۵. مجلس',
      },
      duaIds: ['dua_tawassul'],
      ziyaratIds: ['ziyarat_waritha'],
      quran: { surahNumbers: [1, 2], note: { en: 'Surah Al-Fatiha and beginning of Al-Baqarah', ur: 'سورہ فاتحہ و آغاز بقرہ' } },
      citations: [cite('Mafatih al-Jinan', { chapter: 'Amaal of Muharram', scholar: 'Shaykh Abbas Qummi' })],
    },
    ['kb_d1_new_year'],
    [
      {
        id: 'd1_refusal',
        narrative: {
          en: 'Imam Husayn (as) refused to pledge allegiance to Yazid ibn Muawiya after the death of Muawiya.',
          ur: 'معاویہ کی وفات کے بعد امام حسینؑ نے یزید بن معاویہ کی بیعت سے انکار کیا۔',
        },
        significance: {
          en: 'Bay\'ah to an unjust ruler legitimises corruption — the Imam chose honour over survival.',
          ur: 'ظالم حکمران کی بیعت فساد کو جائز قرار دیتی ہے — امامؑ نے زندگی پر عزت کو ترجیح دی۔',
        },
        citations: [
          cite('Tarikh al-Tabari', { volume: 4, page: '304-306', scholar: 'al-Tabari' }),
          cite('Kitab al-Irshad', { volume: 2, page: '38-40', scholar: 'Shaykh al-Mufid' }),
        ],
      },
    ],
    ['masoom_husayn', 'masoom_ali'],
  ),
  day(
    2,
    { en: 'Arrival at Karbala', ur: 'کربلا میں آمد' },
    {
      en: 'The caravan of Imam Husayn (as) reaches the plains of Karbala on 2 Muharram — the land that would witness history\'s greatest sacrifice.',
      ur: '۲ محرم کو امام حسینؑ کا قافلہ کربلا کے میدان میں پہنچتا ہے۔',
    },
    {
      en: 'Karbala becomes the eternal stage where truth confronts falsehood until the end of time.',
      ur: 'کربلا ابدی میدان بن جاتا ہے جہاں حق و باطل کا مقابلہ جاری رہے گا۔',
    },
    {
      amalTitle: { en: 'Ziyarat of the arrival', ur: 'آمد کی زیارت' },
      amalBody: { en: 'Commemorate the arrival of the Imam\'s caravan at the sacred land.', ur: 'امامؑ کی آمد یاد کریں۔' },
      amalSteps: {
        en: '1. Recite Ziyarat Warith\n2. Surah Al-Fatiha for martyrs\n3. 100× La hawla wa la quwwata\n4. Dua Nudba (excerpt)\n5. Reflect on the journey',
        ur: '۱. زیارت وارث\n۲. فاتحہ\n۳. ۱۰۰ لا حول\n۴. دعائے ندبہ\n۵. غور و فکر',
      },
      duaIds: ['dua_nudba'],
      ziyaratIds: ['ziyarat_waritha'],
      quran: { surahNumbers: [18], note: { en: 'Surah Al-Kahf — recommended on sacred days', ur: 'سورہ کہف' } },
    },
    ['kb_d2_arrival'],
    [
      {
        id: 'd2_arrival',
        narrative: {
          en: 'The Imam asked the name of the land and was told "Karbala" — derived from karb (grief) and bala (trial).',
          ur: 'امامؑ نے زمین کا نام پوچھا — کربلا، یعنی غم و آزمائش۔',
        },
        significance: {
          en: 'The naming of Karbala symbolises that grief and trial are inseparable from the path of wilayah.',
          ur: 'کربلا کا نام ظاہر کرتا ہے کہ ولایت کا راستہ غم و آزمائش سے جدا نہیں۔',
        },
        citations: [
          cite('Maqtal al-Husayn', { page: '142', scholar: 'al-Khwarazmi' }),
          cite('Bihar al-Anwar', { volume: 44, page: '326', scholar: 'Allama Majlisi' }),
        ],
      },
    ],
    ['masoom_husayn'],
  ),
  day(
    3,
    { en: 'Camp Established — Hur Arrives', ur: 'خیمے — حر کی آمد' },
    {
      en: 'Imam Husayn (as) establishes camp at Karbala. Hur ibn Yazid al-Riyahi arrives, torn between Ibn Ziyad\'s orders and his conscience.',
      ur: 'امامؑ کربلا میں خیمے لگاتے ہیں۔ حر بن یزید ریاحی فوج کے ساتھ آتا ہے۔',
    },
    {
      en: 'Hur represents every soul caught between fear and truth — repentance remains possible until the last breath.',
      ur: 'حر ہر روح کی نمائندگی ہے جو خوف اور حق کے درمیان ہے۔',
    },
    {
      amalTitle: { en: 'Seek forgiveness like Hur', ur: 'حر کی طرح توبہ' },
      amalBody: { en: 'Turn toward the Imam with sincere repentance.', ur: 'امامؑ کی طرف خلوص سے رجوع کریں۔' },
      amalSteps: {
        en: '1. Istighfar 70 times\n2. Ziyarat Warith\n3. 2 rak\'at for tawba\n4. Charity in Husayn\'s name\n5. 100× Salawat',
        ur: '۱. استغفار\n۲. زیارت وارث\n۳. نماز توبہ\n۴. صدقہ\n۵. صلوات',
      },
      ziyaratIds: ['ziyarat_waritha'],
      quran: { surahNumbers: [3], ayahRanges: [{ surah: 3, from: 1, to: 50 }] },
    },
    ['kb_d3_hur'],
    [
      {
        id: 'd3_hur',
        narrative: {
          en: 'Hur initially blocked the Imam\'s path but later joined him, seeking forgiveness before battle.',
          ur: 'حر نے پہلے راستہ روکا مگر بعد میں امامؑ سے مل کر معافی مانگی۔',
        },
        significance: {
          en: 'It is never too late to choose Husayn (as) — Hur\'s repentance is a model for all sinners.',
          ur: 'حسینؑ کا انتخاب کبھی دیر نہیں — حر کی توبہ گناہگاروں کے لیے نمونہ ہے۔',
        },
        citations: [
          cite('Al-Luhuf fi Qatla al-Tufuf', { page: '88-92', scholar: 'Ibn Tawus' }),
          cite('Bihar al-Anwar', { volume: 44, page: '337-340', scholar: 'Allama Majlisi' }),
        ],
      },
    ],
  ),
  day(
    4,
    { en: 'The Siege Tightens', ur: 'محاصرہ سخت' },
    {
      en: 'Umar ibn Sa\'d\'s army surrounds the camp. Companions including Muslim ibn Awsaja affirm loyalty to the Imam.',
      ur: 'عمر بن سعد کی فوج خیمے گھیر لیتی ہے۔ مسلم بن عوسجہ وغیرہ وفاداری ظاہر کرتے ہیں۔',
    },
    {
      en: 'Loyalty to Husayn (as) is measured when the world abandons him.',
      ur: 'حسینؑ سے وفاداری اس وقت پرکھی جاتی ہے جب دنیا انہیں چھوڑ دیتی ہے۔',
    },
    {
      amalTitle: { en: 'Honour the companions', ur: 'اصحاب کی یاد' },
      amalBody: { en: 'Remember those who stood firm when the world abandoned Husayn (as).', ur: 'انہیں یاد کریں جنہوں نے ساتھ نبھایا۔' },
      amalSteps: {
        en: '1. Ziyarat Aminullah\n2. Dua Kumayl (evening)\n3. 100× Salawat\n4. Read about a companion\n5. Light a candle',
        ur: '۱. زیارت امین اللہ\n۲. دعائے کمیل\n۳. صلوات\n۴. اصحاب پڑھیں\n۵. شمع',
      },
      duaIds: ['dua_kumail'],
      ziyaratIds: ['ziyarat_aminullah'],
      quran: { surahNumbers: [33], note: { en: 'Surah Al-Ahzab', ur: 'سورہ احزاب' } },
    },
    ['kb_d4_siege'],
    [
      {
        id: 'd4_companions',
        narrative: {
          en: 'Muslim ibn Awsaja and other companions pledged allegiance knowing they would not survive.',
          ur: 'مسلم بن عوسجہ وغیرہ نے جان کی پرواہ کیے بغیر بیعت کی۔',
        },
        significance: {
          en: 'The companions of Karbala are models of steadfastness (istiqamah) in the face of certain death.',
          ur: 'کربلا کے اصحاب یقینی موت کے سامنے استقامت کی مثال ہیں۔',
        },
        citations: [
          cite('Tarikh al-Tabari', { volume: 4, page: '312-315', scholar: 'al-Tabari' }),
          cite('Maqtal al-Husayn', { page: '156-160', scholar: 'al-Khwarazmi' }),
        ],
      },
    ],
  ),
  day(
    5,
    { en: 'Letters from Kufa — Broken Promises', ur: 'کوفہ کے خطوط — ٹوٹے وعدے' },
    {
      en: 'The people of Kufa who invited the Imam betrayed him. Ibn Ziyad\'s army grows while promised support never arrives.',
      ur: 'کوفہ والوں نے دعوت کے بعد دھوکہ دیا۔ ابن زیاد کی فوج بڑھتی ہے۔',
    },
    {
      en: 'Empty promises and cowardice led to tragedy — a lesson on standing with truth when it is unpopular.',
      ur: 'خالی وعدے و بزدلی نے مصیبت پیدا کی — غیر مقبول حق کے ساتھ کھڑے ہونے کا سبق۔',
    },
    {
      amalTitle: { en: 'Steadfastness in trials', ur: 'آزمائش میں ثابت قدمی' },
      amalBody: { en: 'Pray for strength to remain loyal to Ahlul Bayt in difficulty.', ur: 'مشکل میں وفاداری کی دعا کریں۔' },
      amalSteps: {
        en: '1. Ziyarat Warith\n2. Surah Al-Kahf (1 section)\n3. 100× Salawat\n4. Avoid worldly entertainment\n5. Attend majlis',
        ur: '۱. زیارت وارث\n۲. کہف\n۳. صلوات\n۴. لہو ولعب سے پرہیز\n۵. مجلس',
      },
      ziyaratIds: ['ziyarat_waritha'],
      quran: { surahNumbers: [18], ayahRanges: [{ surah: 18, from: 1, to: 74 }] },
    },
    [],
    [
      {
        id: 'd5_kufa',
        narrative: {
          en: 'Thousands of letters from Kufa invited the Imam, yet when he came, they abandoned him out of fear of Ibn Ziyad.',
          ur: 'کوفہ سے ہزاروں خطوط آئے مگر امامؑ آئے تو خوفِ ابن زیاد سے انہوں نے ساتھ چھوڑ دیا۔',
        },
        significance: {
          en: 'Betrayal of the Imam is a spiritual catastrophe — Kufa\'s letters without action condemn a nation.',
          ur: 'امامؑ سے دھوکہ روحانی تباہی ہے — عمل کے بغیر خطوط قوم کو مورد الزام ٹھہراتے ہیں۔',
        },
        citations: [
          cite('Tarikh al-Tabari', { volume: 4, page: '308-310', scholar: 'al-Tabari' }),
          cite('Ansab al-Ashraf', { volume: 3, page: '180', scholar: 'al-Baladhuri', unverified: true }),
        ],
      },
    ],
  ),
  day(
    6,
    { en: 'The Army of Ibn Ziyad Gathers', ur: 'ابن زیاد کی فوج' },
    {
      en: 'Thousands surround the small camp. Shimr is sent with orders to demand bay\'ah or battle.',
      ur: 'ہزاروں سپاہی چھوٹے خیمے کو گھیرتے ہیں۔ شمر کو جنگ یا بیعت کا حکم ملتا ہے۔',
    },
    {
      en: 'The Imam\'s refusal — "Death with dignity is better than life with humiliation" — echoes through history.',
      ur: 'امامؑ کا جواب — عزت والی موت ذلت والی زندگی سے بہتر — تاریخ میں گونجتا ہے۔',
    },
    {
      amalTitle: { en: 'Choose dignity', ur: 'عزت کا انتخاب' },
      amalBody: { en: 'Reflect on choosing Allah\'s pleasure over worldly comfort.', ur: 'اللہ کی رضا کو دنیا پر ترجیح دیں۔' },
      amalSteps: {
        en: '1. Ziyarat Ale Yasin\n2. Dua Tawassul\n3. 100× La ilaha illallah\n4. Sadaqah\n5. Modest clothing',
        ur: '۱. زیارت آل یاسین\n۲. توسل\n۳. توحید\n۴. صدقہ\n۵. سادہ لباس',
      },
      duaIds: ['dua_tawassul'],
      ziyaratIds: ['ziyarat_ale_yasin'],
      quran: { surahNumbers: [36], note: { en: 'Surah Yasin', ur: 'سورہ یس' } },
    },
    [],
    [
      {
        id: 'd6_dignity',
        narrative: {
          en: 'Yazid\'s forces offered safety in exchange for submission; the Imam refused every compromise that would legitimise tyranny.',
          ur: 'یزیدی فوج نے امن کی پیشکش کی مگر امامؑ نے ظلم کو جائز قرار دینے والی ہر سمجھوتے سے انکار کیا۔',
        },
        significance: {
          en: 'Dignity (izzah) before Allah cannot be traded for worldly safety.',
          ur: 'اللہ کے سامنے عزت دنیاوی سلامتی سے نہیں بیچی جا سکتی۔',
        },
        citations: [
          cite('Kitab al-Irshad', { volume: 2, page: '95-98', scholar: 'Shaykh al-Mufid' }),
          cite('Bihar al-Anwar', { volume: 44, page: '380', scholar: 'Allama Majlisi', unverified: true }),
        ],
      },
    ],
    ['masoom_husayn'],
  ),
  day(
    7,
    { en: 'Water Cut Off — Day of Makhzi', ur: 'پانی بند — یوم مذی' },
    {
      en: 'On 7 Muharram access to the Euphrates is blocked. Women and children suffer thirst.',
      ur: '۷ محرم کو فرات کا پانی بند۔ خواتین و بچے پیاس سے تکلیف میں۔',
    },
    {
      en: 'Denying water to the Prophet\'s household foreshadows the thirst of Ashura and the martyrdom of Abbas (as).',
      ur: 'اہل بیتؑ سے پانی بند کرنا عاشورا کی پیاس اور عباسؑ کی شہادت کی پیشین گوئی ہے۔',
    },
    {
      amalTitle: { en: 'Commemorate the thirsty camp', ur: 'پیاسے خیمے کی یاد' },
      amalBody: { en: 'Fast from water for part of the day in remembrance (if able).', ur: 'یاد میں جزوی پیاس کی مشق (اگر طاقت ہو)۔' },
      amalSteps: {
        en: '1. Ziyarat Ashura\n2. Dua Mashlool\n3. Give water (Sabeel)\n4. 100× Salawat\n5. Avoid eating until maghrib',
        ur: '۱. زیارت عاشورا\n۲. دعائے مشلول\n۳. سبیل\n۴. صلوات\n۵. مغرب تک پرہیز',
      },
      duaIds: ['dua_mashlool'],
      ziyaratIds: ['ziyarat_ashura'],
      quran: { surahNumbers: [76], note: { en: 'Surah Al-Insan — on giving water', ur: 'سورہ انسان' } },
    },
    ['kb_d7_water'],
    [
      {
        id: 'd7_water',
        narrative: {
          en: 'Ibn Ziyad ordered that no water reach the camp of Husayn (as), causing severe thirst among women and children.',
          ur: 'ابن زیاد نے حکم دیا کہ حسینؑ کے خیمے تک پانی نہ پہنچے۔',
        },
        significance: {
          en: 'Cruelty toward the innocent exposes the moral bankruptcy of Yazid\'s regime.',
          ur: 'بے گناہوں پر ظلم یزیدی نظام کی اخلاقی افلاس ظاہر کرتا ہے۔',
        },
        citations: [
          cite('Bihar al-Anwar', { volume: 45, page: '12-18', scholar: 'Allama Majlisi' }),
          cite('Al-Luhuf fi Qatla al-Tufuf', { page: '112', scholar: 'Ibn Tawus' }),
        ],
      },
    ],
  ),
  day(
    8,
    { en: 'Eve of Battle', ur: 'جنگ کی شب' },
    {
      en: 'The night before the final stand. Abbas, Ali Akbar, and Qasim prepare for martyrdom.',
      ur: 'آخری قیام سے پہلے کی رات۔ عباسؑ، علی اکبرؑ و قاسمؑ تیاری کرتے ہیں۔',
    },
    {
      en: 'The night of farewell teaches that love for the Imam transcends fear of death.',
      ur: 'الوداع کی رات سکھاتی ہے کہ امام سے محبت موت کے خوف سے بڑی ہے۔',
    },
    {
      amalTitle: { en: 'Prepare for Ashura', ur: 'عاشورا کی تیاری' },
      amalBody: { en: 'Spend the night in worship and remembrance.', ur: 'رات عبادت و یاد میں گزاریں۔' },
      amalSteps: {
        en: '1. Ziyarat Warith\n2. Night prayer (Namaz Shab)\n3. 100× Salawat\n4. Surah Yasin\n5. Stay awake in remembrance',
        ur: '۱. زیارت وارث\n۲. نماز شب\n۳. صلوات\n۴. یس\n۵. بیداری',
      },
      ziyaratIds: ['ziyarat_waritha'],
      quran: { surahNumbers: [36, 56], note: { en: 'Surah Yasin and Al-Waqi\'ah', ur: 'یس و واقعہ' } },
    },
    ['kb_d8_eve'],
    [
      {
        id: 'd8_farewell',
        narrative: {
          en: 'Companions requested to be martyred before the Imam; he granted permission with tears.',
          ur: 'اصحاب نے امامؑ سے پہلے شہادت کی درخواست کی؛ امامؑ نے آنسوؤں کے ساتھ اجازت دی۔',
        },
        significance: {
          en: 'The last night of Karbala is a school of love, sacrifice, and spiritual readiness.',
          ur: 'کربلا کی آخری رات محبت، قربانی و روحانی تیاری کی مدرسہ ہے۔',
        },
        citations: [
          cite('Kitab al-Irshad', { volume: 2, page: '98-102', scholar: 'Shaykh al-Mufid' }),
        ],
      },
    ],
    ['masoom_husayn'],
  ),
  day(
    9,
    { en: 'Tasu\'a — Eve of Ashura', ur: 'تاسوعا' },
    {
      en: 'The ninth of Muharram. Companions spend their final night; Sayyida Zainab (sa) gathers the women.',
      ur: '۹ محرم۔ اصحاب آخری رات گزارتے ہیں؛ سیدہ زینبؑ خواتین کو جمع کرتی ہیں۔',
    },
    {
      en: 'Tasu\'a is the night of tears before the storm of Ashura.',
      ur: 'تاسوعا عاشورا کے طوفان سے پہلے آنسوؤں کی رات ہے۔',
    },
    {
      amalTitle: { en: 'Night of Tasu\'a amaal', ur: 'تاسوعا کے اعمال' },
      amalBody: { en: 'The recommended acts for the eve of Ashura.', ur: 'عاشورا کی شب کے مستحب اعمال۔' },
      amalSteps: {
        en: '1. Ziyarat Ashura\n2. Dua Kumayl\n3. 100× Salawat\n4. Pray for martyrdom with the Imam\n5. Attend Tasu\'a majlis',
        ur: '۱. زیارت عاشورا\n۲. کمیل\n۳. صلوات\n۴. دعا\n۵. مجلس',
      },
      duaIds: ['dua_kumail'],
      ziyaratIds: ['ziyarat_ashura'],
      quran: { surahNumbers: [2], ayahRanges: [{ surah: 2, from: 1, to: 100 }] },
      citations: [cite('Mafatih al-Jinan', { chapter: 'Amaal of Tasua', scholar: 'Shaykh Abbas Qummi' })],
    },
    ['kb_d9_tasua'],
    [
      {
        id: 'd9_tasua',
        narrative: {
          en: 'Shimr joined the army with explicit orders for battle on the following day.',
          ur: 'شمر واضح حکمِ جنگ کے ساتھ فوج میں شامل ہوا۔',
        },
        significance: {
          en: 'Tasu\'a prepares hearts for the greatest tragedy in salvation history.',
          ur: 'تاسوعا دلوں کو نجات کی تاریخ کی سب سے بڑی مصیبت کے لیے تیار کرتی ہے۔',
        },
        citations: [
          cite('Bihar al-Anwar', { volume: 45, page: '45-52', scholar: 'Allama Majlisi' }),
        ],
      },
    ],
    ['masoom_fatima'],
  ),
  day(
    10,
    { en: 'Ashura — The Day of Martyrdom', ur: 'عاشورا — یوم شہادت' },
    {
      en: '10 Muharram 61 AH. Imam Husayn (as), his family, and 72 companions are martyred. The day that shook the heavens and earth.',
      ur: '۱۰ محرم ۶۱ ہجری۔ امام حسینؑ، اہل بیت و ۷۲ ساتھی شہید۔ آسمان و زمین ہلنے والا دن۔',
    },
    {
      en: 'Ashura is the pivot of salvation history — the blood that revived the Ummah and exposed tyranny forever.',
      ur: 'عاشورا نجات کی تاریخ کا محور — وہ خون جس نے امت کو زندہ کیا۔',
    },
    {
      amalTitle: { en: 'Ashura amaal', ur: 'اعمال عاشورا' },
      amalBody: { en: 'The most important day of the year for the followers of Ahlul Bayt.', ur: 'اہل بیت کے پیروکاروں کے لیے سال کا اہم ترین دن۔' },
      amalSteps: {
        en: '1. Fast (if able)\n2. Ziyarat Ashura\n3. Dua Mashlool\n4. Attend majlis & processions\n5. Charity & service\n6. Avoid celebrations',
        ur: '۱. روزہ\n۲. زیارت عاشورا\n۳. مشلول\n۴. مجلس\n۵. صدقہ\n۶. پرہیز',
      },
      duaIds: ['dua_mashlool'],
      ziyaratIds: ['ziyarat_ashura'],
      quran: { surahNumbers: [19, 37], note: { en: 'Surah Maryam and As-Saffat', ur: 'مریم و صافات' } },
      citations: [
        cite('Mafatih al-Jinan', { chapter: 'Amaal of Ashura', scholar: 'Shaykh Abbas Qummi' }),
        cite('Kamil al-Ziyarat', { chapter: 'Ziyarat Ashura', scholar: 'Ibn Qulawayh' }),
      ],
    },
    ['kb_d10_fajr', 'kb_d10_abbas', 'kb_d10_ali_akbar', 'kb_d10_asghar', 'kb_d10_husayn'],
    [
      {
        id: 'd10_ashura',
        narrative: {
          en: 'From dawn prayer to the martyrdom of the Imam, Ashura unfolded as a complete lesson in worship, sacrifice, and steadfastness.',
          ur: 'فجر سے امامؑ کی شہادت تک عاشورا عبادت، قربانی و استقامت کا مکمل سبق بنی۔',
        },
        significance: {
          en: 'Every moment of Ashura carries lessons for justice, patience, and loyalty to wilayah.',
          ur: 'عاشورا کا ہر لمحہ انصاف، صبر و ولایت کے سبق رکھتا ہے۔',
        },
        citations: [
          cite('Tarikh al-Tabari', { volume: 4, page: '320-360', scholar: 'al-Tabari' }),
          cite('Kitab al-Irshad', { volume: 2, page: '102-115', scholar: 'Shaykh al-Mufid' }),
          cite('Bihar al-Anwar', { volume: 45, page: '1-120', scholar: 'Allama Majlisi' }),
        ],
      },
    ],
    ['masoom_husayn', 'masoom_ali', 'masoom_fatima', 'masoom_zainulabideen'],
  ),
  day(
    11,
    { en: 'After Ashura — The Captives', ur: 'عاشورا کے بعد — اسیر' },
    {
      en: 'Women and children of the Prophet\'s household are taken captive. Heads of martyrs are raised on spears.',
      ur: 'نبیؐ کے اہل بیت کی خواتین و بچے اسیر۔ شہداء کے سر نیزوں پر۔',
    },
    {
      en: 'Sayyida Zainab (sa) becomes the eloquent defender who spoke truth in the court of Yazid.',
      ur: 'سیدہ زینبؑ ظالموں کے دربار میں حق کی علمبردار بنتی ہیں۔',
    },
    {
      amalTitle: { en: 'Stand with Zainab (sa)', ur: 'زینبؑ کے ساتھ' },
      amalBody: { en: 'Honour the Lady who preserved the message of Karbala.', ur: 'کربلا کا پیغام محفوظ رکھنے والی خاتون کی یاد۔' },
      amalSteps: {
        en: '1. Ziyarat Warith\n2. 100× Salawat\n3. Read Zainab\'s sermon\n4. Charity to orphans\n5. Avoid music',
        ur: '۱. زیارت وارث\n۲. صلوات\n۳. خطبہ\n۴. صدقہ\n۵. پرہیز',
      },
      ziyaratIds: ['ziyarat_waritha'],
      quran: { surahNumbers: [24] },
    },
    ['kb_d11_captives'],
    [
      {
        id: 'd11_captives',
        narrative: {
          en: 'The survivors were paraded as captives while the heads of martyrs were displayed.',
          ur: 'بچے ہوئے اہل بیت اسیر بنا کر سیرائے گئے اور شہداء کے سر دکھائے گئے۔',
        },
        significance: {
          en: 'Captivity did not silence Ahlul Bayt — it amplified their message.',
          ur: 'اسیری نے اہل بیتؑ کو خاموش نہیں کیا — پیغام بلند کیا۔',
        },
        citations: [
          cite('Bihar al-Anwar', { volume: 45, page: '120-128', scholar: 'Allama Majlisi' }),
        ],
      },
    ],
    ['masoom_fatima', 'masoom_zainulabideen'],
  ),
  day(
    12,
    { en: 'Journey to Kufa & Shaam', ur: 'کوفہ و شام کا سفر' },
    {
      en: 'The captives are marched through towns toward Damascus. Some recognise the tragedy; others mock.',
      ur: 'اسیر قافلہ شام کی طرف۔ کچھ لوگ مصیبت پہچانتے ہیں، کچھ مذاق اڑاتے ہیں۔',
    },
    {
      en: 'Humiliation could not diminish the dignity of the Prophet\'s family.',
      ur: 'ذلت نبیؑ کے اہل بیت کی عزت کم نہ کر سکی۔',
    },
    {
      amalTitle: { en: 'Accompany the captives', ur: 'قیدیوں کے ساتھ' },
      amalBody: { en: 'Walk spiritually with the family of the Prophet (s).', ur: 'روحانی طور پر اہل بیتؑ کے ساتھ چلیں۔' },
      amalSteps: {
        en: '1. Ziyarat Jamia Kabira\n2. Dua Nudba\n3. 100× Salawat\n4. Reflect on sermons\n5. Serve the oppressed',
        ur: '۱. زیارت جامعہ کبیرہ\n۲. ندبہ\n۳. صلوات\n۴. خطبات\n۵. خدمت',
      },
      duaIds: ['dua_nudba'],
      ziyaratIds: ['ziyarat_jamia_kabira'],
      quran: { surahNumbers: [9], ayahRanges: [{ surah: 9, from: 1, to: 40 }] },
    },
    [],
    [
      {
        id: 'd12_journey',
        narrative: {
          en: 'The caravan passed through Kufa and other cities where sermons exposed the crimes of the Umayyads.',
          ur: 'قافلہ کوفہ و دیگر شہروں سے گزرا جہاں خطبات نے اموی ظلم بے نقاب کیا۔',
        },
        significance: {
          en: 'The walk of captives extended the battlefield of Karbala into the hearts of nations.',
          ur: 'قیدیوں کا سفر کربلا کے میدان کو قوموں کے دلوں تک پھیلا گیا۔',
        },
        citations: [
          cite('Bihar al-Anwar', { volume: 45, page: '130-138', scholar: 'Allama Majlisi' }),
          cite('Maqtal al-Husayn', { page: '300', scholar: 'al-Khwarazmi', unverified: true }),
        ],
      },
    ],
  ),
  day(
    13,
    { en: 'Burial of the Martyrs', ur: 'شہداء کی تدفین' },
    {
      en: 'On 13 Muharram the people of Banu Asad bury the bodies of the martyrs of Karbala.',
      ur: '۱۳ محرم کو بنو اسد شہداء کی تدفین کرتے ہیں۔',
    },
    {
      en: 'The earth of Karbala becomes the eternal resting place of the Master of Martyrs.',
      ur: 'کربلا کی زمین سید الشہداءؑ کا ابدی مزار بن جاتی ہے۔',
    },
    {
      amalTitle: { en: 'Final Muharram amaal', ur: 'محرم کے آخری اعمال' },
      amalBody: { en: 'Close the ten days with renewed commitment to Husayn\'s mission.', ur: 'حسینؑ کے مشن کے عزم کے ساتھ ختم کریں۔' },
      amalSteps: {
        en: '1. Ziyarat Warith\n2. Visit graves if possible\n3. 100× Salawat\n4. Renew bay\'ah to Imam Husayn\n5. Plan Safar remembrance',
        ur: '۱. زیارت وارث\n۲. قبرستان\n۳. صلوات\n۴. تجدید بیعت\n۵. صفر کی یاد',
      },
      ziyaratIds: ['ziyarat_waritha'],
      quran: { surahNumbers: [67], note: { en: 'Surah Al-Mulk', ur: 'سورہ ملک' } },
    },
    ['kb_d13_burial'],
    [
      {
        id: 'd13_burial',
        narrative: {
          en: 'Banu Asad risked danger to bury the martyrs whose bodies had lain exposed for three days.',
          ur: 'بنو اسد نے خطرہ مول لے کر تین دن سے پڑے شہداء کو دفنایا۔',
        },
        significance: {
          en: 'Honouring the martyrs completes the cycle of love for those who gave everything for truth.',
          ur: 'شہداء کی تعظیم ان کے لیے محبت کا تکمیلی حصہ ہے جنہوں نے سب کچھ حق کے لیے دیا۔',
        },
        citations: [
          cite('Maqtal al-Husayn', { page: '280-285', scholar: 'al-Khwarazmi', unverified: true }),
          cite('Bihar al-Anwar', { volume: 45, page: '140', scholar: 'Allama Majlisi' }),
        ],
      },
    ],
    ['masoom_husayn'],
  ),
];

export const MUHARRAM_DAY_ENTRIES_BY_NUMBER = Object.fromEntries(
  MUHARRAM_DAY_ENTRIES.map((d) => [d.day, d]),
) as Record<number, MuharramDayEntry>;
