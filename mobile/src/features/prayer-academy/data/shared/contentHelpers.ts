import type {
  LocalizedText,
  PrayerAcademyId,
  PrayerAcademyMeta,
  PrayerCondition,
  PrayerGuideStep,
  PrayerRakatUnit,
  PrayerTimingRule,
  SunniDifferenceNote,
} from '../../types';

import { HAMD_AND_IKHLAS_ARABIC } from './recitationTexts';

export const L = (en: string, ur: string, ar: string): LocalizedText => ({ en, ur, ar });

export const COMMON_CONDITIONS: PrayerCondition[] = [
  {
    id: 'taharah',
    title: L('Taharah (Purity)', 'طہارت', 'الطهارة'),
    body: L(
      'Wudu (or ghusl when required) must be valid. Water must reach required limbs; najis substances removed from body, clothes, and place of prayer.',
      'وضو (یا ضرورت پر غسل) درست ہونا ضروری ہے۔ پانی مطلوب اعضاء تک پہنچے، جسم، کپڑے اور نماز کی جگہ پاک ہوں۔',
      'يجب صحة الوضوء (أو الغسل عند الوجوب). يصل الماء إلى الأعضاء المطلوبة وتزال النجاسات عن البدن والثوب ومكان الصلاة.',
    ),
  },
  {
    id: 'qibla',
    title: L('Facing Qibla', 'قبلہ رukh', 'استقبال القبلة'),
    body: L(
      'Stand facing the Ka\'bah in Makkah. Use the app\'s Qibla compass when unsure.',
      'کعبہ مکہ کی طرف منہ کر کے کھڑے ہوں۔ شک ہو تو ایپ کا قبلہ کمپاس استعمال کریں۔',
      'الوقوف مستقبلًا الكعبة المشرفة. استخدم بوصلة القبلة في التطبيق عند الشك.',
    ),
    deepLink: { screen: 'Qibla' },
  },
  {
    id: 'time',
    title: L('Within prescribed time', 'مقررہ وقت میں', 'داخل الوقت'),
    body: L(
      'Each wajib prayer has a specific time window. Pray before expiry; qadha becomes obligatory if missed without valid excuse.',
      'ہر واجب نماز کا مقررہ وقت ہے۔ وقت ختم ہونے سے پہلے ادا کریں؛ بغیر عذر چھوٹنے پر قضا واجب ہوتی ہے۔',
      'لكل صلاة واجبة وقت مخصص. أدِّها قبل انقضاء الوقت؛ يجب القضاء عند الفوات بلا عذر.',
    ),
  },
  {
    id: 'clothing_place',
    title: L('Covering & place', 'ستر و جگہ', 'الستر والمكان'),
    body: L(
      'Body must be covered per Islamic requirements. Prayer area must be clean (tahir) and not usurped (ghasbi).',
      'جسم شرعی حد تک ڈھکا ہو۔ نماز کی جگہ پاک (طاہر) ہو اور غصبی نہ ہو۔',
      'يجب ستر البدن شرعًا. يكون مكان الصلاة طاهرًا وغير مغصوب.',
    ),
  },
  {
    id: 'niyyah',
    title: L('Sincere intention (Niyyah)', 'نیت', 'النية'),
    body: L(
      'Form intention in the heart to perform this specific prayer for the sake of Allah. Spoken niyyah is not required.',
      'دل میں اللہ کی رضا کے لیے اس مخصوص نماز کی نیت کریں۔ زبان سے نیت کہنا ضروری نہیں۔',
      'انوي في القلب أداء هذه الصلاة المخصصة لله تعالى. لا تشترط النية باللسان.',
    ),
  },
];

export const COMMON_SUNNI_DIFFERENCES: SunniDifferenceNote[] = [
  {
    topic: L('Maghrib time', 'مغرب کا وقت', 'وقت المغرب'),
    jafari: L(
      'Maghrib begins after complete sunset; many marja require additional delay (~17 min) after sunset for adhan/prayer.',
      'مغرب مکمل غروب آفتاب کے بعد شروع؛ اکثر مراجع غروب کے بعد تقریباً ۱۷ منٹ کی مہلت تجویز کرتے ہیں۔',
      'يبدأ وقت المغرب بعد غروب الشمس الكامل؛ كثير من المراجع يشترطون مهلًا إضافيًا (~17 دقيقة) بعد الغروب.',
    ),
    sunni: L(
      'Many Sunni schools begin Maghrib immediately at sunset.',
      'بہت سے سنی فقہاء مغرب کو فوراً غروب پر شروع کرتے ہیں۔',
      'كثير من المذاهب السنية يبدأون المغرب مباشرة عند الغروب.',
    ),
  },
  {
    topic: L('Qunoot', 'قنوت', 'القنوت'),
    jafari: L(
      'Qunoot is obligatory in the 2nd rakat of Fajr, Maghrib, and Isha (not in Asr). Dhuhr varies by marja.',
      'قنوت فجر، مغرب اور عشاء کی دوسری رکعت میں واجب ہے (عصر میں نہیں)۔ ظہر میں مرجع کے مطابق فرق ہے۔',
      'القنوت واجب في الركعة الثانية من الفجر والمغرب والعشاء (لا في العصر). الظهر يختلف بحسب المرجع.',
    ),
    sunni: L(
      'Qunoot is generally not part of daily obligatory prayers in Sunni practice (except Witr in some schools).',
      'عام سنی طریقے میں روزانہ واجب نمازوں میں قنوت نہیں (کچھ میں وتر میں)۔',
      'القنوت ليس جزءًا من الصلوات اليومية عند أغلب السنة (إلا الوتر في بعض المذاهب).',
    ),
  },
  {
    topic: L('Middle rakats (3rd & 4th)', 'درمیانی رکعتیں', 'الركعتان الأخيرتان'),
    jafari: L(
      'In 3rd and 4th rakats of 4-rakat prayers: Surah al-Hamd only, OR al-Hamd + Tasbihat al-Arba\' three times before ruku.',
      'چار رکعت والی نماز کی ۳ویں و ۴ویں رکعت میں صرف الحمد، یا الحمد + تسبیحات اربع تین بار قبل رکوع۔',
      'في الركعة الثالثة والرابعة: الفاتحة فقط، أو الفاتحة + تسبيحات الأربع ثلاث مرات قبل الركوع.',
    ),
    sunni: L(
      'Sunni practice typically recites al-Hamd only in silent middle rakats of 4-rakat prayers.',
      'سنی طریقے میں عام طور پر درمیانی رکعتوں میں صرف الحمد پڑھی جاتی ہے۔',
      'عادةً يقرأ السنة الفاتحة فقط في الركعات الوسطى الصامتة.',
    ),
  },
  {
    topic: L('Tashahhud & Salawat', 'تشہد و درود', 'التشهد والصلوات'),
    jafari: L(
      'Shi\'a tashahhud includes salawat on Muhammad (s) and the Ahlul Bayt (as) with the established formula.',
      'شیا تشہد میں محمدؐ و آل محمدؐ پر مروّج فارمولے کے ساتھ درود شامل ہے۔',
      'يشمل التشهد عند الشيعة الصلوات على محمد (ص) وآل محمد (ع) بالصيغة المعتبرة.',
    ),
  },
];

export function dailyTimingRules(
  prayerKey: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha',
  title: LocalizedText,
  body: LocalizedText,
): PrayerTimingRule[] {
  return [
    {
      id: `${prayerKey}_window`,
      title,
      body,
      prayerTimeKey: prayerKey,
    },
    {
      id: `${prayerKey}_qadha`,
      title: L('If missed', 'اگر چھوٹ جائے', 'عند الفوات'),
      body: L(
        'Perform qadha as soon as possible with valid taharah and niyyah of qadha.',
        'جتنی جلدی ممکن ہو طہارت اور قضا کی نیت کے ساتھ ادا کریں۔',
        'تؤدى قضاءً في أقرب وقت مع طهارة ونية القضاء.',
      ),
    },
  ];
}

export function wajibRakats(count: number, prayerName: LocalizedText): PrayerRakatUnit[] {
  return [
    {
      id: 'wajib',
      kind: 'wajib',
      count,
      label: L('Wajib', 'واجب', 'واجب'),
      notes: prayerName,
    },
  ];
}

function sujudPair(prefix: string, rakatIndex: number): PrayerGuideStep[] {
  return [
    {
      id: `${prefix}_sujud_1`,
      kind: 'sujud',
      rakatIndex,
      titles: L('1st Sujood', 'پہلا سجدہ', 'السجدة الأولى'),
      body: L(
        'Prostrate with seven limbs touching the ground; say Subhana Rabbiyal A\'la wa bihamdih (3 times).',
        'سات اعضاء زمین پر؛ سبحان ربی الاعلی وبحمدہ (۳ بار)۔',
        'اسجد على سبعة أعضاء وقل سبحان ربي الأعلى وبحمده (٣ مرات).',
      ),
      arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَىٰ وَبِحَمْدِهِ',
      animationPose: 'sujud',
      animationAssetKey: 'sim/salah/sujud',
    },
    {
      id: `${prefix}_jalsa`,
      kind: 'jalsa',
      rakatIndex,
      titles: L('Jalsa (sit between two sujud)', 'جلسہ', 'الجلسة'),
      body: L(
        'Sit briefly between the two prostrations with composure before the second sujood.',
        'دو سجدوں کے درمیان مختصر جلسہ۔',
        'اجلس بين السجدتين قبل السجدة الثانية.',
      ),
      animationPose: 'jalsa',
      animationAssetKey: 'sim/salah/jalsa',
    },
    {
      id: `${prefix}_sujud_2`,
      kind: 'sujud',
      rakatIndex,
      titles: L('2nd Sujood', 'دوسرا سجدہ', 'السجدة الثانية'),
      body: L(
        'Prostrate again with the same dhikr (3 times).',
        'دوبارہ سجدہ؛ وہی ذکر (۳ بار)۔',
        'اسجد السجدة الثانية بنفس الذكر (٣ مرات).',
      ),
      arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَىٰ وَبِحَمْدِهِ',
      animationPose: 'sujud',
      animationAssetKey: 'sim/salah/sujud',
    },
  ];
}

function rukuStep(id: string, rakatIndex: number): PrayerGuideStep {
  return {
    id,
    kind: 'ruku',
    rakatIndex,
    titles: L('Ruku', 'رکوع', 'الركوع'),
    body: L(
      'Bow with straight back; say dhikr of ruku (e.g. Subhana Rabbiyal Azima wa bihamdih — 3 times).',
      'سیدھی کمر سے رکوع؛ سبحان ربی الاعظم وبحمدہ (۳ بار)۔',
      'اركع ظهرًا مستقيمًا وقل ذكر الركوع (٣ مرات).',
    ),
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْظَمِ وَبِحَمْدِهِ',
    animationPose: 'ruku',
    animationAssetKey: 'sim/salah/ruku',
  };
}

function prayerCompletionStep(): PrayerGuideStep {
  return {
    id: 'completion',
    kind: 'completion',
    titles: L('Conclude the prayer', 'نماز کا اختتام', 'إتمام الصلاة'),
    body: L(
      'After the final tashahhud, conclude with three takbirs (Allahu Akbar) as dhikr. Shia daily prayer does not require the Sunni-style dual salam ending.',
      'آخری تشہد کے بعد تین تکبیر (اللہ اکبر) سے اختتام۔ شیا واجب نماز میں سنی انداز کی دو طرف سلام لازم نہیں۔',
      'بعد التشهد الأخير، أكمل بثلاث تكبيرات. الصلاة الجعفرية لا تنتهي بالسلام السني على الصفة المعروفة.',
    ),
    arabic: 'اللّٰهُ أَكْبَرُ — اللّٰهُ أَكْبَرُ — اللّٰهُ أَكْبَرُ',
    transliteration: L('Allahu Akbar (3 times)', 'اللہ اکبر (۳ بار)', 'الله أكبر (٣ مرات)'),
    animationPose: 'completion_dhikr',
    animationAssetKey: 'sim/salah/completion',
    advancedBody: L(
      'Some prayers add tasbihat al-Arba\' in middle rakats; qunoot applies in 2nd rakat of Fajr, Maghrib, and Isha per most marja.',
      'درمیانی رکعتوں میں تسبیحات اربع؛ فجر، مغرب، عشاء کی دوسری رکعت میں قنوت۔',
      'تسبيحات الأربع في الركعات الوسطى؛ القنوت في الثانية من الفجر والمغرب والعشاء.',
    ),
  };
}

/** Standard 2-rakat Jafari wajib flow — Shia-accurate sequence (no Sunni salam ending) */
export function twoRakatWajibSteps(prayerName: LocalizedText, withQunoot = true): PrayerGuideStep[] {
  const steps: PrayerGuideStep[] = [
    {
      id: 'prep',
      kind: 'preparation',
      titles: L('Prepare', 'تیاری', 'الاستعداد'),
      body: L(
        'Ensure wudu, clean clothes, facing Qibla. Stand with composure (sukun).',
        'وضو، پاک کپڑے، قبلہ رukh یقینی بنائیں۔ باوقار کھڑے ہوں۔',
        'تحقق من الوضوء والثوب الطاهر واستقبال القبلة. قف بوقار.',
      ),
    },
    {
      id: 'niyyah',
      kind: 'niyyah',
      titles: L('Intention (Niyyah)', 'نیت', 'النية'),
      body: L(
        `Intend in your heart: I am performing ${prayerName.en} for the sake of Allah.`,
        `دل میں نیت کریں: میں اللہ کی رضا کے لیے ${prayerName.ur} ادا کر رہا/رahi ہوں۔`,
        `انوي: أؤدي ${prayerName.ar} لله تعالى.`,
      ),
      animationPose: 'standing_neutral',
    },
    {
      id: 'takbir',
      kind: 'takbir',
      titles: L('Takbiratul Ehram', 'تکبیرۂ احram', 'تكبيرة الإحرام'),
      body: L(
        'Raise hands to ears and say Allahu Akbar to enter the prayer.',
        'ہاتھ کانوں تک اٹھا کر اللہ اکبر کہہ کر نماز میں داخل ہوں۔',
        'ارفع يديك إلى الأذنين وقل الله أكبر للدخول في الصلاة.',
      ),
      arabic: 'اللّٰهُ أَكْبَرُ',
      transliteration: L('Allahu Akbar', 'اللہ اکبر', 'الله أكبر'),
      audioCueId: 'takbir',
      animationPose: 'takbir',
      animationAssetKey: 'sim/salah/takbir',
    },
    {
      id: 'r1_qiyam',
      kind: 'qiyam',
      rakatIndex: 1,
      titles: L('Qiyam — Standing', 'قیام', 'القيام'),
      body: L(
        'Stand upright facing Qibla with stillness before recitation.',
        'قبلہ رukh کھڑے رہیں؛ قراءت سے پہلے سکون۔',
        'قف مستقبل القبلة بسكينة قبل القراءة.',
      ),
      animationPose: 'standing_qiyam',
      animationAssetKey: 'sim/salah/qiyam',
    },
    {
      id: 'r1_recite',
      kind: 'recitation',
      rakatIndex: 1,
      titles: L('1st rakat — Qira\'at', 'پہلی رکعت — قراءت', 'الركعة الأولى — القراءة'),
      body: L(
        'Recite Surah al-Hamd, then another surah (e.g. al-Ikhlas). Then proceed to ruku.',
        'سورہ الحمد، پھر کوئی سورت (مثلاً اخلاص) پڑھیں۔ پھر رکوع میں جائیں۔',
        'اقرأ الفاتحة ثم سورة أخرى (مثل الإخلاص). ثم اركع.',
      ),
      arabic: HAMD_AND_IKHLAS_ARABIC,
      animationPose: 'standing_qiyam',
    },
    rukuStep('r1_ruku', 1),
    ...sujudPair('r1', 1),
    {
      id: 'r2_qiyam',
      kind: 'qiyam',
      rakatIndex: 2,
      titles: L('Stand for 2nd rakat', 'دوسری رکعت — قیام', 'الركعة الثانية — القيام'),
      body: L('Stand from jalsa and prepare for second rakat recitation.', 'جلسہ سے کھڑے ہوں۔', 'قم من الجلسة للركعة الثانية.'),
      animationPose: 'standing_qiyam',
    },
    {
      id: 'r2_recite',
      kind: 'recitation',
      rakatIndex: 2,
      titles: L('2nd rakat — Qira\'at', 'دوسری رکعت — قراءت', 'الركعة الثانية — القراءة'),
      body: L('Recite al-Hamd and another surah.', 'الحمد اور دوسری سورت پڑھیں۔', 'اقرأ الفاتحة وسورة أخرى.'),
      arabic: HAMD_AND_IKHLAS_ARABIC,
      animationPose: 'standing_qiyam',
    },
  ];

  if (withQunoot) {
    steps.push({
      id: 'r2_qunoot',
      kind: 'qunoot',
      rakatIndex: 2,
      titles: L('Qunoot', 'قنوت', 'القنوت'),
      body: L(
        'After recitation, before ruku: raise hands and recite the qunoot supplication with calm pause.',
        'قراءت کے بعد، رکوع سے پہلے: ہاتھ اٹھا کر قنوت پڑھیں۔',
        'بعد القراءة وقبل الركوع: ارفع يديك واقرأ القنوت.',
      ),
      arabic:
        'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
      fiqhRefs: [
        {
          source: L('Islamic Laws — Sayyid Sistani', 'احکام اسلامی — سید سistani', 'المسائل — السيد السistani'),
          citation: L('Rules of Qunoot in daily prayers', 'روزانہ نماز میں قنوت کے احکام', 'أحكام القنوت'),
          marja: 'sistani',
        },
      ],
      animationPose: 'qunoot_hands_raised',
      animationAssetKey: 'sim/salah/qunoot',
      pauseDurationMs: 4000,
    });
  }

  steps.push(
    rukuStep('r2_ruku', 2),
    ...sujudPair('r2', 2),
    {
      id: 'tashahhud',
      kind: 'tashahhud',
      titles: L('Tashahhud & Salawat', 'تشہد و درود', 'التشهد والصلوات'),
      body: L(
        'Sit and recite tashahhud with the Shia formula, then salawat on Muhammad (s) and Ahlul Bayt (as).',
        'بیٹھ کر شیا تشہد اور آل محمدؐ پر درود پڑھیں۔',
        'اجلس واقرأ التشهد الشيعي والصلوات على محمد (ص) وآل محمد (ع).',
      ),
      animationPose: 'tashahhud_sitting',
      animationAssetKey: 'sim/salah/tashahhud',
      fiqhRefs: [
        {
          source: L('Narrated from Imam Ja\'far al-Sadiq (as)', 'امام جعفر صادقؑ سے روایت', 'روي عن الإمام جعفر الصادق (ع)'),
          citation: L('Form of tashahhud in Shi\'a prayer', 'شیا نماز میں تشہد', 'صيغة التشهد عند الشيعة'),
        },
      ],
    },
    prayerCompletionStep(),
  );

  return steps;
}

/** Extend 2-rakat flow to 4-rakat wajib (Dhuhr, Asr, Isha) */
export function fourRakatWajibSteps(
  prayerName: LocalizedText,
  withQunootSecondRakat = false,
): PrayerGuideStep[] {
  const base = twoRakatWajibSteps(prayerName, withQunootSecondRakat);
  const middle: PrayerGuideStep[] = [
    {
      id: 'r3_stand',
      kind: 'rakat_transition',
      rakatIndex: 3,
      titles: L('3rd rakat', 'تیسری رکعت', 'الركعة الثالثة'),
      body: L(
        'Stand from tashahhud without concluding the prayer. Recite al-Hamd only, OR al-Hamd + Tasbihat al-Arba\' (3×) before ruku.',
        'نماز مکمل کیے بغیر تشہد سے کھڑے ہوں۔ صرف الحمد، یا الحمد + تسبیحات اربع (۳ بار) قبل رکوع۔',
        'قم من التشهد دون إتمام الصلاة. اقرأ الفاتحة فقط، أو الفاتحة + تسبيحات الأربع (٣×) قبل الركوع.',
      ),
      arabic:
        'سُبْحَانَ اللّٰهِ وَالْحَمْدُ لِلّٰهِ وَلَا إِلٰهَ إِلَّا اللّٰهُ وَاللّٰهُ أَكْبَرُ',
      advancedBody: L(
        'Tasbihat al-Arba\' is a recommended alternative to reciting only al-Hamd in the 3rd and 4th rakats.',
        'تیسری و چوتھی رکعت میں صرف الحمد کی بجائے تسبیحات اربع مستحب متبادل ہے۔',
        'تسبيحات الأربع بديل مستحب عن الفاتحة فقط في الركعتين الثالثة والرابعة.',
      ),
    },
    {
      id: 'r3_ruku_sujud',
      kind: 'ruku',
      rakatIndex: 3,
      titles: L('Ruku & sujud (3rd)', 'رکوع و سجدے (۳)', 'الركوع والسجدتان (٣)'),
      body: L('Ruku once, then two prostrations with jalsa between.', 'رکوع، پھر جلسہ کے ساتھ دو سجدے۔', 'اركع ثم اسجد سجدتين مع الجلسة.'),
    },
    {
      id: 'r4_stand',
      kind: 'rakat_transition',
      rakatIndex: 4,
      titles: L('4th rakat', 'چوتھی رکعت', 'الركعة الرابعة'),
      body: L(
        'Stand; recite as in 3rd rakat. Then ruku, two sujud, final tashahhud, and conclude with three takbirs.',
        'کھڑے ہوں؛ تیسری رکعت کی طرح۔ پھر رکوع، دو سجدے، آخری تشہد و تین تکبیر سے اختتام۔',
        'قم واقرأ كالركعة الثالثة. ثم اركع واسجد والتشهد الأخير وثلاث تكبيرات.',
      ),
    },
  ];

  const withoutFinal = base.filter((s) => s.id !== 'tashahhud' && s.id !== 'completion');
  return [
    ...withoutFinal,
    ...middle,
    base.find((s) => s.id === 'tashahhud')!,
    base.find((s) => s.id === 'completion')!,
  ];
}

/** Maghrib: 3 wajib rakats */
export function threeRakatWajibSteps(prayerName: LocalizedText): PrayerGuideStep[] {
  const two = twoRakatWajibSteps(prayerName, true);
  const withoutFinal = two.filter((s) => s.id !== 'tashahhud' && s.id !== 'completion');
  return [
    ...withoutFinal,
    {
      id: 'r3_stand',
      kind: 'rakat_transition',
      rakatIndex: 3,
      titles: L('3rd rakat', 'تیسری رکعت', 'الركعة الثالثة'),
      body: L(
        'Stand without concluding the prayer. Recite al-Hamd only (or Tasbihat al-Arba\' 3×). Ruku, two sujud, tashahhud, then three takbirs to conclude.',
        'نماز مکمل کیے بغیر کھڑے ہوں۔ صرف الحمد (یا تسبیحات اربع)۔ رکوع، دو سجدے، تشہد، پھر تین تکبیر۔',
        'قم دون إتمام الصلاة. اقرأ الفاتحة. اركع واسجد والتشهد ثم ثلاث تكبيرات.',
      ),
    },
    two.find((s) => s.id === 'tashahhud')!,
    two.find((s) => s.id === 'completion')!,
  ];
}

import { getCatalogMeta } from '../../constants/catalog';

export function metaFromCatalog(id: PrayerAcademyId): PrayerAcademyMeta {
  return getCatalogMeta(id);
}
