import type { WorshipPose } from '../types';

export type SimAssetDomain = 'salah' | 'wudu' | 'ghusl';

export type SimAssetFormat = 'static' | 'lottie' | 'rive' | 'thumbnail';

export type SimAssetTheme = 'light' | 'dark';

/** Logical bundle key — maps to on-disk assets under mobile/assets/sim/ */
export type SimAssetKey = string;

export interface SimAssetEntry {
  key: SimAssetKey;
  domain: SimAssetDomain;
  slug: string;
  pose: WorshipPose;
  title: { en: string; ur: string; ar: string };
  /** Jafari fiqh note shown in scholar mode */
  fiqhNote?: { en: string; ur: string; ar: string };
}

export const SIM_ASSET_CATALOG: SimAssetEntry[] = [
  // —— Salah (Jafari) ——
  {
    key: 'sim/salah/qiyam',
    domain: 'salah',
    slug: 'qiyam',
    pose: 'standing_qiyam',
    title: { en: 'Qiyam', ur: 'قیام', ar: 'القيام' },
    fiqhNote: {
      en: 'Stand facing Qibla; hands at sides (Jafari).',
      ur: 'قبلہ رukh؛ ہاتھ بغل پر (جعفری)۔',
      ar: 'قف مستقبل القبلة؛ اليدان إلى الجنب.',
    },
  },
  {
    key: 'sim/salah/qunoot',
    domain: 'salah',
    slug: 'qunoot',
    pose: 'qunoot_hands_raised',
    title: { en: 'Qunoot', ur: 'قنوت', ar: 'القنوت' },
    fiqhNote: {
      en: 'Raise hands for supplication before ruku (2nd rakat in many prayers).',
      ur: 'رکوع سے پہلے دعا کے لیے ہاتھ اٹھائیں۔',
      ar: 'ارفع يديك للدعاء قبل الركوع.',
    },
  },
  {
    key: 'sim/salah/ruku',
    domain: 'salah',
    slug: 'ruku',
    pose: 'ruku',
    title: { en: 'Ruku', ur: 'رکوع', ar: 'الركوع' },
    fiqhNote: {
      en: 'Bow with back straight; hands on knees.',
      ur: 'پشت سیدھی؛ ہاتھ گھٹنوں پر۔',
      ar: 'اركع ظهرك مستويًا؛ يدان على الركبتين.',
    },
  },
  {
    key: 'sim/salah/sujud',
    domain: 'salah',
    slug: 'sujud',
    pose: 'sujud',
    title: { en: 'Sujood', ur: 'سجدہ', ar: 'السجود' },
    fiqhNote: {
      en: 'Seven body parts on earth/turbah: forehead, palms, knees, toes.',
      ur: 'سات اعضاء زمین/تربت پر: پیشانی، ہتھیلیاں، گھٹنے، انگوٹھے۔',
      ar: 'سبعة أعضاء على الأرض/التربة.',
    },
  },
  {
    key: 'sim/salah/jalsa',
    domain: 'salah',
    slug: 'jalsa',
    pose: 'jalsa',
    title: { en: 'Jalsa', ur: 'جلسہ', ar: 'الجلسة' },
    fiqhNote: {
      en: 'Sit between the two prostrations.',
      ur: 'دو سجدوں کے درمیان بیٹھنا۔',
      ar: 'الجلوس بين السجدتين.',
    },
  },
  {
    key: 'sim/salah/tashahhud',
    domain: 'salah',
    slug: 'tashahhud',
    pose: 'tashahhud_sitting',
    title: { en: 'Tashahhud', ur: 'تشہد', ar: 'التشهد' },
    fiqhNote: {
      en: 'Sit for tashahhud with Shia formula and salawat.',
      ur: 'شیا تشہد و درود کے ساتھ بیٹھنا۔',
      ar: 'اجلس للتشهد الشيعي والصلوات.',
    },
  },
  {
    key: 'sim/salah/completion',
    domain: 'salah',
    slug: 'completion',
    pose: 'completion_dhikr',
    title: { en: 'Completion', ur: 'اختتام', ar: 'الإتمام' },
    fiqhNote: {
      en: 'Conclude with three takbirs (Jafari daily prayers).',
      ur: 'تین تکبیر سے اختتام (جعفری)۔',
      ar: 'اختم بثلاث تكبيرات.',
    },
  },
  {
    key: 'sim/salah/takbir',
    domain: 'salah',
    slug: 'takbir',
    pose: 'takbir',
    title: { en: 'Takbir', ur: 'تکبیر', ar: 'التكبير' },
    fiqhNote: {
      en: 'Raise hands to ears: Allahu Akbar.',
      ur: 'ہاتھ کانوں تک: اللہ اکبر۔',
      ar: 'ارفع يديك إلى الأذنين: الله أكبر.',
    },
  },
  // —— Wudu (Jafari) ——
  {
    key: 'sim/wudu/face',
    domain: 'wudu',
    slug: 'face',
    pose: 'wash_face',
    title: { en: 'Wash face', ur: 'منہ دھونا', ar: 'غسل الوجه' },
    fiqhNote: {
      en: 'From hairline to chin, ear to ear — once downward.',
      ur: 'ماتھے سے ٹھوڑی، کان سے کان — ایک بار نیچے۔',
      ar: 'من منابت الشعر إلى الذقن، أذن إلى أذن.',
    },
  },
  {
    key: 'sim/wudu/arm_right',
    domain: 'wudu',
    slug: 'arm_right',
    pose: 'wash_arm_right',
    title: { en: 'Right arm', ur: 'دایاں بازو', ar: 'الذراع الأيمن' },
    fiqhNote: {
      en: 'Water from elbow flowing down to fingertips.',
      ur: 'پانی کہنی سے انگلیوں تک نیچے بہے۔',
      ar: 'الماء من المرفق إلى أطراف الأصابع.',
    },
  },
  {
    key: 'sim/wudu/arm_left',
    domain: 'wudu',
    slug: 'arm_left',
    pose: 'wash_arm_left',
    title: { en: 'Left arm', ur: 'بایاں بازو', ar: 'الذراع الأيسر' },
    fiqhNote: {
      en: 'Same as right arm — elbow to fingertips.',
      ur: 'دائیں بازو کی طرح — کہنی سے انگلیوں تک۔',
      ar: 'كالذراع الأيمن — من المرفق إلى الأطراف.',
    },
  },
  {
    key: 'sim/wudu/masah_head',
    domain: 'wudu',
    slug: 'masah_head',
    pose: 'masah_head',
    title: { en: 'Masah head', ur: 'سر مسح', ar: 'مسح الرأس' },
    fiqhNote: {
      en: 'Wipe front portion of head with wet hand (not full wash).',
      ur: 'سر کے سامنے کا حصہ گیلے ہاتھ سے مسح۔',
      ar: 'امسح مقدم الرأس — لا غسل كامل.',
    },
  },
  {
    key: 'sim/wudu/masah_feet',
    domain: 'wudu',
    slug: 'masah_feet',
    pose: 'masah_feet',
    title: { en: 'Masah feet', ur: 'پاؤں مسح', ar: 'مسح القدمين' },
    fiqhNote: {
      en: 'Wipe top of feet with wet hand.',
      ur: 'پاؤں کی پشت گیلے ہاتھ سے مسح۔',
      ar: 'امسح ظهر القدمين.',
    },
  },
  {
    key: 'sim/wudu/hands',
    domain: 'wudu',
    slug: 'hands',
    pose: 'wash_hands',
    title: { en: 'Wash hands', ur: 'ہاتھ دھونا', ar: 'غسل اليدين' },
  },
  // —— Ghusl ——
  {
    key: 'sim/ghusl/tartibi',
    domain: 'ghusl',
    slug: 'tartibi',
    pose: 'ghusl_head',
    title: { en: 'Ghusl Tartibi', ur: 'غسل ترتیبی', ar: 'الغسل الترتيبي' },
    fiqhNote: {
      en: 'Sequential ghusl: head/neck, right side, left side.',
      ur: 'ترتیب سے: سر/گردن، دایاں پہلو، بایاں پہلو۔',
      ar: 'ترتيبًا: الرأس، الجانب الأيمن، الأيسر.',
    },
  },
  {
    key: 'sim/ghusl/irtimasi',
    domain: 'ghusl',
    slug: 'irtimasi',
    pose: 'ghusl_immersion',
    title: { en: 'Ghusl Irtimasi', ur: 'غسل ارتماسی', ar: 'الغسل الارتماسي' },
    fiqhNote: {
      en: 'Full immersion under water with niyyah.',
      ur: 'نیت کے ساتھ پانی میں غوطہ (ارتماس)۔',
      ar: 'الغمس في الماء بنية الغسل.',
    },
  },
];

export const SIM_ASSET_BY_KEY = Object.fromEntries(
  SIM_ASSET_CATALOG.map((entry) => [entry.key, entry]),
) as Record<SimAssetKey, SimAssetEntry>;

export const SIM_ASSET_BY_POSE = Object.fromEntries(
  SIM_ASSET_CATALOG.map((entry) => [entry.pose, entry]),
) as Partial<Record<WorshipPose, SimAssetEntry>>;

export function resolveAssetKey(
  pose: WorshipPose,
  explicitKey?: string,
): SimAssetKey | undefined {
  if (explicitKey && SIM_ASSET_BY_KEY[explicitKey]) return explicitKey;
  return SIM_ASSET_BY_POSE[pose]?.key;
}

export function simAssetPath(
  key: SimAssetKey,
  theme: SimAssetTheme,
  format: SimAssetFormat,
): string {
  const entry = SIM_ASSET_BY_KEY[key];
  if (!entry) return '';
  const ext =
    format === 'lottie' ? 'lottie.json' : format === 'rive' ? 'riv' : 'svg';
  const name = format === 'static' ? 'static' : format === 'thumbnail' ? 'thumb' : 'anim';
  return `sim/${entry.domain}/${entry.slug}/${theme}/${name}.${ext}`;
}
