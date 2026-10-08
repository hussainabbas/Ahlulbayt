import type { WorshipGuideStep } from '../../types';
import { E, MF_L } from './englishText';
import { step, WUDU_INVALIDATORS } from './taharahHelpers';

export function buildDetailedWuduSteps(): Record<
  'beginner' | 'standard' | 'scholar',
  WorshipGuideStep[]
> {
  const niyyah = step({
    id: 'wudu_niyyah',
    kind: 'niyyah',
    title: E('Intention (Niyyah)', 'نیت', 'النية'),
    body: E(
      'Make Niyyah (solemn intention) in your heart and your mind: “I am performing Wudhu (Ablution), in order to recite Salaah, seeking closeness to God”.',
      'دل و ذہن میں نیت کریں: «میں نماز پڑھنے اور اللہ کی قربت حاصل کرنے کے لیے وضو کر رہا/رہی ہوں»۔',
      'انوِ في قلبك وعقلك: «أنوي الوضوء لأداء الصلاة تقرباً إلى الله».',
    ),
    arabicText: 'نَوَيْتُ الوُضُوءَ لِلّٰهِ تَعَالٰى',
    transliteration: E(
      'Nawaytu al-wudū\'a lillāhi ta\'ālā lita\'āda al-ṣalāh',
      'Nawaytu al-wudū\'a lillāhi ta\'ālā lita\'āda al-ṣalāh',
      'Nawaytu al-wudū\'a lillāhi ta\'ālā lita\'āda al-ṣalāh',
    ),
    visualHint: 'niyyah',
    fiqhRefs: [
      {
        source: E('ShiaSalaah.org — Wudhu', 'ShiaSalaah.org — وضو', 'ShiaSalaah.org — الوضوء'),
        citation: E('https://shiasalaah.org/', 'https://shiasalaah.org/', 'https://shiasalaah.org/'),
      },
    ],
  });

  const core: WorshipGuideStep[] = [
    niyyah,
    step({
      id: 'wudu_mouth',
      kind: 'wash',
      title: E('Rinsing the mouth', 'منہ کی کلی', 'المضمضة'),
      body: E(
        'It is recommended to rinse the mouth with water, three times.',
        'منہ میں پانی سے کلی کرنا مستحب ہے، تین مرتبہ۔',
        'يُستحب المضمضة بالماء ثلاث مرات.',
      ),
      visualHint: 'wash_face',
    }),
    step({
      id: 'wudu_nose',
      kind: 'wash',
      title: E('Rinsing the nose', 'ناک کی جھاڑنا', 'الاستنشاق'),
      body: E(
        'It is recommended to rinse the nose with water, three times.',
        'ناک میں پانی ڈال کر جھاڑنا مستحب ہے، تین مرتبہ۔',
        'يُستحب الاستنشاق بالماء ثلاث مرات.',
      ),
      visualHint: 'wash_face',
    }),
    step({
      id: 'wudu_face',
      kind: 'wash',
      title: E('Washing the face', 'چہرہ دھونا', 'غسل الوجه'),
      body: MF_L(
        'Take a handful of water in the right hand and pour it over the face from above the forehead. Wipe from the hair-line to the bottom of the chin and from ear to ear so water reaches the skin.',
        'دائیں ہاتھ میں پانی لے کر پیشانی سے چہرے پر بہائیں۔ بالوں کی لکیر سے ٹھوڑی تک اور کان سے کان تک دھوئیں تاکہ پانی جلد تک پہنچے۔',
        'خذ حفنة ماء باليد اليمنى واسكبها على الوجه من فوق الجبهة. امسح من خط الشعر إلى أسفل الذقن ومن أذن إلى أذن حتى يصل الماء إلى الجلد.',
        'Wash once (obligatory). A second washing is recommended; more than two is prohibited.',
        'ایک بار دھونا واجب ہے۔ دوسری بار مستحب؛ دو سے زیادہ ممنوع ہے۔',
        'الغسل مرة واحدة واجب. الثانية مستحبة؛ أكثر من مرتين محظور.',
        'Wash once (obligatory). A second washing is recommended; more than two is prohibited.',
        'ایک بار دھونا واجب ہے۔ دوسری بار مستحب؛ دو سے زیادہ ممنوع ہے۔',
        'الغسل مرة واحدة واجب. الثانية مستحبة؛ أكثر من مرتين محظور.',
      ),
      visualHint: 'wash_face',
      animationAssetKey: 'sim/wudu/face',
    }),
    step({
      id: 'wudu_right_arm',
      kind: 'wash',
      title: E('Washing the right arm', 'دائیں بازو دھونا', 'غسل الذراع الأيمن'),
      body: MF_L(
        'Using the left hand, pour water from the elbow to the fingertips, wiping both sides so water reaches the skin and hair.',
        'بائیں ہاتھ سے کہنی سے انگلیوں کے سرے تک پانی بہائیں؛ دونوں طرف سے دھوئیں تاکہ پانی جلد اور بالوں تک پہنچے۔',
        'باليد اليسرى اسكب الماء من المرفق إلى أطراف الأصابع، وامسح الجانبين حتى يصل الماء إلى الجلد والشعر.',
        'Wash once (obligatory). Second wash recommended; more than two prohibited.',
        'ایک بار واجب؛ دوسری بار مستحب؛ دو سے زیادہ ممنوع۔',
        'الغسل مرة واجب. الثانية مستحبة؛ أكثر من مرتين محظور.',
        'Wash once (obligatory). Second wash recommended; more than two prohibited.',
        'ایک بار واجب؛ دوسری بار مستحب؛ دو سے زیادہ ممنوع۔',
        'الغسل مرة واجب. الثانية مستحبة؛ أكثر من مرتين محظور.',
      ),
      visualHint: 'wash_arm_right',
      animationAssetKey: 'sim/wudu/arm_right',
    }),
    step({
      id: 'wudu_left_arm',
      kind: 'wash',
      title: E('Washing the left arm', 'بائیں بازو دھونا', 'غسل الذراع الأيسر'),
      body: E(
        'Using the right hand, wash the left arm from elbow to fingertips in the same way. Do not wash from fingertips upward.',
        'دائیں ہاتھ سے بائیں بازو کو کہنی سے انگلیوں تک اسی طرح دھوئیں۔ انگلیوں سے اوپر کی طرف دھونا درست نہیں۔',
        'باليد اليمنى اغسل الذراع الأيسر من المرفق إلى أطراف الأصابع بنفس الطريقة. لا تغسل من الأصابع إلى الأعلى.',
      ),
      visualHint: 'wash_arm_left',
      animationAssetKey: 'sim/wudu/arm_left',
    }),
    step({
      id: 'wudu_head',
      kind: 'masah',
      title: E('Wiping the head (Masah)', 'سر کا مسح', 'مسح الرأس'),
      body: MF_L(
        'Wipe the front quarter of the head with the moisture remaining in your right hand, from the upper part downward. Wipe at least one finger-length; three fingers together is recommended.',
        'دائیں ہاتھ میں بچا ہوا پانی لے کر سر کے سامنے کے چوتھائی حصے کو اوپر سے نیچے مسح کریں۔ کم از کم ایک انگلی کا مسح؛ تین انگلیاں مل کر مستحب ہیں۔',
        'امسح ربع الرأس الأمامي ببقية رطوبة اليد اليمنى من الأعلى إلى الأسفل. امسح بمقدار إصبع على الأقل؛ ثلاثة أصابع معاً مستحب.',
        'While wiping, do not let your hand touch your forehead (this invalidates foot masah).',
        'مسح کرتے وقت ہاتھ پیشانی کو نہ لگائیں (اس سے پاؤں کا مسح باطل ہو سکتا ہے)۔',
        'عند المسح لا تلمس الجبهة باليد (فقد يبطل مسح القدم).',
        'While wiping, do not let your hand touch your forehead.',
        'مسح کرتے وقت ہاتھ پیشانی کو نہ لگائیں۔',
        'عند المسح لا تلمس الجبهة باليد.',
      ),
      visualHint: 'masah_head',
      animationAssetKey: 'sim/wudu/head',
    }),
    step({
      id: 'wudu_feet',
      kind: 'masah',
      title: E('Wiping the feet (Masah)', 'پاؤں کا مسح', 'مسح القدمين'),
      body: MF_L(
        'Wipe the feet with remaining hand moisture — from toe-tips up to the ankle. Pull the hand along the foot; do not merely place the hand on the foot.',
        'ہاتھ میں بچی رطوبت سے پاؤں مسح کریں — انگلیوں کے سرے سے ٹخنے تک۔ ہاتھ پاؤں پر گھسیٹیں؛ صرف رکھنا کافی نہیں۔',
        'امسح القدمين ببقية رطوبة اليد — من أطراف الأصابع إلى الكعب. اسحب اليد على القدم ولا تضعها فقط.',
        'Wipe the right foot with the right hand and the left foot with the left hand. Wiping on socks/shoes is not valid except in unusual circumstances.',
        'دائیں پاؤں دائیں ہاتھ سے، بائیں پاؤں بائیں ہاتھ سے۔ موزے/جوتے پر مسح درست نہیں سوائے استثنائی صورتوں کے۔',
        'امسح اليمنى باليمنى واليسرى باليسرى. المسح على الجوارب غير صحيح إلا في حالات استثنائية.',
        'Wipe the right foot with the right hand and the left foot with the left hand.',
        'دائیں پاؤں دائیں ہاتھ سے، بائیں پاؤں بائیں ہاتھ سے۔',
        'امسح اليمنى باليمنى واليسرى باليسرى.',
      ),
      visualHint: 'masah_feet',
      animationAssetKey: 'sim/wudu/feet',
    }),
    step({
      id: 'wudu_complete',
      kind: 'completion',
      title: E('Wudu complete', 'وضو مکمل', 'اكتمل الوضوء'),
      body: E(
        'You are now in a state of wudu. Proceed to Salaah when the time is valid.',
        'آپ وضو کی حالت میں ہیں۔ نماز کا وقت ہونے پر نماز پڑھیں۔',
        'أنت الآن على وضوء. تابع إلى الصلاة عند حلول وقتها.',
      ),
      isRequired: false,
    }),
  ];

  const intro = step({
    id: 'wudu_intro',
    kind: 'intro',
    title: E('Before Wudhu', 'وضو سے پہلے', 'قبل الوضوء'),
    body: E(
      'It is compulsory to perform Wudhu prior to performing Salaah. Wudhu is a ritual cleansing. Ensure a clean body, clean place, and clothing free of impurities.',
      'نماز سے پہلے وضو کرنا واجب ہے۔ وضو ایک طقساتی طہارت ہے۔ جسم، جگہ اور کپڑے پاک ہوں، ناپاکی سے پاک ہوں۔',
      'يجب الوضو قبل الصلاة. الوضو طهارة شعائرية. تأكد من نظافة الجسم والمكان والثياب وخلوها من النجاسة.',
    ),
    isRequired: false,
    scholarBody: MF_L(
      'Minimum clothing during Salaah:',
      'نماز میں کم از کم لباس:',
      'الحد الأدنى للستر في الصلاة:',
      'Cover from the navel to the knees; covering the shoulders is preferable.',
      'ناف سے گھٹنوں تک چھپانا؛ کندھے ڈھانپنا افضل ہے۔',
      'ستر من السرة إلى الركبتين؛ تغطية الكتفين أفضل.',
      'Cover the whole body including the head except the face and hands.',
      'سارا جسم بشمول سر ڈھانپیں سوائے چہرے اور ہاتھوں کے۔',
      'ستر كل الجسم بما فيه الرأس إلا الوجه والكفين.',
    ),
    citations: [
      {
        source: 'ShiaSalaah.org',
        verified: true,
        note: 'Wudhu and preparation for Salaah',
      },
    ],
  });

  const scholarInvalidators: WorshipGuideStep = {
    id: 'wudu_invalidators',
    kind: 'invalidator',
    title: E('What breaks Wudu?', 'وضو کب باطل ہوتا ہے؟', 'مبطلات الوضوء'),
    body: E(
      'Learn the main invalidators so you know when to renew wudu before salah.',
      'اہم مبطلات سیکھیں تاکہ نماز سے پہلے وضو دوبارہ کرنے کا وقت معلوم ہو۔',
      'تعلّم المبطلات الرئيسية لتعرف متى تجدد الوضو قبل الصلاة.',
    ),
    isRequired: false,
    checklist: WUDU_INVALIDATORS.map((i) => i.title),
  };

  return {
    beginner: [intro, ...core],
    standard: [intro, ...core],
    scholar: [intro, ...core, scholarInvalidators],
  };
}
