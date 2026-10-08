import { getCatalogMeta } from '../../constants/catalog';
import type { WorshipGuideBundle } from '../../types';
import { E } from '../shared/englishText';
import { step } from '../shared/taharahHelpers';

export const TAYAMMUM_STANDARD: WorshipGuideBundle = {
  meta: getCatalogMeta('tayammum_standard'),
  bundleVersion: 1,
  steps: {
    beginner: tayammumSteps(),
    standard: tayammumSteps(),
    scholar: [
      ...tayammumSteps(),
      step({
        id: 'tayammum_note',
        kind: 'fiqh_note',
        title: E('When is Tayammum valid?', 'تیمم کب درست ہے؟', 'متى يصح التيمم؟'),
        body: E(
          'Tayammum replaces Wudhu (or Ghusl) when water is unavailable, harmful to use, or insufficient — per your marja. Use dry, clean earth, sand, or stone.',
          'جب پانی نہ ہو، استعمال نقصان دے، یا ناکافی ہو — اپنے مرجع کے مطابق — تیمم وضو (یا غسل) کی جگہ لیتا ہے۔ خشک، پاک مٹی، ریت یا پتھر استعمال کریں۔',
          'يحل التيمم محل الوضوء (أو الغسل) عند عدم توفر الماء أو ضرره أو قلته — حسب مرجعك. استخدم تراباً أو رملاً أو حجراً يابساً طاهراً.',
        ),
        isRequired: false,
        citations: [
          { source: 'ShiaSalaah.org', verified: true },
          { source: 'Qur\'an 5:6', verified: true, note: 'Tayammum when water unavailable' },
        ],
      }),
    ],
  },
};

function tayammumSteps() {
  return [
    step({
      id: 'tayammum_niyyah',
      kind: 'niyyah',
      title: E('Intention (Niyyah)', 'نیت', 'النية'),
      body: E(
        'Make Niyyah in your heart: “I am doing Tayammum in place of Wudhu (or Ghusl), for the pleasure of Allah and to seek closeness to Him.”',
        'دل میں نیت کریں: «میں اللہ کی رضا اور اس کی قربت کے لیے وضو (یا غسل) کی جگہ تیمم کر رہا/رہی ہوں»۔',
        'انوِ في قلبك: «أنوي التيمم محل الوضوء (أو الغسل) لله تعالى تقرباً إليه».',
      ),
      visualHint: 'niyyah',
    }),
    step({
      id: 'tayammum_strike_1',
      kind: 'masah',
      title: E('Step 1 — Strike the earth', 'قدم ۱ — زمین پر مارنا', 'الخطوة ١ — ضرب التراب'),
      body: E(
        'Strike the palms of both hands simultaneously on dry, clean earth, sand, or stone (in order of preference).',
        'دونوں ہتھیلیاں ایک ساتھ خشک، پاک مٹی، ریت یا پتھر پر ماریں (ترجیح کے لحاظ سے)۔',
        'اضرب ببطون كفيك معاً على تراب أو رمل أو حجر يابس طاهر (بحسب الأولوية).',
      ),
      visualHint: 'masah_head',
    }),
    step({
      id: 'tayammum_forehead',
      kind: 'masah',
      title: E('Step 2 — Wipe the forehead', 'قدم ۲ — پیشانی مسح', 'الخطوة ٢ — مسح الجبهة'),
      body: E(
        'Pull both palms from the beginning of the forehead (where hair grows) down to the bridge of the nose. Include both sides joining the ears and over the eyebrows.',
        'دونوں ہتھیلیاں پیشانی کے آغاز (جہاں بال اگتے ہیں) سے ناک کے پُر تک مسح کریں۔ کانوں تک دونوں طرف اور ابروں پر بھی۔',
        'امسح بكفيك من ابتداء الجبهة (موضع نبت الشعر) إلى أعلى الأنف. شمل الجانبين حتى الأذنين وفوق الحاجبين.',
      ),
      visualHint: 'masah_head',
    }),
    step({
      id: 'tayammum_right_hand',
      kind: 'masah',
      title: E('Step 3 — Wipe back of right hand', 'قدم ۳ — دائیں ہاتھ کی پشت مسح', 'الخطوة ٣ — مسح ظهر اليد اليمنى'),
      body: E(
        'Pull the left palm on the whole back of the right hand from the wrist bone to the fingertips.',
        'بائیں ہتھیلی سے دائیں ہاتھ کی پوری پشت کو کلائی کی ہڈی سے انگلیوں کے سرے تک مسح کریں۔',
        'امسح بكفك الأيسر ظهر اليد اليمنى كاملاً من عظم المعصم إلى أطراف الأصابع.',
      ),
      visualHint: 'masah_feet',
    }),
    step({
      id: 'tayammum_left_hand',
      kind: 'masah',
      title: E('Step 4 — Wipe back of left hand', 'قدم ۴ — بائیں ہاتھ کی پشت مسح', 'الخطوة ٤ — مسح ظهر اليد اليسرى'),
      body: E(
        'Pull the right palm on the whole back of the left hand.',
        'دائیں ہتھیلی سے بائیں ہاتھ کی پوری پشت مسح کریں۔',
        'امسح بكفك الأيمن ظهر اليد اليسرى كاملاً.',
      ),
      visualHint: 'masah_feet',
    }),
    step({
      id: 'tayammum_strike_2',
      kind: 'masah',
      title: E('Step 5 — Strike again', 'قدم ۵ — دوبارہ مارنا', 'الخطوة ٥ — الضرب مرة أخرى'),
      body: E(
        'Strike the palms together upon a valid surface a second time, as in Step 1.',
        'قدم ۱ کی طرح دوبارہ دونوں ہتھیلیاں جائز سطح پر ماریں۔',
        'اضرب بكفيك على سطح صالح مرة ثانية كما في الخطوة ١.',
      ),
      visualHint: 'masah_head',
    }),
    step({
      id: 'tayammum_repeat_right',
      kind: 'masah',
      title: E('Step 6 — Repeat right hand', 'قدم ۶ — دائیں ہاتھ دہرائیں', 'الخطوة ٦ — إعادة اليد اليمنى'),
      body: E(
        'Repeat Step 3 — wipe the back of the right hand with the left palm.',
        'قدم ۳ دہرائیں — بائیں ہتھیلی سے دائیں ہاتھ کی پشت مسح کریں۔',
        'كرر الخطوة ٣ — امسح ظهر اليد اليمنى بالكف الأيسر.',
      ),
      visualHint: 'masah_feet',
    }),
    step({
      id: 'tayammum_repeat_left',
      kind: 'masah',
      title: E('Step 7 — Repeat left hand', 'قدم ۷ — بائیں ہاتھ دہرائیں', 'الخطوة ٧ — إعادة اليد اليسرى'),
      body: E(
        'Repeat Step 4 — wipe the back of the left hand with the right palm. Tayammum is complete.',
        'قدم ۴ دہرائیں — دائیں ہتھیلی سے بائیں ہاتھ کی پشت مسح کریں۔ تیمم مکمل ہو گیا۔',
        'كرر الخطوة ٤ — امسح ظهر اليد اليسرى بالكف الأيمن. اكتمل التيمم.',
      ),
      visualHint: 'masah_feet',
    }),
  ];
}
