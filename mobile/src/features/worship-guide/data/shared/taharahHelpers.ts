import type {
  FiqhReference,
  LocalizedText,
  WorshipGuideMeta,
  WorshipGuideStep,
  WorshipGuideId,
  WorshipInvalidator,
} from '../../types';

export const L = (en: string, ur: string, ar: string): LocalizedText => ({ en, ur, ar });

export function step(
  partial: Omit<WorshipGuideStep, 'isRequired'> & { isRequired?: boolean },
): WorshipGuideStep {
  return { isRequired: true, ...partial };
}

export const WUDU_INVALIDATORS: WorshipInvalidator[] = [
  {
    id: 'sleep',
    title: L('Deep sleep', 'گہری نیند', 'النوم العميق'),
    body: L(
      'Deep sleep invalidates wudu according to most marja.',
      'اکثر مراجع کے نزدیک گہری نیند وضو کو باطل کرتی ہے۔',
      'النوم العميق ينقض الوضو عند أكثر المراجع.',
    ),
  },
  {
    id: 'urine_stool',
    title: L('Urination or defecation', 'پیشاب یا پاخانہ', 'البول أو الغائط'),
    body: L('Any discharge from the urinary or anal passage breaks wudu.', ' پیشاب یا پاخانہ وضو توڑ دیتے ہیں۔', 'خروج البول أو الغائط ينقض الوضو.'),
  },
  {
    id: 'wind',
    title: L('Passing wind', 'ہوا خارج ہونا', 'خروج الریح'),
    body: L('Passing wind from the rear invalidates wudu.', 'پیچھے سے ہوا خارج ہونا وضو باطل کرتی ہے۔', 'خروج الریح من الدبر ینقض الوضو.'),
  },
  {
    id: 'najasa',
    title: L('Najasa on body or clothes', 'جسم یا کپڑوں پر نجاست', 'نجاسة على البدن أو الثوب'),
    body: L(
      'If an obligatory amount of najasa contacts the body or clothes during prayer prep, renew wudu after cleaning.',
      'اگر واجب مقدار نجاست لگے تو پاک کر کے وضو دوبارہ کریں۔',
      'إذا لاقت النجاسة الموجبة البدن أو الثوب، أعد الوضو بعد التطهير.',
    ),
  },
];

export function wuduNiyyahStep(): WorshipGuideStep {
  return step({
    id: 'wudu_niyyah',
    kind: 'niyyah',
    title: L('Intention (Niyyah)', 'نیت', 'النية'),
    body: L(
      'Form the intention in your heart to perform wudu for the pleasure of Allah and to attain taharah for worship.',
      'دل میں اللہ کی رضا اور عبادت کے لیے طہارت حاصل کرنے کی نیت کریں۔',
      'انوِ في قلبك الوضو لوجه الله وللتحلل للعبادة.',
    ),
    arabicText: 'نَوَيْتُ الوُضُوءَ لِلّٰهِ تَعَالٰى',
    transliteration: L(
      'Nawaytu al-wudū\'a lillāhi ta\'ālā',
      'نویتُ الوضوءَ للّٰهِ تعالٰی',
      'نويت الوضوء لله تعالى',
    ),
    visualHint: 'niyyah',
    confirmPrompt: L('Did you make intention in your heart?', 'کیا آپ نے دل میں نیت کر لی؟', 'هل نويت في قلبك؟'),
    commonErrors: [
      L('Speaking niyyah aloud is not required and should not replace heart intention.', 'نیت زبان سے کہنا ضروری نہیں۔', 'لا تشترط النية باللسان.'),
    ],
    fiqhRefs: [
      {
        source: L('Imam Ali (as)', 'امام علیؑ', 'الإمام علي (ع)'),
        citation: L('Intention is the foundation of every act of worship', 'نیت ہر عبادت کی بنیاد', 'النية أساس كل عبادة'),
      },
    ],
    audioAssetKey: 'worship/wudu/niyyah',
  });
}

export function buildWuduSteps(): Record<'beginner' | 'standard' | 'scholar', WorshipGuideStep[]> {
  const core: WorshipGuideStep[] = [
    wuduNiyyahStep(),
    step({
      id: 'wudu_face',
      kind: 'wash',
      title: L('Wash the face', 'چہرہ دھونا', 'غسل الوجه'),
      body: L(
        'Wash the face once from the hairline to the bottom of the chin, and from ear to ear, ensuring water reaches the skin.',
        'چہرہ ایک بار دھوئیں — ماتھے (بالوں کی جڑ) سے ٹھوڑی تک، کان سے کان تک؛ پانی جلد تک پہنچے۔',
        'اغسل الوجه مرة من منبت الشعر إلى أسفل الذقن ومن شِّق الأذن إلى الآخر، ويصل الماء إلى الجلد.',
      ),
      visualHint: 'wash_face',
      animationAssetKey: 'sim/wudu/face',
      confirmPrompt: L('Did water reach your entire face?', 'کیا پانی پورے چہرے تک پہنچا؟', 'هل وصل الماء إلى الوجه كله؟'),
      commonErrors: [
        L('Missing the area under the chin or between beard hairs (if not dense).', 'ٹھوڑی کے نیچے یا داڑھی کے بالوں کے درمیان چھوڑنا۔', 'ترك ما تحت الذقن أو بين شعر اللحية.'),
        L('Using impure (najis) water.', 'نجس پانی استعمال کرنا۔', 'استعمال الماء النجس.'),
      ],
      audioAssetKey: 'worship/wudu/face',
    }),
    step({
      id: 'wudu_right_arm',
      kind: 'wash',
      title: L('Wash the right arm', 'دایاں بازو', 'غسل الذراع الأيمن'),
      body: L(
        'Wash the right arm from fingertips to and including the elbow, once, letting water run downward.',
        'دایاں بازو انگلیوں سے کہنی سمیت ایک بار دھوئیں؛ پانی اوپر سے نیچے بہے۔',
        'اغسل الذراع الأيمن من أطراف الأصابع إلى المرفق شاملًا مرة واحدة.',
      ),
      visualHint: 'wash_arm_right',
      isRequired: true,
      confirmPrompt: L('Did you wash up to and including the elbow?', 'کیا کہنی سمیت دھویا؟', 'هل غسلت إلى المرفق شاملًا؟'),
      commonErrors: [
        L('Stopping below the elbow.', 'کہنی سے پہلے رک جانا۔', 'التوقف قبل المرفق.'),
      ],
      audioAssetKey: 'worship/wudu/right_arm',
    }),
    step({
      id: 'wudu_left_arm',
      kind: 'wash',
      title: L('Wash the left arm', 'بایاں بازو', 'غسل الذراع الأيسر'),
      body: L(
        'Wash the left arm the same way — fingertips to elbow, once.',
        'بایاں بازو ویسے ہی — انگلیوں سے کہنی تک، ایک بار۔',
        'اغسل الذراع الأيسر مثل الأيمن من الأطراف إلى المرفق.',
      ),
      visualHint: 'wash_arm_left',
      confirmPrompt: L('Did you complete the left arm?', 'کیا بایاں بازو مکمل ہوا؟', 'هل أكملت الذراع الأيسر؟'),
      audioAssetKey: 'worship/wudu/left_arm',
    }),
    step({
      id: 'wudu_head',
      kind: 'masah',
      title: L('Wipe the head (Masah)', 'سر کا مسح', 'مسح الرأس'),
      body: L(
        'With wet hands remaining from wudu, wipe the head — commonly from front to back or any portion of the head per your marja.',
        'وضو کے پانی سے ہاتھ گیلے کر کے سر کا مسح کریں (اکثر مراجع کے نزدیک سامنے سے پیچھے یا سر کا کوئی حصہ)۔',
        'امسح الرأس ببقية الماء من الوضو — من الأمام إلى الخلف أو جزء من الرأس بحسب المرجع.',
      ),
      visualHint: 'masah_head',
      confirmPrompt: L('Did you wipe your head with wet hands?', 'کیا گیلے ہاتھوں سے سر کا مسح کیا؟', 'هل مسحت الرأس باليدين الرطبتين؟'),
      commonErrors: [
        L('Using dry hands without fresh wetness from wudu water.', 'بالکل خشک ہاتھوں سے مسح۔', 'المسح بيدين جافتين.'),
      ],
      audioAssetKey: 'worship/wudu/head',
    }),
    step({
      id: 'wudu_feet',
      kind: 'masah',
      title: L('Wipe the feet (Masah)', 'پاؤں کا مسح', 'مسح القدمين'),
      body: L(
        'Wipe the top of the feet with the wetness on your hands — right foot then left foot. In Jafari fiqh, masah of feet (not full wash) is the established method.',
        'ہاتھوں کی نمی سے پاؤں کا اوپری حصہ مسح کریں — پہلے دایاں پھر بایاں۔ فقہ جعفریہ میں پاؤں کا مسح رائج ہے۔',
        'امسح ظهر القدمين ببقية الرطوبة — اليمنى ثم اليسرى. المسح هو المشهور في المذهب الجعفري.',
      ),
      visualHint: 'masah_feet',
      confirmPrompt: L('Did you wipe both feet?', 'کیا دونوں پاؤں کا مسح ہوا؟', 'هل مسحت القدمين؟'),
      commonErrors: [
        L('Washing feet entirely when your marja requires masah only.', 'مسح کی بجائے پورا دھونا (جب مسح واجب ہو)۔', 'غسل القدمين مع وجوب المسح.'),
        L('Wrong order: feet before head.', 'غلط ترتیب: سر سے پہلے پاؤں۔', 'تقديم المسح على الرأس.'),
      ],
      fiqhRefs: [
        {
          source: L('Imam Ja\'far al-Sadiq (as)', 'امام جعفر صادقؑ', 'الإمام جعفر الصادق (ع)'),
          citation: L('Masah of the feet in wudu', 'وضو میں پاؤں کا مسح', 'مسح القدمين في الوضو'),
          marja: 'general',
        },
      ],
      audioAssetKey: 'worship/wudu/feet',
    }),
    step({
      id: 'wudu_complete',
      kind: 'completion',
      title: L('Wudu complete', 'وضو مکمل', 'اكتمل الوضو'),
      body: L(
        'You are now in a state of wudu. Maintain taharah until an invalidator occurs. Proceed to prayer or other worship.',
        'آپ وضو کی حالت میں ہیں۔ باطل کن امور سے بچیں۔ نماز یا عبادت شروع کر سکتے ہیں۔',
        'أنت الآن على وضو. حافظ على الطهارة حتى ينقض. يمكنك الصلاة أو العبادة.',
      ),
      isRequired: false,
      checklist: [
        L('Face washed', 'چہرہ دھویا', 'غسل الوجه'),
        L('Both arms washed to elbow', 'دونوں بازو کہنی تک', 'غسل الذراعين إلى المرفق'),
        L('Head masah done', 'سر کا مسح', 'مسح الرأس'),
        L('Both feet masah done', 'دونوں پاؤں کا مسح', 'مسح القدمين'),
      ],
      audioAssetKey: 'worship/wudu/complete',
    }),
  ];

  const intro: WorshipGuideStep = step({
    id: 'wudu_intro',
    kind: 'intro',
    title: L('Before you begin', 'شروع سے پہلے', 'قبل أن تبدأ'),
    body: L(
      'Use clean, tahir water. Remove najasa from body, clothes, and place. Perform steps in order without long interruption.',
      'پاک (طاہر) پانی استعمال کریں۔ جسم، کپڑے اور جگہ سے نجاست دور کریں۔ مراحل ترتیب سے بغیر لمبے وقفے کے ادا کریں۔',
      'استخدم ماءً طاهرًا. أزل النجاسة عن البدن والثوب والمكان. نفّذ الخطوات بالترتيب دون فصل طويل.',
    ),
    isRequired: false,
    checklist: [
      L('Clean water available', 'پاک پانی موجود', 'ماء طاهر متوفر'),
      L('Place is tahir', 'جگہ پاک', 'المكان طاهر'),
      L('Know the order of limbs', 'اعضاء کی ترتیب یاد', 'معرفة ترتيب الأعضاء'),
    ],
  });

  const washHands: WorshipGuideStep = step({
    id: 'wudu_hands',
    kind: 'wash',
    title: L('Wash both hands', 'دونوں ہاتھ دھونا', 'غسل اليدين'),
    body: L(
      'Wash both hands from fingertips to wrists (recommended before face; ensures water is not najis).',
      'دونوں ہاتھ انگلیوں سے کلائی تک دھوئیں (چہرے سے پہلے مستحب؛ پانی طاہر یقینی بناتا ہے)۔',
      'اغسل اليدين من أطراف الأصابع إلى الرسغين (مستحب قبل الوجه).',
    ),
    visualHint: 'wash_face',
    animationAssetKey: 'sim/wudu/hands',
    confirmPrompt: L('Did you wash both hands?', 'کیا دونوں ہاتھ دھوئے؟', 'هل غسلت يديك؟'),
    isRequired: false,
  });

  const scholarInvalidators: WorshipGuideStep = {
    id: 'wudu_invalidators',
    kind: 'invalidator',
    title: L('What breaks Wudu?', 'وضو کب باطل ہوتا ہے؟', 'ما ينقض الوضو؟'),
    body: L(
      'Learn the main invalidators so you know when to renew wudu before salah.',
      'اہم باطل کن امور سیکھیں تاکہ نماز سے پہلے وضو کی ضرورت معلوم ہو۔',
      'تعرّف على المناقضات ل تعرف متى تعيد الوضو قبل الصلاة.',
    ),
    isRequired: false,
    scholarBody: L(
      'Consult your marja for edge cases: prolonged unconsciousness, certain emissions, touching dead body without ghusl rules, etc.',
      'باریک حالات کے لیے مرجع سے رجوع کریں۔',
      'راجع مرجعك في الحالات الخاصة.',
    ),
    checklist: WUDU_INVALIDATORS.map((i) => i.title),
  };

  const beginner = [intro, washHands, ...core.slice(0, 6), core[6]!];
  const standard = [intro, washHands, ...core];
  const scholar = [intro, washHands, ...core, scholarInvalidators];

  return { beginner, standard, scholar };
}

export function ghuslTartibiSteps(
  prefix: string,
  title: LocalizedText,
  purpose: LocalizedText,
): WorshipGuideStep[] {
  return [
    step({
      id: `${prefix}_niyyah`,
      kind: 'niyyah',
      title: L('Intention (Niyyah)', 'نیت', 'النية'),
      body: L(
        `Form intention in the heart to perform ghusl ${title.en} for Allah.`,
        `دل میں ${title.ur} کا غسل اللہ کی رضا کے لیے کرنے کی نیت کریں۔`,
        `انوِ غسل ${title.ar} لله تعالى.`,
      ),
      confirmPrompt: L('Did you make niyyah?', 'نیت ہو گئی؟', 'هل نويت؟'),
      visualHint: 'niyyah',
    }),
    step({
      id: `${prefix}_head`,
      kind: 'wash',
      title: L('Wash the head and neck', 'سر و گردن', 'غسل الرأس والرقبة'),
      body: L(
        'Wash the head and neck ensuring water reaches the skin (and roots of hair).',
        'سر اور گردن دھوئیں؛ پانی بالوں کی جڑوں اور جلد تک پہنچے۔',
        'اغسل الرأس والرقبة ويصل الماء إلى الجلد.',
      ),
      visualHint: 'ghusl_head',
    }),
    step({
      id: `${prefix}_right_side`,
      kind: 'wash',
      title: L('Wash the right side', 'دایاں پہلو', 'غسل الجانب الأيمن'),
      body: L(
        'Wash the entire right side of the body from shoulder to foot, ensuring water flows over the skin.',
        'دائیں پہلو کندھے سے پاؤں تک دھوئیں۔',
        'اغسل الجانب الأيمن من المنكب إلى القدم.',
      ),
      visualHint: 'ghusl_body',
    }),
    step({
      id: `${prefix}_left_side`,
      kind: 'wash',
      title: L('Wash the left side', 'بایاں پہلو', 'غسل الجانب الأيسر'),
      body: L(
        'Wash the entire left side the same way.',
        'بایاں پہلو ویسے ہی دھوئیں۔',
        'اغسل الجانب الأيسر مثل الأيمن.',
      ),
      visualHint: 'ghusl_body',
    }),
    step({
      id: `${prefix}_complete`,
      kind: 'completion',
      title: L('Ghusl complete', 'غسل مکمل', 'اكتمل الغسل'),
      body: purpose,
      isRequired: false,
    }),
  ];
}
