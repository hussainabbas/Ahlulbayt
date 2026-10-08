import type { LocalizedText, WorshipGuideBundle, WorshipGuideStep } from '../../types';
import { E } from '../shared/englishText';
import { ghuslTartibiSteps, step } from '../shared/taharahHelpers';

const GHUSL_METHODS = step({
  id: 'ghusl_methods',
  kind: 'method',
  title: E('Methods of Ghusl', 'غسل کے طریقے', 'طرق الغسل'),
  body: E(
    'Ghusl Tartibi (preferred): after niyyah, wash head/neck, then right side shoulder to foot, then left side — water must reach skin; comb hair so water reaches roots.\n\nGhusl Irtimasi: full immersion at once in pool, river, or sea after niyyah.',
    'غسل ترتیبی (افضل): نیت کے بعد سر و گردن، پھر دائیں پہلو کندھے سے پاؤں تک، پھر بایاں پہلو — پانی جلد تک پہنچے؛ بالوں میں کنگھی کریں تاکہ پانی جڑوں تک پہنچے۔\n\nغسل ارتماسی: نیت کے بعد ایک ساتھ تالاب، دریا یا سمندر میں پورے جسم کا غوطہ۔',
    'الغسل الترتيبي (أفضل): بعد النية، اغسل الرأس والرقبة، ثم الجانب الأيمن من المنكب إلى القدم، ثم الأيسر — يجب أن يصل الماء إلى الجلد؛ مشّط الشعر ليصل الماء إلى الأصول.\n\nالغسل بالارتماس: الغطس الكامل دفعة واحدة في حوض أو نهر أو بحر بعد النية.',
  ),
  scholarBody: E(
    'Recommendable: wash hands to elbows ×3; gargle ×3; wipe hands over body; comb hair; (men, janabat) istibra\' before ghusl.',
    'مستحب: ہاتھ کہنیوں تک تین بار؛ کلی تین بار؛ ہاتھ پورے جسم پر پھیرنا؛ بالوں میں کنگھی؛ (مرد، جنابت) غسل سے پہلے استبراء۔',
    'مستحب: غسل اليدين إلى المرفقين ثلاث مرات؛ المضمضة ثلاث مرات؛ مسح اليدين على الجسم؛ تمشيط الشعر؛ (للرجال في الجنابة) الاستبراء قبل الغسل.',
  ),
  citations: [
    { source: 'ShiaSalaah.org', verified: true },
    { source: 'Islamic Laws — al-islam.org', verified: true },
  ],
});

const METHOD_VARIANTS = [
  {
    method: 'tartibi' as const,
    title: E('Tartibi (sequential)', 'ترتیبی (ترتیب سے)', 'الترتيبي (بالترتيب)'),
    summary: E('Head → right side → left side', 'سر → دایاں پہلو → بایاں پہلو', 'الرأس ← الجانب الأيمن ← الجانب الأيسر'),
  },
  {
    method: 'irtimasi' as const,
    title: E('Irtimasi (immersion)', 'ارتماسی (غوطہ)', 'بالارتماس'),
    summary: E('Full body immersion with niyyah', 'نیت کے ساتھ پورے جسم کا غوطہ', 'الغطس الكامل للجسم مع النية'),
  },
];

export function assembleGhuslBundle(
  prefix: string,
  title: { en: string; ur: string; ar: string },
  fiqhSteps: WorshipGuideStep[],
  completion: LocalizedText,
  waterNote?: LocalizedText,
): Pick<WorshipGuideBundle, 'methodVariants' | 'waterRequirements' | 'steps'> {
  const tartibi = ghuslTartibiSteps(prefix, title, completion);
  const allFiqh = [...fiqhSteps, GHUSL_METHODS];
  return {
    methodVariants: METHOD_VARIANTS,
    waterRequirements:
      waterNote ??
      E(
        'Sufficient clean water to pour over entire body, or a pool for irtimasi.',
        'پورے جسم پر بہانے کے لیے کافی صاف پانی، یا غسل ارتماسی کے لیے تالاب۔',
        'ماء طاهر كافٍ يُصب على الجسم كله، أو حوض للغسل بالارتماس.',
      ),
    steps: {
      beginner: [...allFiqh.slice(0, 2), ...tartibi],
      standard: [...allFiqh, ...tartibi],
      scholar: [...allFiqh, ...tartibi],
    },
  };
}

export const GHUSL_HAYD_FIQH: WorshipGuideStep[] = [
  step({
    id: 'haiz_intro',
    kind: 'intro',
    title: E('Ghusl Hayd (Menstruation)', 'غسل حیض', 'غسل الحيض'),
    body: E(
      'When hayd (menstruation) bleeding ends, ghusl is wajib before resuming salah, fasting, entering a mosque for staying, and touching the Qur\'an. During hayd, wajib salah and fasting are not performed; missed prayers are not qadha.',
      'حیض کا خون بند ہونے پر نماز، روزہ، مسجد میں ٹھہرنے اور قرآن چھونے سے پہلے غسل واجب ہے۔ حیض میں واجب نماز اور روزہ نہیں؛ فوت شدہ نمازوں کی قضا نہیں۔',
      'عند انقطاع دم الحيض يجب الغسل قبل استئناف الصلاة والصوم والمكث في المسجد ومس المصحف. في الحيض لا تؤدى الصلاة الواجبة ولا الصوم؛ ولا قضاء للفائتة.',
    ),
    isRequired: false,
    citations: [
      { source: 'Islamic Laws — Hayd', verified: true, note: 'al-islam.org' },
      { source: 'ShiaSalaah.org', verified: true },
    ],
  }),
  step({
    id: 'haiz_when',
    kind: 'fiqh_note',
    title: E('When to perform ghusl hayd', 'غسل حیض کب کریں', 'متى يُؤدّى غسل الحيض'),
    body: E(
      'Perform ghusl when bleeding has fully stopped and you are confident hayd has ended. Minimum hayd is 3 days and maximum 10 days per most marja (consult your marja for exact rules).',
      'جب خون مکمل بند ہو جائے اور یقین ہو کہ حیض ختم ہو گیا ہے تو غسل کریں۔ زیادہ تر مراجع کے نزدیک کم از کم ۳ دن اور زیادہ سے زیادہ ۱۰ دن (تفصیل کے لیے اپنے مرجع سے رجوع کریں)۔',
      'اغتسل عند انقطاع الدم واطمئنانك بانتهاء الحيض. أقل الحيض ثلاثة أيام وأكثره عشرة عند أكثر المراجع (راجع مرجعك للتفاصيل).',
    ),
    scholarBody: E(
      'After ghusl, perform wudu for salah if required. You may resume all acts forbidden during hayd.',
      'غسل کے بعد اگر ضرورت ہو تو نماز کے لیے وضو کریں۔ حیض میں ممنوع تمام اعمال دوبارہ جائز ہیں۔',
      'بعد الغسل توضأ للصلاة إن لزم. يجوز لك استئناف ما كان محظوراً في الحيض.',
    ),
  }),
  step({
    id: 'haiz_forbidden',
    kind: 'fiqh_note',
    title: E('During hayd — acts not permitted', 'حیض میں — ممنوع اعمال', 'في الحيض — ما لا يجوز'),
    body: E(
      'Wajib salah, wajib tawaf, fasting, entering/staying in a mosque, touching writing of the Qur\'an, and sexual intercourse are not permitted during hayd.',
      'حیض میں واجب نماز، واجب طواف، روزہ، مسجد میں داخل ہونا/ٹھہرنا، قرآن کی تحریر چھونا اور جماع جائز نہیں۔',
      'لا تجوز في الحيض: الصلاة الواجبة، والطواف الواجب، والصوم، والدخول والمكث في المسجد، ومس كتابة القرآن، والجماع.',
    ),
    citations: [{ source: 'Qur\'an 2:222', verified: true }],
  }),
];

export const GHUSL_NIFAS_FIQH: WorshipGuideStep[] = [
  step({
    id: 'nifas_intro',
    kind: 'intro',
    title: E('Ghusl Nifas (Postpartum bleeding)', 'غسل نفاس', 'غسل النفاس'),
    body: E(
      'Nifas is bleeding after childbirth. When nifas ends, ghusl is wajib before resuming salah and other acts requiring taharah, similar to hayd.',
      'نفاس بچے کی پیدائش کے بعد خون ہے۔ نفاس ختم ہونے پر نماز اور طہارت والے اعمال سے پہلے غسل واجب ہے، حیض کی طرح۔',
      'النفاس هو الدم بعد الوضع. عند انتهائه يجب الغسل قبل استئناف الصلاة وغيرها مما يشترط فيه الطهارة، كالحيض.',
    ),
    isRequired: false,
    citations: [
      { source: 'Islamic Laws — Nifas', verified: true, note: 'al-islam.org' },
      { source: 'ShiaSalaah.org', verified: true },
    ],
  }),
  step({
    id: 'nifas_when',
    kind: 'fiqh_note',
    title: E('When nifas ends', 'نفاس کب ختم ہوتا ہے', 'متى ينتهي النفاس'),
    body: E(
      'Perform ghusl when postpartum bleeding stops. Maximum duration and minimum rules vary — consult your marja. If bleeding continues beyond the limit, istihada rules may apply.',
      'نفاس کا خون بند ہونے پر غسل کریں۔ زیادہ سے زیادہ مدت اور کم از کم احکام مختلف ہیں — اپنے مرجع سے رجوع کریں۔ حد سے زیادہ خون رہے تو استحاضہ کے احکام لاگو ہو سکتے ہیں۔',
      'اغتسل عند انقطاع دم النفاس. تختلف أقله وأكثره — راجع مرجعك. إن استمر الدم فوق الحد قد تطبق أحكام الاستحاضة.',
    ),
  }),
  step({
    id: 'nifas_forbidden',
    kind: 'fiqh_note',
    title: E('During nifas', 'نفاس کے دوران', 'في النفاس'),
    body: E(
      'Same restrictions as hayd apply during nifas: no wajib salah, no fasting, no staying in mosque, no touching Qur\'an writing, etc.',
      'نفاس میں حیض جیسے احکام: واجب نماز نہیں، روزہ نہیں، مسجد میں ٹھہرنا نہیں، قرآن کی تحریر چھونا نہیں، وغیرہ۔',
      'في النفاس مثل الحيض: لا صلاة واجبة، ولا صوم، ولا مكث في المسجد، ولا مس كتابة القرآن، ونحو ذلك.',
    ),
  }),
];

export const GHUSL_JUMUAH_FIQH: WorshipGuideStep[] = [
  step({
    id: 'jumuah_intro',
    kind: 'intro',
    title: E('Ghusl Jumu\'ah (Friday)', 'غسل جمعہ', 'غسل الجمعة'),
    body: E(
      'Ghusl on Friday before Salat al-Jumu\'ah (or Dhuhr for those not attending Jumu\'ah) is mustahab and highly emphasized in Shia tradition.',
      'جمعہ کو نماز جمعہ (یا جو جمعہ میں نہ آئیں ان کے لیے ظہر) سے پہلے غسل مستحب ہے اور شیا روایت میں بہت تاکید ہے۔',
      'الغسل يوم الجمعة قبل صلاة الجمعة (أو الظهر لمن لا يحضر الجمعة) مستحب ومؤكد في المذهب الجعفري.',
    ),
    isRequired: false,
    citations: [
      { source: 'Islamic Laws — Mustahab Ghusl', verified: true, note: 'al-islam.org' },
      { source: 'ShiaSalaah.org', verified: true },
    ],
  }),
  step({
    id: 'jumuah_virtue',
    kind: 'fiqh_note',
    title: E('Virtue and timing', 'فضیلت اور وقت', 'الفضيلة والوقت'),
    body: E(
      'Perform with niyyah of mustahab ghusl for Jumu\'ah. Best done before going to the mosque on Friday. Use the same tartibi method as other ghusl.',
      'مستحب غسل جمعہ کی نیت سے کریں۔ جمعہ کو مسجد جانے سے پہلے بہتر ہے۔ دوسرے غسل کی طرح ترتیبی طریقہ استعمال کریں۔',
      'انوِ غسل الجمعة المستحب. يُفضل قبل الذهاب إلى المسجد يوم الجمعة. بالترتيب كسائر الغسل.',
    ),
    scholarBody: E(
      'Also recommended: trim nails, wear clean clothes, use perfume (if available), and recite Salawat on the way to Jumu\'ah.',
      'مستحب: ناخن کاٹنا، صاف کپڑے، خوشبو (اگر ہو)، اور جمعہ کے راستے میں درود بھیجنا۔',
      'مستحب أيضاً: قص الأظافر، والثوب النظيف، والطيب إن وجد، والصلاة على محمد وآل محمد في الطريق إلى الجمعة.',
    ),
  }),
];

export const GHUSL_MAYYIT_FIQH: WorshipGuideStep[] = [
  step({
    id: 'mayyit_intro',
    kind: 'intro',
    title: E('Ghusl Mayyit (Washing the deceased)', 'غسل میت', 'غسل الميت'),
    body: E(
      'Ghusl mayyit is wajib kifai — if some Muslims perform it, others are relieved. It is an honour and duty toward a deceased Muslim before kafan and burial.',
      'غسل میت واجب کفائی ہے — کچھ مسلمانوں کے کرنے سے باقی معاف۔ کفن اور دفن سے پہلے میت مسلمان کا حق اور عزت ہے۔',
      'غسل الميت واجب كفائي — إذا قام به بعض المسلمين سقط عن الباقين. حق وتكريم للمسلم قبل الكفن والدفن.',
    ),
    isRequired: false,
    citations: [
      { source: 'Islamic Laws — Ghusl Mayyit', verified: true, note: 'al-islam.org' },
      { source: 'ShiaSalaah.org', verified: true },
    ],
  }),
  step({
    id: 'mayyit_who',
    kind: 'fiqh_note',
    title: E('Who performs the ghusl', 'غسل کون کرے', 'من يغسل الميت'),
    body: E(
      'Preferably someone of the same gender. A mahram may wash the opposite gender when necessary. The body should remain covered except the parts being washed. Follow local marja and funeral customs (sidr, camphor, etc.).',
      'ترجیحاً ہم جنس۔ ضرورت پر محرم مخالف جنس کو غسل دے سکتا ہے۔ جسم ڈھکا رہے سوائے جس حصے کو دھویا جا رہا ہو۔ مقامی مرجع اور رسوم (سدر، کافور وغیرہ) کی پیروی کریں۔',
      'يُفضل من الجنس نفسه. يجوز للمحارم غسل الميت من الجنس الآخر عند الضرورة. يُستر الجسد إلا ما يُغسل. اتبع مرجعك وعادات التجهيز (السدر، الكافور، إلخ).',
    ),
  }),
  step({
    id: 'mayyit_order',
    kind: 'order_rule',
    title: E('Order of washing', 'غسل کی ترتیب', 'ترتيب الغسل'),
    body: E(
      'After removing najasa and niyyah: wash head and neck, then right side, then left side — or follow the specific mayyit procedure prescribed by your marja. Three washes are common in Shia practice.',
      'نجاست دور کرنے اور نیت کے بعد: سر و گردن، پھر دایاں پہلو، پھر بایاں — یا اپنے مرجع کے مخصوص طریقے کی پیروی کریں۔ شیا عمل میں تین بار غسل عام ہے۔',
      'بعد إزالة النجاسة والنية: اغسل الرأس والرقبة، ثم الجانب الأيمن، ثم الأيسر — أو بما يقرره مرجعك. الغسل ثلاث مرات شائع في المذهب.',
    ),
    scholarBody: E(
      'Special rules apply for martyrs (shuhada) who may not be washed in some cases. Consult Islamic Laws for detailed steps.',
      'شہداء کے لیے خاص احکام ہیں؛ بعض صورتوں میں غسل نہیں ہوتا۔ تفصیلی مراحل کے لیے Islamic Laws دیکھیں۔',
      'للشهداء أحكام خاصة؛ قد لا يُغسلون في بعض الحالات. راجع أحكام الإسلام للتفاصيل.',
    ),
  }),
];

export const GHUSL_ISTIHADA_FIQH: WorshipGuideStep[] = [
  step({
    id: 'istihada_intro',
    kind: 'intro',
    title: E('Ghusl Istihada', 'غسل استحاضہ', 'غسل الاستحاضة'),
    body: E(
      'Istihada is irregular bleeding outside normal hayd/nifas. It does not have the same rules as hayd — salah and fasting are not automatically forbidden for the whole period.',
      'استحاضہ حیض/نفاس کے علاوہ غیر معمولی خون ہے۔ حیض جیسے احکام نہیں — پورے عرصے میں نماز اور روزہ خود بخود ممنوع نہیں۔',
      'الاستحاضة دم خارج عن الحيض والنفاس المعتاد. ليست كالحيض — لا تُحرم الصلاة والصوم تلقائياً طوال المدة.',
    ),
    isRequired: false,
    citations: [
      { source: 'Islamic Laws — Istihada', verified: true, note: 'al-islam.org' },
    ],
  }),
  step({
    id: 'istihada_wudu',
    kind: 'fiqh_note',
    title: E('Wudu between prayers', 'نمازوں کے درمیان وضو', 'الوضوء بين الصلوات'),
    body: E(
      'Depending on duration category (minor, medium, excessive), wudu may be required before each salah or after a set time. Ghusl may be required once daily for some categories — consult your marja.',
      'خون کی مقدار (کم، درمیانہ، زیادہ) کے مطابق ہر نماز سے پہلے یا مقررہ وقت کے بعد وضو لازم ہو سکتا ہے۔ بعض صورتوں میں روزانہ ایک غسل — اپنے مرجع سے رجوع کریں۔',
      'بحسب قسم الدم (قليل، متوسط، كثير) قد يجب الوضوء قبل كل صلاة أو بعد مدة. وقد يجب الغسل مرة يومياً في بعض الأحوال — راجع مرجعك.',
    ),
  }),
  step({
    id: 'istihada_ghusl',
    kind: 'fiqh_note',
    title: E('When ghusl is required', 'غسل کب واجب ہے', 'متى يجب الغسل'),
    body: E(
      'When your marja rules ghusl for istihada, use tartibi ghusl with proper niyyah. After ghusl, perform wudu for salah if required.',
      'جب آپ کے مرجع استحاضہ میں غسل کا حکم دیں تو نیت کے ساتھ ترتیبی غسل کریں۔ غسل کے بعد اگر ضرورت ہو تو نماز کے لیے وضو کریں۔',
      'إذا أوجب مرجعك الغسل في الاستحاضة فاغتسل بالترتيب مع النية الصحيحة. بعد الغسل توضأ للصلاة إن لزم.',
    ),
  }),
];

export const GHUSL_MUSTAHAB_FIQH: WorshipGuideStep[] = [
  step({
    id: 'mustahab_intro',
    kind: 'intro',
    title: E('Mustahab Ghusl (Recommended baths)', 'مستحب غسل', 'الغسل المستحب'),
    body: E(
      'Mustahab ghusl brings spiritual reward. Occasions include: Jumu\'ah, Eid al-Fitr and Eid al-Adha, entering Makkah/Haram, rain ghusl, Laylat al-Qadr, and after certain sins when seeking repentance.',
      'مستحب غسل ثواب دیتا ہے۔ مواقع: جمعہ، عید الفطر و عید الاضحیٰ، مکہ/حرم میں داخل ہونا، بارش کا غسل، شب قدر، اور بعض گناہوں کے بعد توبہ۔',
      'الغسل المستحب له ثواب. من المناسبات: الجمعة، عيد الفطر والأضحى، دخول مكة والحرم، غسل المطر، ليلة القدر، وبعد بعض الذنوب مع التوبة.',
    ),
    isRequired: false,
    citations: [
      { source: 'Islamic Laws — Mustahab Ghusl', verified: true, note: 'al-islam.org' },
      { source: 'ShiaSalaah.org', verified: true },
    ],
  }),
  step({
    id: 'mustahab_occasions',
    kind: 'checklist',
    title: E('Common mustahab occasions', 'عام مستحب مواقع', 'مناسبات الغسل المستحب الشائعة'),
    body: E(
      'Perform tartibi ghusl with niyyah for the specific occasion.',
      'مخصوص موقع کی نیت سے ترتیبی غسل کریں۔',
      'اغتسل بالترتيب مع نية المناسبة المحددة.',
    ),
    checklist: [
      E('Ghusl Jumu\'ah (Friday)', 'غسل جمعہ', 'غسل الجمعة'),
      E('Ghusl Eid', 'غسل عید', 'غسل العيد'),
      E('Entering the Haram of Makkah', 'حرم مکہ میں داخل ہونا', 'دخول حرم مكة'),
      E('Laylat al-Qadr', 'شب قدر', 'ليلة القدر'),
      E('Ghusl after giving ghusl to a mayyit', 'میت کو غسل دینے کے بعد غسل', 'الغسل بعد تغسيل الميت'),
    ],
  }),
];
