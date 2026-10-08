import type { IslamicCitation } from '@/core/citations';

import type { DailyLifeDuaSection, DailyLifeSituationKey } from '../../types';

export interface BundledSituationContent {
  sections: DailyLifeDuaSection[];
  citations: IslamicCitation[];
  narrator?: { en: string; ur: string };
}

function s(
  id: string,
  arabic: string,
  transliteration: string,
  en: string,
  ur: string,
): DailyLifeDuaSection {
  return {
    id,
    arabic,
    transliteration,
    translations: { en, ur },
  };
}

const hadith = (
  source: string,
  hadithNumber: string,
  narrator: string,
): IslamicCitation => ({
  source,
  hadithNumber,
  narrator,
  verified: true,
});

const quran = (source: string, reference: string): IslamicCitation => ({
  source,
  page: reference,
  verified: true,
});

const mafatih = (chapter: string): IslamicCitation => ({
  source: 'Mafatih al-Jinan',
  scholar: 'Shaykh Abbas Qummi',
  page: chapter,
  verified: true,
});

/** Standard daily-life supplications — authenticated hadith & Quran, aligned with Mafatih al-Jinan. */
export const BUNDLED_SITUATION_CONTENT: Record<DailyLifeSituationKey, BundledSituationContent> = {
  entering_home: {
    sections: [
      s(
        'main',
        'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَىٰ رَبِّنَا تَوَكَّلْنَا',
        'Bismillahi walajna, wa bismillahi kharajna, wa \'ala rabbina tawakkalna',
        'In the name of Allah we enter, and in the name of Allah we leave, and upon our Lord we rely.',
        'اللہ کے نام سے ہم داخل ہوئے، اللہ کے نام سے نکلے، اور اپنے رب پر بھروسہ کیا۔',
      ),
    ],
    citations: [hadith('Sunan Abi Dawud', '5096', 'Prophet Muhammad (s)')],
    narrator: { en: 'Prophet Muhammad (s)', ur: 'حضرت محمدؐ' },
  },

  leaving_home: {
    sections: [
      s(
        'main',
        'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
        'Bismillah, tawakkaltu \'ala Allah, la hawla wa la quwwata illa billah',
        'In the name of Allah; I place my trust in Allah. There is no might nor power except with Allah.',
        'اللہ کے نام سے، میں نے اللہ پر بھروسہ کیا، اللہ کے سوا کوئی طاقت و قوت نہیں۔',
      ),
    ],
    citations: [
      hadith('Jami\' at-Tirmidhi', '3426', 'Prophet Muhammad (s)'),
      hadith('Sunan Abi Dawud', '5095', 'Prophet Muhammad (s)'),
    ],
    narrator: { en: 'Prophet Muhammad (s)', ur: 'حضرت محمدؐ' },
  },

  before_sleeping: {
    sections: [
      s(
        'main',
        'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        'Bismika Allahumma amootu wa ahya',
        'In Your name, O Allah, I die and I live.',
        'اے اللہ! تیرے نام سے میں مرتا ہوں اور جیتا ہوں۔',
      ),
    ],
    citations: [hadith('Sahih al-Bukhari', '6324', 'Prophet Muhammad (s)')],
    narrator: { en: 'Prophet Muhammad (s)', ur: 'حضرت محمدؐ' },
  },

  after_waking: {
    sections: [
      s(
        'main',
        'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
        'Alhamdu lillahil-ladhi ahyana ba\'da ma amatana wa ilayhin-nushur',
        'All praise is for Allah who gave us life after causing us to die, and to Him is the resurrection.',
        'تمام تعریف اللہ کے لیے ہے جس نے ہمیں موت کے بعد زندگی دی، اور اسی کی طرف لوٹنا ہے۔',
      ),
    ],
    citations: [hadith('Sahih al-Bukhari', '6312', 'Prophet Muhammad (s)')],
    narrator: { en: 'Prophet Muhammad (s)', ur: 'حضرت محمدؐ' },
  },

  entering_bathroom: {
    sections: [
      s(
        'main',
        'بِسْمِ اللَّهِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
        'Bismillah, Allahumma inni a\'udhu bika minal-khubuthi wal-khaba\'ith',
        'In the name of Allah. O Allah, I seek refuge in You from male and female devils.',
        'اللہ کے نام سے، اے اللہ! میں تجھ سے ناپاک جنوں کی برائی سے پناہ مانگتا ہوں۔',
      ),
    ],
    citations: [hadith('Sahih al-Bukhari', '142', 'Prophet Muhammad (s)')],
    narrator: { en: 'Prophet Muhammad (s)', ur: 'حضرت محمدؐ' },
  },

  leaving_bathroom: {
    sections: [
      s(
        'main',
        'غُفْرَانَكَ',
        'Ghufranak',
        'I seek Your forgiveness.',
        'میں تیری مغفرت چاہتا ہوں۔',
      ),
    ],
    citations: [hadith('Sunan Abi Dawud', '30', 'Prophet Muhammad (s)')],
    narrator: { en: 'Prophet Muhammad (s)', ur: 'حضرت محمدؐ' },
  },

  starting_journey: {
    sections: [
      s(
        'main',
        'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُونَ',
        'Subhanalladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila rabbina lamunqalibun',
        'Glory be to Him who has subjected this to us, and we could not have done so ourselves. To our Lord we shall surely return.',
        'پاک ہے وہ ذات جس نے اسے ہمارے لیے مسخر کیا، اور ہم خود اس پر قابو نہ پا سکتے، اور ہم اپنے رب کی طرف لوٹنے والے ہیں۔',
      ),
    ],
    citations: [quran('Holy Quran', '43:13-14')],
    narrator: { en: 'Quranic supplication for travel', ur: 'قرآنی سفر کی دعا' },
  },

  entering_vehicle: {
    sections: [
      s(
        'main',
        'بِسْمِ اللَّهِ، الْحَمْدُ لِلَّهِ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا',
        'Bismillah, alhamdu lillah, subhanalladhi sakhkhara lana hadha',
        'In the name of Allah, all praise is for Allah. Glory be to Him who has subjected this for us.',
        'اللہ کے نام سے، تمام تعریف اللہ کے لیے، پاک ہے وہ جس نے یہ ہمارے لیے مسخر کیا۔',
      ),
    ],
    citations: [quran('Holy Quran', '43:13'), mafatih('Daily Amaal — Travel')],
    narrator: { en: 'Quran & Mafatih al-Jinan', ur: 'قرآن و مفاتیح الجنان' },
  },

  safe_travel: {
    sections: [
      s(
        'main',
        'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَٰذَا الْبِرَّ وَالتَّقْوَىٰ، وَمِنَ الْعَمَلِ مَا تَرْضَىٰ، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَٰذَا وَاطْوِ عَنَّا بُعْدَهُ',
        'Allahumma inna nas\'aluka fi safarina hadha al-birra wat-taqwa, wa minal-\'amali ma tardha. Allahumma hawwin \'alayna safarana hadha watwi \'anna bu\'dah',
        'O Allah, we ask You on this journey of ours for righteousness and piety, and deeds that please You. O Allah, make this journey easy for us and shorten its distance for us.',
        'اے اللہ! ہم اس سفر میں تجھ سے نیکی اور تقویٰ مانگتے ہیں، اور ایسے عمل جو تجھے پسند ہوں۔ اے اللہ! ہمارا یہ سفر آسان فرما اور اس کی دوری سمیٹ دے۔',
      ),
      s(
        'protection',
        'اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ وَالْخَلِيفَةُ فِي الْأَهْلِ',
        'Allahumma antas-sahibu fis-safari wal-khalifatu fil-ahl',
        'O Allah, You are the Companion on the journey and the Guardian over the family.',
        'اے اللہ! تو سفر میں ساتھی ہے اور گھر والوں کا نگہبان ہے۔',
      ),
    ],
    citations: [hadith('Sahih Muslim', '1342', 'Prophet Muhammad (s)')],
    narrator: { en: 'Prophet Muhammad (s)', ur: 'حضرت محمدؐ' },
  },

  before_eating: {
    sections: [
      s(
        'main',
        'بِسْمِ اللَّهِ',
        'Bismillah',
        'In the name of Allah.',
        'اللہ کے نام سے۔',
      ),
    ],
    citations: [hadith('Jami\' at-Tirmidhi', '1858', 'Prophet Muhammad (s)')],
    narrator: { en: 'Prophet Muhammad (s)', ur: 'حضرت محمدؐ' },
  },

  after_eating: {
    sections: [
      s(
        'main',
        'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَٰذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
        'Alhamdu lillahil-ladhi at\'amani hadha wa razaqanihi min ghairi haulin minni wa la quwwah',
        'All praise is for Allah who fed me this and provided it for me without any might or power from me.',
        'تمام تعریف اللہ کے لیے ہے جس نے مجھے یہ کھلایا اور بغیر میری طاقت و قوت کے رزق دیا۔',
      ),
    ],
    citations: [hadith('Jami\' at-Tirmidhi', '3458', 'Prophet Muhammad (s)')],
    narrator: { en: 'Prophet Muhammad (s)', ur: 'حضرت محمدؐ' },
  },

  drinking_water: {
    sections: [
      s(
        'before',
        'بِسْمِ اللَّهِ',
        'Bismillah',
        'In the name of Allah (before drinking).',
        'اللہ کے نام سے (پینے سے پہلے)۔',
      ),
      s(
        'after',
        'الْحَمْدُ لِلَّهِ',
        'Alhamdu lillah',
        'All praise is for Allah (after drinking).',
        'تمام تعریف اللہ کے لیے (پینے کے بعد)۔',
      ),
    ],
    citations: [hadith('Sunan at-Tirmidhi', '1895', 'Prophet Muhammad (s)')],
    narrator: { en: 'Prophet Muhammad (s)', ur: 'حضرت محمدؐ' },
  },

  before_marriage: {
    sections: [
      s(
        'main',
        'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
        'Rabbana hab lana min azwajina wa dhurriyyatina qurrata a\'yunin waj\'alna lil-muttaqina imama',
        'Our Lord, grant us from our spouses and offspring comfort to our eyes and make us leaders for the righteous.',
        'اے ہمارے رب! ہمیں ہماری بیویوں اور اولاد سے آنکھوں کی ٹھنڈک عطا فرما اور ہمیں متقیوں کا امام بنا۔',
      ),
    ],
    citations: [quran('Holy Quran', '25:74'), mafatih('Supplications — Marriage')],
    narrator: { en: 'Holy Quran', ur: 'قرآن مجید' },
  },

  for_spouse: {
    sections: [
      s(
        'main',
        'اللَّهُمَّ بَارِكْ لَنَا فِي أَزْوَاجِنَا وَذُرِّيَّاتِنَا',
        'Allahumma barik lana fi azwajina wa dhurriyyatina',
        'O Allah, bless us in our spouses and our children.',
        'اے اللہ! ہماری بیویوں اور اولاد میں برکت عطا فرما۔',
      ),
    ],
    citations: [mafatih('Daily Supplications — Family')],
    narrator: { en: 'Mafatih al-Jinan', ur: 'مفاتیح الجنان' },
  },

  for_children: {
    sections: [
      s(
        'main',
        'رَبِّ هَبْ لِي مِنْ لَدُنْكَ ذُرِّيَّةً طَيِّبَةً ۖ إِنَّكَ سَمِيعُ الدُّعَاءِ',
        'Rabbi hab li min ladunka dhurriyyatan tayyibah, innaka sami\'ud-du\'a',
        'My Lord, grant me from Yourself righteous offspring. Indeed, You are the Hearer of supplication.',
        'اے میرے رب! مجھے اپنی طرف سے پاکیزہ اولاد عطا فرما، بے شک تو دعا سننے والا ہے۔',
      ),
    ],
    citations: [quran('Holy Quran', '3:38')],
    narrator: { en: 'Prophet Zakariyya (as) — Quran', ur: 'حضرت زکریاؑ — قرآن' },
  },

  before_work: {
    sections: [
      s(
        'main',
        'بِسْمِ اللَّهِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَٰذَا الْيَوْمِ وَخَيْرَ مَا فِيهِ',
        'Bismillah, Allahumma inni as\'aluka khaira hadha al-yawmi wa khaira ma fih',
        'In the name of Allah. O Allah, I ask You for the good of this day and the good within it.',
        'اللہ کے نام سے، اے اللہ! میں تجھ سے اس دن کی بھلائی اور اس میں جو بھلائی ہے مانگتا ہوں۔',
      ),
    ],
    citations: [mafatih('Morning & Evening Adhkar')],
    narrator: { en: 'Mafatih al-Jinan', ur: 'مفاتیح الجنان' },
  },

  seeking_rizq: {
    sections: [
      s(
        'main',
        'رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ',
        'Rabbi inni lima anzalta ilayya min khairin faqir',
        'My Lord, I am in need of whatever good You send down to me.',
        'اے میرے رب! جو بھی بھلائی تو میری طرف نازل فرمائے میں اس کا محتاج ہوں۔',
      ),
    ],
    citations: [quran('Holy Quran', '28:24')],
    narrator: { en: 'Prophet Musa (as) — Quran', ur: 'حضرت موسیؑ — قرآن' },
  },

  success_in_work: {
    sections: [
      s(
        'main',
        'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
        'Rabbi ishrah li sadri wa yassir li amri',
        'My Lord, expand for me my chest and ease for me my task.',
        'اے میرے رب! میرا سینہ کھول دے اور میرا کام آسان فرما۔',
      ),
    ],
    citations: [quran('Holy Quran', '20:25-26')],
    narrator: { en: 'Prophet Musa (as) — Quran', ur: 'حضرت موسیؑ — قرآن' },
  },

  during_illness: {
    sections: [
      s(
        'main',
        'أَذْهِبِ الْبَاسَ رَبَّ النَّاسِ، اشْفِ وَأَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا',
        'Adhhibil-ba\'sa rabban-nas, ishfi wa antash-shafi, la shifa\'a illa shifa\'uk, shifa\'an la yughadiru saqama',
        'Remove the harm, O Lord of mankind, and heal — You are the Healer. There is no healing except Your healing, a healing that leaves no illness.',
        'درد دور فرما اے لوگوں کے رب! شفا دے، تو ہی شفا دینے والا ہے، تیرے سوا کوئی شفا نہیں، ایسی شفا دے کہ کوئی بیماری نہ رہے۔',
      ),
    ],
    citations: [hadith('Sahih al-Bukhari', '5672', 'Prophet Muhammad (s)')],
    narrator: { en: 'Prophet Muhammad (s)', ur: 'حضرت محمدؐ' },
  },

  visiting_sick: {
    sections: [
      s(
        'main',
        'لَا بَأْسَ، طَهُورٌ إِنْ شَاءَ اللَّهُ',
        'La ba\'sa, tahurun in sha Allah',
        'Do not worry; it is a purification, if Allah wills.',
        'کوئی حرج نہیں، ان شاء اللہ یہ پاکی ہے۔',
      ),
    ],
    citations: [hadith('Sahih al-Bukhari', '3616', 'Prophet Muhammad (s)')],
    narrator: { en: 'Prophet Muhammad (s)', ur: 'حضرت محمدؐ' },
  },

  protection_health: {
    sections: [
      s(
        'main',
        'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
        'Bismillahil-ladhi la yadurru ma\'asmihi shai\'un fil-ardi wa la fis-sama\'i wa huwas-sami\'ul-\'alim',
        'In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, All-Knowing.',
        'اللہ کے نام سے جس کے نام کے ساتھ زمین و آسمان کی کوئی چیز نقصان نہیں پہنچا سکتی، اور وہ سننے والا جاننے والا ہے۔',
      ),
    ],
    citations: [hadith('Jami\' at-Tirmidhi', '3388', 'Prophet Muhammad (s)')],
    narrator: { en: 'Prophet Muhammad (s)', ur: 'حضرت محمدؐ' },
  },

  evil_eye: {
    sections: [
      s(
        'main',
        'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        'A\'udhu bi kalimatillahit-tammati min sharri ma khalaq',
        'I seek refuge in the perfect words of Allah from the evil of what He has created.',
        'میں اللہ کے کامل کلمات کے ساتھ ہر اس چیز کی برائی سے پناہ مانگتا ہوں جو اس نے پیدا کی۔',
      ),
    ],
    citations: [hadith('Sahih Muslim', '2708', 'Prophet Muhammad (s)')],
    narrator: { en: 'Prophet Muhammad (s)', ur: 'حضرت محمدؐ' },
  },

  from_harm: {
    sections: [
      s(
        'main',
        'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
        'Hasbunallahu wa ni\'mal-wakil',
        'Sufficient for us is Allah, and He is the best Disposer of affairs.',
        'ہمارے لیے اللہ کافی ہے اور وہ بہترین کارساز ہے۔',
      ),
    ],
    citations: [quran('Holy Quran', '3:173')],
    narrator: { en: 'Holy Quran', ur: 'قرآن مجید' },
  },

  from_fear: {
    sections: [
      s(
        'main',
        'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
        'La ilaha illa Anta subhanaka inni kuntu minadh-dhalimin',
        'There is no deity except You; glory be to You. Indeed, I have been of the wrongdoers.',
        'تیرے سوا کوئی معبود نہیں، تو پاک ہے، بے شک میں ظالموں میں سے تھا۔',
      ),
    ],
    citations: [quran('Holy Quran', '21:87')],
    narrator: { en: 'Prophet Yunus (as) — Quran', ur: 'حضرت یونسؑ — قرآن' },
  },

  adhan_response: {
    sections: [
      s(
        'main',
        'اللَّهُمَّ رَبَّ هَٰذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
        'Allahumma rabba hadhihid-da\'watit-tammah, was-salatil-qaimah, ati Muhammadanil-wasilata wal-fadilah, wab\'athhu maqaman mahmoodanil-ladhi wa\'adtah',
        'O Allah, Lord of this perfect call and established prayer, grant Muhammad the intercession and excellence, and raise him to the praiseworthy station You promised him.',
        'اے اللہ! اس کامل پکار اور قائم نماز کے رب! محمدؐ کو وسیلہ و فضیلت عطا فرما اور انہیں مقامِ محمود پر فائز فرما۔',
      ),
    ],
    citations: [hadith('Sahih al-Bukhari', '614', 'Prophet Muhammad (s)')],
    narrator: { en: 'Prophet Muhammad (s)', ur: 'حضرت محمدؐ' },
  },

  after_prayer: {
    sections: [
      s(
        'tasbih',
        'سُبْحَانَ اللَّهِ (٣٣) · الْحَمْدُ لِلَّهِ (٣٣) · اللَّهُ أَكْبَرُ (٣٤)',
        'Subhanallah (33) · Alhamdulillah (33) · Allahu Akbar (34)',
        'Glory be to Allah (33 times), all praise is for Allah (33 times), Allah is the Greatest (34 times).',
        'اللہ پاک ہے (۳۳) · تمام تعریف اللہ کے لیے (۳۳) · اللہ سب سے بڑا ہے (۳۴)',
      ),
    ],
    citations: [hadith('Sahih Muslim', '597', 'Prophet Muhammad (s)')],
    narrator: { en: 'Prophet Muhammad (s)', ur: 'حضرت محمدؐ' },
  },

  before_prayer: {
    sections: [
      s(
        'main',
        'اللَّهُمَّ رَبَّ هَٰذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ',
        'Allahumma rabba hadhihid-da\'watit-tammah, was-salatil-qaimah, ati Muhammadanil-wasilata wal-fadilah',
        'O Allah, Lord of this perfect call and established prayer, grant Muhammad intercession and excellence.',
        'اے اللہ! اس کامل پکار اور قائم نماز کے رب! محمدؐ کو وسیلہ و فضیلت عطا فرما۔',
      ),
    ],
    citations: [hadith('Sahih al-Bukhari', '614', 'Prophet Muhammad (s)')],
    narrator: { en: 'Between adhan and iqamah', ur: 'اذان و اقامت کے درمیان' },
  },
};
