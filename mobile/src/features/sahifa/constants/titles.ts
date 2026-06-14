/** Canonical titles for all 54 supplications of Al-Sahifa al-Sajjadiyya. */
export const SAHIFA_TITLES: Array<{
  number: number;
  slug: string;
  en: string;
  ur: string;
  ar: string;
  subtitleEn: string;
  subtitleUr: string;
  themes: string[];
  minutes: number;
  sections: number;
}> = [
  { number: 1, slug: 'makarim-al-akhlaq', en: 'The Praise of Allah (Makarim al-Akhlaq)', ur: 'حمدِ باری — مکارم الاخلاق', ar: 'حمد الله — مكارم الأخلاق', subtitleEn: 'Noble moral traits and praise of Allah', subtitleUr: 'اخلاقِ حسنہ اور حمدِ باری', themes: ['praise', 'morals'], minutes: 20, sections: 10 },
  { number: 2, slug: 'blessing-muhammad', en: 'Blessing upon Muhammad and his Household', ur: 'درودِ محمدؐ و آل محمدؐ', ar: 'الصلاة على محمد وآل محمد', subtitleEn: 'Salutations upon the Prophet and Ahlul Bayt', subtitleUr: 'نبیؐ و اہل بیتؑ پر درود', themes: ['salawat'], minutes: 5, sections: 3 },
  { number: 3, slug: 'morning-evening', en: 'In the Morning and Evening', ur: 'صبح و شام کی دعا', ar: 'دعاء الصباح والمساء', subtitleEn: 'Daily supplication for morning and evening', subtitleUr: 'روزانہ صبح و شام کی دعا', themes: ['daily'], minutes: 8, sections: 4 },
  { number: 4, slug: 'entering-bath', en: 'When Entering the Bath', ur: 'حمام میں داخل ہوتے وقت', ar: 'دعاء دخول الحمام', subtitleEn: 'Supplication upon entering the bath', subtitleUr: 'غسل خانے میں داخل ہونے کی دعا', themes: ['daily'], minutes: 2, sections: 2 },
  { number: 5, slug: 'leaving-bath', en: 'When Leaving the Bath', ur: 'حمام سے نکلتے وقت', ar: 'دعاء الخروج من الحمام', subtitleEn: 'Supplication upon leaving the bath', subtitleUr: 'غسل خانے سے نکلنے کی دعا', themes: ['daily'], minutes: 2, sections: 2 },
  { number: 6, slug: 'entering-mosque', en: 'When Entering the Mosque', ur: 'مسجد میں داخل ہوتے وقت', ar: 'دعاء دخول المسجد', subtitleEn: 'Supplication upon entering the mosque', subtitleUr: 'مسجد میں داخل ہونے کی دعا', themes: ['prayer'], minutes: 2, sections: 2 },
  { number: 7, slug: 'leaving-mosque', en: 'When Leaving the Mosque', ur: 'مسجد سے نکلتے وقت', ar: 'دعاء الخروج من المسجد', subtitleEn: 'Supplication upon leaving the mosque', subtitleUr: 'مسجد سے نکلنے کی دعا', themes: ['prayer'], minutes: 2, sections: 2 },
  { number: 8, slug: 'going-sleep', en: 'When Going to Sleep', ur: 'سونے کے وقت', ar: 'دعاء النوم', subtitleEn: 'Supplication before sleep', subtitleUr: 'سونے سے پہلے کی دعا', themes: ['daily'], minutes: 5, sections: 3 },
  { number: 9, slug: 'awakening', en: 'When Awakening from Sleep', ur: 'نیند سے بیدار ہونے پر', ar: 'دعاء الاستيقاظ', subtitleEn: 'Supplication upon waking', subtitleUr: 'نیند سے جاگنے کی دعا', themes: ['daily'], minutes: 3, sections: 2 },
  { number: 10, slug: 'wearing-clothes', en: 'When Wearing Clothes', ur: 'کپڑے پہنتے وقت', ar: 'دعاء لبس الثوب', subtitleEn: 'Supplication when dressing', subtitleUr: 'لباس پہننے کی دعا', themes: ['daily'], minutes: 2, sections: 2 },
  { number: 11, slug: 'asking-forgiveness', en: 'Asking Forgiveness', ur: 'استغفار', ar: 'دعاء الاستغفار', subtitleEn: 'Seeking forgiveness from Allah', subtitleUr: 'اللہ سے مغفرت طلب کرنا', themes: ['forgiveness'], minutes: 10, sections: 5 },
  { number: 12, slug: 'forbearance', en: 'For Forbearance', ur: 'حلم و بردباری', ar: 'دعاء الحلم', subtitleEn: 'Asking Allah for forbearance', subtitleUr: 'حلم و بردباری کی دعا', themes: ['patience'], minutes: 5, sections: 3 },
  { number: 13, slug: 'patience', en: 'When Struggling with Patience', ur: 'صبر کی دعا', ar: 'دعاء الصبر', subtitleEn: 'Supplication for steadfastness', subtitleUr: 'صبر و استقامت کی دعا', themes: ['patience'], minutes: 6, sections: 3 },
  { number: 14, slug: 'refuge-satan', en: 'Seeking Refuge from Satan', ur: 'شیطان سے پناہ', ar: 'دعاء التعوذ من الشيطان', subtitleEn: 'Seeking Allah\'s protection from Satan', subtitleUr: 'شیطان سے اللہ کی پناہ', themes: ['protection'], minutes: 4, sections: 2 },
  { number: 15, slug: 'asylum-allah', en: 'Seeking Asylum with Allah', ur: 'اللہ کی پناہ', ar: 'دعاء اللجوء إلى الله', subtitleEn: 'Taking refuge in Allah alone', subtitleUr: 'صرف اللہ کی پناہ', themes: ['protection'], minutes: 8, sections: 4 },
  { number: 16, slug: 'all-needs', en: 'Asking for All Needs', ur: 'تمام حاجات', ar: 'دعاء الحاجات', subtitleEn: 'Comprehensive supplication for all needs', subtitleUr: 'تمام ضروریات کی جامع دعا', themes: ['needs'], minutes: 12, sections: 5 },
  { number: 17, slug: 'praise-thanks', en: 'Supplication of Praise and Thanks', ur: 'حمد و شکر', ar: 'دعاء الحمد والشكر', subtitleEn: 'Praising and thanking Allah', subtitleUr: 'اللہ کی حمد و شکر', themes: ['gratitude'], minutes: 6, sections: 3 },
  { number: 18, slug: 'children', en: 'Prayers for Children', ur: 'اولاد کے لیے', ar: 'دعاء الأولاد', subtitleEn: 'Supplication for righteous offspring', subtitleUr: 'نیک اولاد کی دعا', themes: ['family'], minutes: 5, sections: 3 },
  { number: 19, slug: 'neighbors', en: 'Prayers for Neighbors', ur: 'پڑوسیوں کے لیے', ar: 'دعاء الجيران', subtitleEn: 'Supplication for neighbors', subtitleUr: 'پڑوسیوں کی بھلائی کی دعا', themes: ['community'], minutes: 4, sections: 2 },
  { number: 20, slug: 'distress', en: 'In Distress and Sorrow', ur: 'غم و مصیبت میں', ar: 'دعاء الهم والحزن', subtitleEn: 'Supplication in times of grief', subtitleUr: 'غم و اندوہ میں دعا', themes: ['distress'], minutes: 10, sections: 5 },
  { number: 21, slug: 'confession', en: 'In Confession and Acknowledgement', ur: 'اعتراف و اقرار', ar: 'دعاء الاعتراف', subtitleEn: 'Confessing sins before Allah', subtitleUr: 'گناہوں کا اعتراف', themes: ['forgiveness'], minutes: 8, sections: 4 },
  { number: 22, slug: 'guidance', en: 'For Guidance', ur: 'ہدایت کی دعا', ar: 'دعاء الهداية', subtitleEn: 'Asking Allah for right guidance', subtitleUr: 'سیدھے راستے کی دعا', themes: ['guidance'], minutes: 6, sections: 3 },
  { number: 23, slug: 'guardianship', en: 'For Guardianship', ur: 'نگہبانی کی دعا', ar: 'دعاء الولاية', subtitleEn: 'Seeking Allah as guardian', subtitleUr: 'اللہ کی ولایت طلب کرنا', themes: ['protection'], minutes: 5, sections: 3 },
  { number: 24, slug: 'when-sick', en: 'When Sick', ur: 'بیماری میں', ar: 'دعاء المرض', subtitleEn: 'Supplication during illness', subtitleUr: 'بیماری میں دعا', themes: ['healing'], minutes: 6, sections: 3 },
  { number: 25, slug: 'visiting-sick', en: 'When Visiting the Sick', ur: 'مریض کی عیادت', ar: 'دعاء عيادة المريض', subtitleEn: 'Supplication when visiting the ill', subtitleUr: 'مریض کی عیادت کی دعا', themes: ['healing'], minutes: 4, sections: 2 },
  { number: 26, slug: 'travel', en: 'When Travelling', ur: 'سفر میں', ar: 'دعاء السفر', subtitleEn: 'Supplication for journey', subtitleUr: 'سفر کی دعا', themes: ['travel'], minutes: 5, sections: 3 },
  { number: 27, slug: 'return-travel', en: 'When Returning from Travel', ur: 'سفر سے واپسی', ar: 'دعاء العودة من السفر', subtitleEn: 'Supplication upon returning home', subtitleUr: 'وطن واپسی کی دعا', themes: ['travel'], minutes: 4, sections: 2 },
  { number: 28, slug: 'fear-enemy', en: 'When Fear of an Enemy', ur: 'دشمن سے خوف', ar: 'دعاء الخوف من العدو', subtitleEn: 'Seeking protection from enemies', subtitleUr: 'دشمن سے حفاظت', themes: ['protection'], minutes: 5, sections: 3 },
  { number: 29, slug: 'rain', en: 'Asking for Rain', ur: 'بارش کی دعا', ar: 'دعاء الاستسقاء', subtitleEn: 'Supplication for rain', subtitleUr: 'بارش طلب کرنے کی دعا', themes: ['nature'], minutes: 3, sections: 2 },
  { number: 30, slug: 'against-enemy', en: 'Against an Enemy', ur: 'دشمن کے خلاف', ar: 'دعاء العدو', subtitleEn: 'Supplication against oppressors', subtitleUr: 'ظالموں کے خلاف دعا', themes: ['protection'], minutes: 5, sections: 3 },
  { number: 31, slug: 'friday', en: 'On Friday', ur: 'جمعہ کی دعا', ar: 'دعاء يوم الجمعة', subtitleEn: 'The famous Friday supplication', subtitleUr: 'مشہور جمعہ کی دعا', themes: ['friday'], minutes: 15, sections: 6 },
  { number: 32, slug: 'blessings-muhammad-extended', en: 'Blessings upon Muhammad (Extended)', ur: 'درودِ محمدؐ (تفصیلی)', ar: 'الصلاة على محمد (مفصلة)', subtitleEn: 'Extended salutations upon the Prophet', subtitleUr: 'تفصیلی درود', themes: ['salawat'], minutes: 8, sections: 4 },
  { number: 33, slug: 'seeking-good', en: 'Seeking Good in This World and the Next', ur: 'دنیا و آخرت کی بھلائی', ar: 'دعاء خير الدنيا والآخرة', subtitleEn: 'Asking for good in both worlds', subtitleUr: 'دنیا و آخرت کی بھلائی', themes: ['needs'], minutes: 6, sections: 3 },
  { number: 34, slug: 'repentance', en: 'Repentance', ur: 'توبہ', ar: 'دعاء التوبة', subtitleEn: 'Turning back to Allah in repentance', subtitleUr: 'اللہ کی طرف رجوع', themes: ['forgiveness'], minutes: 7, sections: 3 },
  { number: 35, slug: 'parents', en: 'For Parents', ur: 'والدین کے لیے', ar: 'دعاء الوالدين', subtitleEn: 'Supplication for parents', subtitleUr: 'والدین کی مغفرت و سلامتی', themes: ['family'], minutes: 5, sections: 3 },
  { number: 36, slug: 'relatives', en: 'For Relatives', ur: 'رشتہ داروں کے لیے', ar: 'دعاء الأقارب', subtitleEn: 'Supplication for kin', subtitleUr: 'رشتہ داروں کی دعا', themes: ['family'], minutes: 4, sections: 2 },
  { number: 37, slug: 'provision', en: 'For Provision', ur: 'رزق کی دعا', ar: 'دعاء الرزق', subtitleEn: 'Asking Allah for sustenance', subtitleUr: 'رزق حلال کی دعا', themes: ['needs'], minutes: 5, sections: 3 },
  { number: 38, slug: 'knowledge', en: 'For Knowledge', ur: 'علم کی دعا', ar: 'دعاء العلم', subtitleEn: 'Seeking beneficial knowledge', subtitleUr: 'نافع علم کی دعا', themes: ['knowledge'], minutes: 5, sections: 3 },
  { number: 39, slug: 'deliverance', en: 'For Deliverance from Unbelief', ur: 'کفر سے نجات', ar: 'دعاء النجاة من الكفر', subtitleEn: 'Seeking deliverance from disbelief', subtitleUr: 'کفر و شرک سے نجات', themes: ['faith'], minutes: 4, sections: 2 },
  { number: 40, slug: 'steadfastness', en: 'For Steadfastness in Faith', ur: 'ایمان میں ثابت قدمی', ar: 'دعاء الثبات على الإيمان', subtitleEn: 'Asking to remain firm in faith', subtitleUr: 'ایمان پر ثابت قدم رہنا', themes: ['faith'], minutes: 5, sections: 3 },
  { number: 41, slug: 'good-end', en: 'For a Good End', ur: 'حسن خاتمہ', ar: 'دعاء حسن الخاتمة', subtitleEn: 'Asking for a good ending', subtitleUr: 'اچھے انجام کی دعا', themes: ['afterlife'], minutes: 4, sections: 2 },
  { number: 42, slug: 'fear-punishment', en: 'Fear of Punishment', ur: 'عذاب سے ڈر', ar: 'دعاء خوف العذاب', subtitleEn: 'Seeking refuge from divine punishment', subtitleUr: 'اللہ کے عذاب سے پناہ', themes: ['afterlife'], minutes: 5, sections: 3 },
  { number: 43, slug: 'fear-hell', en: 'Fear of Hell', ur: 'جہنم سے ڈر', ar: 'دعاء خوف النار', subtitleEn: 'Seeking protection from Hellfire', subtitleUr: 'دوزخ سے بچنے کی دعا', themes: ['afterlife'], minutes: 5, sections: 3 },
  { number: 44, slug: 'fear-resurrection', en: 'Fear of the Resurrection', ur: 'قیامت کا خوف', ar: 'دعاء خوف القيامة', subtitleEn: 'Supplication about the Day of Judgment', subtitleUr: 'قیامت کے دن کا خوف', themes: ['afterlife'], minutes: 5, sections: 3 },
  { number: 45, slug: 'fear-account', en: 'Fear of the Reckoning', ur: 'حساب کا خوف', ar: 'دعاء خوف الحساب', subtitleEn: 'Asking ease in the accounting', subtitleUr: 'آسان حساب کی دعا', themes: ['afterlife'], minutes: 5, sections: 3 },
  { number: 46, slug: 'fear-scale', en: 'Fear of the Scale', ur: 'میزان کا خوف', ar: 'دعاء خوف الميزان', subtitleEn: 'Supplication about the scales of deeds', subtitleUr: 'میزان پر بھاری نہ ہونا', themes: ['afterlife'], minutes: 4, sections: 2 },
  { number: 47, slug: 'when-sick-extended', en: 'When Sick (Extended)', ur: 'بیماری (تفصیلی)', ar: 'دعاء المرض (مفصل)', subtitleEn: 'Extended supplication for the ill', subtitleUr: 'بیماری میں تفصیلی دعا', themes: ['healing'], minutes: 8, sections: 4 },
  { number: 48, slug: 'visiting-graves', en: 'When Visiting Graves', ur: 'قبرستان میں', ar: 'دعاء زيارة القبور', subtitleEn: 'Supplication at the cemetery', subtitleUr: 'قبرستان میں دعا', themes: ['afterlife'], minutes: 4, sections: 2 },
  { number: 49, slug: 'parting-companion', en: 'When Parting from a Companion', ur: 'رفیق سے جدائی', ar: 'دعاء فراق الأخ', subtitleEn: 'Farewell supplication', subtitleUr: 'الوداع کی دعا', themes: ['community'], minutes: 3, sections: 2 },
  { number: 50, slug: 'breaking-fast', en: 'When Breaking the Fast', ur: 'افطار کے وقت', ar: 'دعاء الإفطار', subtitleEn: 'Supplication at iftar', subtitleUr: 'روزہ افطار کی دعا', themes: ['ramadan'], minutes: 3, sections: 2 },
  { number: 51, slug: 'laylat-al-qadr', en: 'On Laylat al-Qadr', ur: 'شبِ قدر', ar: 'دعاء ليلة القدر', subtitleEn: 'Supplication for the Night of Power', subtitleUr: 'شب قدر کی دعا', themes: ['ramadan'], minutes: 6, sections: 3 },
  { number: 52, slug: 'eid', en: 'On Eid', ur: 'عید کی دعا', ar: 'دعاء العيد', subtitleEn: 'Supplication on Eid day', subtitleUr: 'عید کی مبارکباد دعا', themes: ['eid'], minutes: 4, sections: 2 },
  { number: 53, slug: 'seeking-intercession', en: 'Seeking Intercession', ur: 'شفاعت کی دعا', ar: 'دعاء الشفاعة', subtitleEn: 'Asking intercession of the Prophet and Imams', subtitleUr: 'نبیؐ و ائمہؑ کی شفاعت', themes: ['intercession'], minutes: 6, sections: 3 },
  { number: 54, slug: 'parting-world', en: 'When Parting from the World', ur: 'دنیا سے رخصتی', ar: 'دعاء فراق الدنيا', subtitleEn: 'The final supplication — farewell to the world', subtitleUr: 'آخری دعا — دنیا سے الوداع', themes: ['afterlife'], minutes: 10, sections: 5 },
];

export function sahifaId(number: number): `sahifa_${string}` {
  return `sahifa_${String(number).padStart(3, '0')}` as `sahifa_${string}`;
}
