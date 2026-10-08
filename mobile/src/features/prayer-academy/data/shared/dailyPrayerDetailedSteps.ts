import type { LocalizedText, PrayerGuideStep } from '../../types';
import { E, MF_L } from './englishText';
import {
  ASTAGHFIR,
  FATIHA,
  QADR,
  QUNOOT,
  RUKU_DHIKR,
  SAMI_ALLAH,
  STAND_DUA,
  SUJUD_DHIKR,
  TAKBIR,
  TASHAHHUD,
  TASLIM,
  TASBIHAT,
  withRecitation,
} from './recitationContent';

export function sujudPair(prefix: string, rakatIndex: number): PrayerGuideStep[] {
  return [
    withRecitation(
      {
        id: `${prefix}_sujud_1`,
        kind: 'sujud',
        rakatIndex,
        titles: E('First Sujood (prostration)', 'پہلا سجدہ', 'السجدة الأولى'),
        body: MF_L(
          'Go down for Sujood. Seven points of contact: forehead, both palms, both knees, both big toes.',
          'سجدے کے لیے جھکیں۔ سات اعضاء زمین پر: پیشانی، دونوں ہتھیلیاں، دونوں گھٹنے، دونوں انگوٹھے۔',
          'انزل للسجود. سبعة أعضاء تلامس الأرض: الجبهة، والكفان، والركبتان، والإبهامان.',
          'Recite at least once (see Arabic below).',
          'کم از کم ایک بار پڑھیں (عربی نیچے دیکھیں)۔',
          'اقرأ مرة واحدة على الأقل (انظر العربية أدناه).',
          'Recite at least once in a soft voice; hands close to the body.',
          'آہستہ آواز میں کم از کم ایک بار؛ ہاتھ جسم کے قریب۔',
          'اقرأ مرة واحدة على الأقل بصوت خافت؛ واليدان قريبتان من الجسم.',
        ),
        animationPose: 'sujud',
      },
      SUJUD_DHIKR,
    ),
    withRecitation(
      {
        id: `${prefix}_jalsa`,
        kind: 'jalsa',
        rakatIndex,
        titles: E('Sit between two sujud', 'دو سجدوں کے درمیان بیٹھنا', 'الجلوس بين السجدتين'),
        body: E(
          'Sit with the ankle of the right foot in the sole of the left foot. Say Takbir, optionally Astaghfirullah, then Takbir again.',
          'دائیں پاؤں کی ٹخنے کو بائیں پاؤں کے تلے پر رکھ کر بیٹھیں۔ تکبیر کہیں، اختیاری استغفار، پھر دوبارہ تکبیر۔',
          'اجلس واضعاً كعب القدم اليمنى على باطن القدم اليسرى. قل التكبير، واستغفر الله إن شئت، ثم التكبير مرة أخرى.',
        ),
        animationPose: 'jalsa',
      },
      ASTAGHFIR,
    ),
    withRecitation(
      {
        id: `${prefix}_sujud_2`,
        kind: 'sujud',
        rakatIndex,
        titles: E('Second Sujood', 'دوسرا سجدہ', 'السجدة الثانية'),
        body: E(
          'Repeat Sujood in the same method as the first.',
          'پہلے سجدے کی طرح دوسرا سجدہ کریں۔',
          'كرر السجود بنفس طريقة الأولى.',
        ),
        animationPose: 'sujud',
      },
      SUJUD_DHIKR,
    ),
  ];
}

export function rukuStep(id: string, rakatIndex: number): PrayerGuideStep {
  return withRecitation(
    {
      id,
      kind: 'ruku',
      rakatIndex,
      titles: E('Rukoo\' (bowing)', 'رکوع', 'الركوع'),
      body: MF_L(
        'Bow until hands can be placed on the knees. Recite at least once (see Arabic below).',
        'اتنا جھکیں کہ ہاتھ گھٹنوں پر آ جائیں۔ کم از کم ایک بار پڑھیں (عربی نیچے)۔',
        'اركع حتى تضع اليدين على الركبتين. اقرأ مرة واحدة على الأقل (انظر العربية أدناه).',
        'Keep back straight; hands on knees.',
        'کمر سیدھی؛ ہاتھ گھٹنوں پر۔',
        'الظهر مستقيماً؛ واليدان على الركبتين.',
        'Fingers joined on thighs above the knees; back in an arch fashion.',
        'انگلیاں ملا کر گھٹنوں سے اوپر رانوں پر؛ کمر قوس کی صورت میں۔',
        'الأصابع متلاصقة على الفخذين فوق الركبتين؛ والظهر مقوساً.',
      ),
      animationPose: 'ruku',
    },
    RUKU_DHIKR,
  );
}

export function standTransition(id: string, rakatIndex: number, label: LocalizedText): PrayerGuideStep {
  return withRecitation(
    {
      id,
      kind: 'rakat_transition',
      rakatIndex,
      titles: label,
      body: E(
        'Rise to standing while optionally reciting:',
        'کھڑے ہوتے ہوئے اختیاری طور پر پڑھیں:',
        'قم واقفاً مع التلاوة اختيارياً:',
      ),
      animationPose: 'qiyam',
    },
    STAND_DUA,
  );
}

export function tashahhudStep(
  id: string,
  rakatIndex: number | undefined,
  title: LocalizedText,
): PrayerGuideStep {
  return withRecitation(
    {
      id,
      kind: 'tashahhud',
      rakatIndex,
      titles: title,
      body: E(
        'Sit and recite Tashahhud including salawat on Muhammad and Aal Muhammad.',
        'بیٹھ کر تشہد پڑھیں، محمد و آل محمد پر درود سمیت۔',
        'اجلس واقرأ التشهد متضمناً الصلاة على محمد وآل محمد.',
      ),
      animationPose: 'tashahhud',
    },
    TASHAHHUD,
  );
}

export function tasbihatRakat(prefix: string, rakatIndex: number, title: LocalizedText): PrayerGuideStep {
  return withRecitation(
    {
      id: `${prefix}_r${rakatIndex}_tasbihat`,
      kind: 'tasbihat',
      rakatIndex,
      titles: title,
      body: E(
        'Recite al-Tasbihat al-Arba`ah three times (×3).',
        'تسبیحات اربع تین مرتبہ (×۳) پڑھیں۔',
        'اقرأ التسبيحات الأربع ثلاث مرات (×٣).',
      ),
      animationPose: 'qiyam',
    },
    TASBIHAT,
  );
}

export function fatihaStep(id: string, rakatIndex?: number): PrayerGuideStep {
  return withRecitation(
    {
      id,
      kind: 'recitation',
      rakatIndex,
      titles: E('Suratul Fatihah', 'سورۃ الفاتحہ', 'سورة الفاتحة'),
      body: E(
        'Recite Suratul Fatihah (the opening) of the Holy Qur\'an.',
        'قرآن مجید کی سورۃ الفاتحہ (افتتاح) پڑھیں۔',
        'اقرأ سورة الفاتحة من القرآن الكريم.',
      ),
      animationPose: 'qiyam',
    },
    FATIHA,
  );
}

export function secondSurahStep(id: string, rakatIndex?: number): PrayerGuideStep {
  return withRecitation(
    {
      id,
      kind: 'recitation',
      rakatIndex,
      titles: E('Second Surah — e.g. Suratul Qadr', 'دوسری سورت — مثلاً سورۃ القدر', 'السورة الثانية — مثلاً سورة القدر'),
      body: E(
        'Recite any complete chapter, then Takbir. Example: Suratul Qadr (Night of Power).',
        'کوئی مکمل سورت پڑھیں، پھر تکبیر۔ مثال: سورۃ القدر (شب قدر)۔',
        'اقرأ أي سورة كاملة ثم التكبير. مثال: سورة القدر (ليلة القدر).',
      ),
      animationPose: 'qiyam',
    },
    QADR,
  );
}

export function prayerClosingSteps(prefix: string, prayerLabel: string): PrayerGuideStep[] {
  return [
    withRecitation(
      {
        id: `${prefix}_taslim`,
        kind: 'salam',
        titles: E('Taslim (Salutation)', 'تسلیم (سلام)', 'التسليم'),
        body: E(
          'Recite Taslim to complete the prayer.',
          'نماز مکمل کرنے کے لیے تسلیم پڑھیں۔',
          'اقرأ التسليم لإتمام الصلاة.',
        ),
        animationPose: 'salam',
      },
      TASLIM,
    ),
    withRecitation(
      {
        id: `${prefix}_takbir_after`,
        kind: 'completion',
        titles: E('After Salaah', 'نماز کے بعد', 'بعد الصلاة'),
        body: E(
          'It is recommended to say Takbir three times thereafter.',
          'اس کے بعد تین بار تکبیر کہنا مستحب ہے۔',
          'يُستحب قول التكبير ثلاث مرات بعد ذلك.',
        ),
        citations: [{ source: 'ShiaSalaah.org', verified: true, note: `${prayerLabel} guide` }],
      },
      TAKBIR,
    ),
  ];
}

export function commonPrepSteps(prefix: string): PrayerGuideStep[] {
  return [
    {
      id: `${prefix}_prep`,
      kind: 'preparation',
      titles: E('Before Salaah', 'نماز سے پہلے', 'قبل الصلاة'),
      body: E(
        'It is compulsory to perform Wudhu prior to performing Salaah. Ensure a clean body, clean place, and clothing free of impurities. All recitations must be in Arabic.',
        'نماز سے پہلے وضو کرنا واجب ہے۔ جسم، جگہ اور کپڑے پاک ہوں، نجاست سے پاک۔ تمام تلاوت عربی میں ہو۔',
        'يجب الوضوء قبل الصلاة. تحقق من طهارة الجسد والمكان والثوب. جميع التلاوات بالعربية.',
      ),
      advancedBody: MF_L(
        'Minimum clothing during Salaah:',
        'نماز میں کم از کم پردہ:',
        'الحد الأدنى للستر في الصلاة:',
        'Cover from the navel to the knees; covering the shoulders is preferable.',
        'ناف سے گھٹنوں تک ڈھانپیں؛ کندھے ڈھانپنا افضل ہے۔',
        'ستر من السرة إلى الركبتين؛ ستر المنكبين أفضل.',
        'Cover all of the body (including the head) except the face and hands.',
        'سارا جسم (سر سمیت) سوائے چہرے اور ہاتھوں کے ڈھانپیں۔',
        'ستر جميع الجسد (بما فيه الرأس) إلا الوجه والكفين.',
      ),
      citations: [{ source: 'ShiaSalaah.org', verified: true, note: 'Preparation for Salaah' }],
    },
    {
      id: `${prefix}_adhan_iqama`,
      kind: 'preparation',
      titles: E('Recommended acts before Salaah', 'نماز سے پہلے مستحب اعمال', 'المستحبات قبل الصلاة'),
      body: E(
        'Stand upright facing the Qiblah and recite the Adhan, Dua after Adhan, and Iqama. See Worship Guide for Adhan and Iqama text.',
        'سیدھے کھڑے ہو کر قبلہ رو کریں اور اذان، دعائے بعد از اذان اور اقامہ پڑھیں۔ اذان و اقامہ کے متن کے لیے عبادت گائیڈ دیکھیں۔',
        'قف مستقيماً مستقبلاً القبلة واقرأ الأذان ودعاء ما بعد الأذان والإقامة. راجع دليل العبادة لنص الأذان والإقامة.',
      ),
    },
  ];
}

function rakatCountWords(rakats: number): { en: string; ur: string; ar: string } {
  if (rakats === 2) return { en: 'two (2)', ur: 'دو (۲)', ar: 'ركعتين (٢)' };
  if (rakats === 3) return { en: 'three (3)', ur: 'تین (۳)', ar: 'ثلاث (٣)' };
  return { en: 'four (4)', ur: 'چار (۴)', ar: 'أربع (٤)' };
}

export function firstRakatSteps(
  prefix: string,
  prayerName: string,
  prayerNameUr: string,
  prayerNameAr: string,
  rakatCount: number,
): PrayerGuideStep[] {
  const count = rakatCountWords(rakatCount);
  return [
    {
      id: `${prefix}_intro`,
      kind: 'intro',
      titles: E(
        `How to Perform ${prayerName}`,
        `${prayerNameUr} کیسے پڑھیں`,
        `كيفية أداء ${prayerNameAr}`,
      ),
      body: E(
        `The ${prayerName} is the ${count.en} raka'ah obligatory prayer of the five daily prayers.`,
        `${prayerNameUr} پانچ وقت کی واجب نمازوں میں سے ${count.ur} رکعت والی نماز ہے۔`,
        `${prayerNameAr} هي الصلاة الواجبة من ${count.ar} من الصلوات الخمس.`,
      ),
    },
    withRecitation(
      {
        id: `${prefix}_r1_niyyah`,
        kind: 'niyyah',
        rakatIndex: 1,
        titles: E(
          'The First Rak`ah — Niyyah & Takbiratul Ihram',
          'پہلی رکعت — نیت و تکبیرۃ الاحرام',
          'الركعة الأولى — النية وتكبيرة الإحرام',
        ),
        body: MF_L(
          `Stand facing Al-Ka'bah. Niyyah: “I am offering ${prayerName}, of ${count.en} rak'ah's seeking closeness to God”. Raise hands and say Allahu Akbar.`,
          `قبلہ (کعبہ) کی طرف منہ کر کے کھڑے ہوں۔ نیت: «میں ${prayerNameUr}، ${count.ur} رکعت، اللہ کی قربت کے لیے ادا کر رہا/رہی ہوں»۔ ہاتھ اٹھا کر اللہ اکبر کہیں۔`,
          `قف مستقبلاً الكعبة. انوِ: «أنوي أداء ${prayerNameAr} ${count.ar} تقرباً إلى الله». ارفع يديك وقل الله أكبر.`,
          'Feet apart (4–8 inches). Recite aloud in Qira\'ah.',
          'پاؤں فاصل (۴–۸ انچ)۔ قراءت بلند آواز میں۔',
          'القدمان متباعدتان (٤–٨ بوصات). اقرأ جهراً في القراءة.',
          'Feet close together. Recite in a soft voice.',
          'پاؤں قریب۔ آہستہ آواز میں پڑھیں۔',
          'القدمان متلاصقتان. اقرأ بصوت خافت.',
        ),
        animationPose: 'takbir',
      },
      TAKBIR,
    ),
    fatihaStep(`${prefix}_r1_fatiha`, 1),
    secondSurahStep(`${prefix}_r1_second_surah`, 1),
    rukuStep(`${prefix}_r1_ruku`, 1),
    withRecitation(
      {
        id: `${prefix}_r1_qiyam_after_ruku`,
        kind: 'qiyam',
        rakatIndex: 1,
        titles: E('Stand from Rukoo\'', 'رکوع سے کھڑے ہونا', 'القيام من الركوع'),
        body: E(
          'Stand up from bowing, recite Sami\'Allahu liman hamidah, then Takbir and Sujood.',
          'رکوع سے کھڑے ہوں، سمع اللہ لمن حمدہ پڑھیں، پھر تکبیر اور سجدہ۔',
          'قم من الركوع واقرأ سمع الله لمن حمده، ثم التكبير والسجود.',
        ),
        animationPose: 'qiyam',
      },
      SAMI_ALLAH,
    ),
    ...sujudPair(`${prefix}_r1`, 1),
  ];
}

export function secondRakatSteps(
  prefix: string,
  qunut: 'wajib' | 'recommended' | 'none',
): PrayerGuideStep[] {
  const steps: PrayerGuideStep[] = [
    standTransition(
      `${prefix}_r1_to_r2`,
      2,
      E('Rise for the Second Rak`ah', 'دوسری رکعت کے لیے کھڑے ہونا', 'القيام للركعة الثانية'),
    ),
    fatihaStep(`${prefix}_r2_fatiha`, 2),
    secondSurahStep(`${prefix}_r2_second_surah`, 2),
  ];

  if (qunut !== 'none') {
    steps.push(
      withRecitation(
        {
          id: `${prefix}_r2_qunoot`,
          kind: 'qunoot',
          rakatIndex: 2,
          titles: E(
            qunut === 'wajib' ? 'Qunut (obligatory)' : 'Qunut (recommended)',
            qunut === 'wajib' ? 'قنوت (واجب)' : 'قنوت (مستحب)',
            qunut === 'wajib' ? 'القنوت (واجب)' : 'القنوت (مستحب)',
          ),
          body: MF_L(
            qunut === 'wajib'
              ? 'Raise hands in Qunut before ruku. Qunut is obligatory in this prayer per most marja.'
              : 'Raise hands in Qunut before ruku. Highly recommended; consult your marja if unsure.',
            qunut === 'wajib'
              ? 'رکوع سے پہلے قنوت میں ہاتھ اٹھائیں۔ زیادہ تر مراجع کے نزدیک اس نماز میں قنوت واجب ہے۔'
              : 'رکوع سے پہلے قنوت میں ہاتھ اٹھائیں۔ بہت مستحب؛ شک ہو تو مرجع سے رجوع کریں۔',
            qunut === 'wajib'
              ? 'ارفع يديك في القنوت قبل الركوع. القنوت واجب في هذه الصلاة عند أكثر المراجع.'
              : 'ارفع يديك في القنوت قبل الركوع. مستحب جداً؛ راجع مرجعك عند الشك.',
            'Recite aloud or as per your practice.',
            'بلند آواز میں یا اپنے طریقے کے مطابق پڑھیں۔',
            'اقرأ جهراً أو بحسب عادتك.',
            'Recite in a soft voice.',
            'آہستہ آواز میں پڑھیں۔',
            'اقرأ بصوت خافت.',
          ),
          animationPose: 'qunoot',
        },
        QUNOOT,
      ),
    );
  }

  steps.push(rukuStep(`${prefix}_r2_ruku`, 2), ...sujudPair(`${prefix}_r2`, 2));
  return steps;
}

export type DailyPrayerKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface DailyPrayerStepConfig {
  key: DailyPrayerKey;
  prayerName: string;
  prayerNameUr: string;
  prayerNameAr: string;
  rakats: 2 | 3 | 4;
  qunut: 'wajib' | 'recommended' | 'none';
}

export function buildDailyPrayerDetailedSteps(config: DailyPrayerStepConfig): PrayerGuideStep[] {
  const { key, prayerName, prayerNameUr, prayerNameAr, rakats, qunut } = config;
  const steps: PrayerGuideStep[] = [
    ...commonPrepSteps(key),
    ...firstRakatSteps(key, prayerName, prayerNameUr, prayerNameAr, rakats),
    ...secondRakatSteps(key, qunut),
  ];

  if (rakats === 2) {
    steps.push(
      tashahhudStep(`${key}_r2_tashahhud`, 2, E('Tashahhud', 'تشہد', 'التشهد')),
      ...prayerClosingSteps(key, prayerName),
    );
    return steps;
  }

  steps.push(
    tashahhudStep(
      `${key}_r2_tashahhud`,
      2,
      E('Tashahhud (end of second rak`ah)', 'تشہد (دوسری رکعت کے اختتام)', 'التشهد (آخر الركعة الثانية)'),
    ),
  );

  if (rakats >= 3) {
    steps.push(
      standTransition(
        `${key}_r2_to_r3`,
        3,
        E('Rise for the Third Rak`ah', 'تیسری رکعت کے لیے کھڑے ہونا', 'القيام للركعة الثالثة'),
      ),
      tasbihatRakat(
        key,
        3,
        E('The Third Rak`ah — Tasbihat al-Arba`ah', 'تیسری رکعت — تسبیحات اربع', 'الركعة الثالثة — التسبيحات الأربع'),
      ),
      rukuStep(`${key}_r3_ruku`, 3),
      ...sujudPair(`${key}_r3`, 3),
    );
  }

  if (rakats === 4) {
    steps.push(
      standTransition(
        `${key}_r3_to_r4`,
        4,
        E('Rise for the Fourth Rak`ah', 'چوتھی رکعت کے لیے کھڑے ہونا', 'القيام للركعة الرابعة'),
      ),
      tasbihatRakat(key, 4, E('The Fourth Rak`ah', 'چوتھی رکعت', 'الركعة الرابعة')),
      rukuStep(`${key}_r4_ruku`, 4),
      ...sujudPair(`${key}_r4`, 4),
      tashahhudStep(`${key}_r4_tashahhud`, 4, E('Final Tashahhud', 'آخری تشہد', 'التشهد الأخير')),
    );
  } else {
    steps.push(tashahhudStep(`${key}_r3_tashahhud`, 3, E('Final Tashahhud', 'آخری تشہد', 'التشهد الأخير')));
  }

  steps.push(...prayerClosingSteps(key, prayerName));
  return steps;
}

export const DAILY_PRAYER_CONFIGS: Record<DailyPrayerKey, DailyPrayerStepConfig> = {
  fajr: {
    key: 'fajr',
    prayerName: 'Fajr Salaah',
    prayerNameUr: 'نماز فجر',
    prayerNameAr: 'صلاة الفجر',
    rakats: 2,
    qunut: 'wajib',
  },
  dhuhr: {
    key: 'dhuhr',
    prayerName: 'Dhuhr Salaah',
    prayerNameUr: 'نماز ظہر',
    prayerNameAr: 'صلاة الظهر',
    rakats: 4,
    qunut: 'recommended',
  },
  asr: {
    key: 'asr',
    prayerName: 'Asr Salaah',
    prayerNameUr: 'نماز عصر',
    prayerNameAr: 'صلاة العصر',
    rakats: 4,
    qunut: 'none',
  },
  maghrib: {
    key: 'maghrib',
    prayerName: 'Maghrib Salaah',
    prayerNameUr: 'نماز مغرب',
    prayerNameAr: 'صلاة المغرب',
    rakats: 3,
    qunut: 'wajib',
  },
  isha: {
    key: 'isha',
    prayerName: 'Isha Salaah',
    prayerNameUr: 'نماز عشاء',
    prayerNameAr: 'صلاة العشاء',
    rakats: 4,
    qunut: 'recommended',
  },
};

export function dailyPrayerSteps(key: DailyPrayerKey): PrayerGuideStep[] {
  return buildDailyPrayerDetailedSteps(DAILY_PRAYER_CONFIGS[key]);
}
