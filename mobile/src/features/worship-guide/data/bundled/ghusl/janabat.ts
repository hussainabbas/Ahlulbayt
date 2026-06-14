import { getCatalogMeta } from '../../../constants/catalog';
import type { WorshipGuideBundle } from '../../../types';
import { ghuslTartibiSteps, L, step } from '../../shared/taharahHelpers';

const title = { en: 'Janabat', ur: 'جنابت', ar: 'الجنابة' };

export const GHUSL_JANABAT: WorshipGuideBundle = {
  meta: getCatalogMeta('ghusl_janabat'),
  bundleVersion: 1,
  methodVariants: [
    {
      method: 'tartibi',
      title: L('Tartibi (sequential)', 'ترتیبی', 'الترتيبي'),
      summary: L('Head → right side → left side', 'سر → دایاں → بایاں', 'الرأس → الأيمن → الأيسر'),
    },
    {
      method: 'irtimasi',
      title: L('Irtimasi (immersion)', 'ارتماسی', 'الارتماسي'),
      summary: L(
        'Full body immersion in water with niyyah — valid when water covers entire body at once.',
        'پورے جسم کا ایک ساتھ پانی میں ڈوبنا نیت کے ساتھ۔',
        'غمس البدن كله في الماء مع النية.',
      ),
    },
  ],
  waterRequirements: L(
    'Sufficient clean water to pour over entire body, or a pool for irtimasi.',
    'پورے جسم پر بہانے کے لیے کافی پاک پانی۔',
    'ماء كافٍ طاهر ليغمر البدن.',
  ),
  steps: {
    beginner: ghuslTartibiSteps(
      'janabat',
      title,
      L('You are now tahir from janabah.', 'جنابت سے پاک ہو گئے۔', 'تحللت من الجنابة.'),
    ),
    standard: [
      step({
        id: 'janabat_intro',
        kind: 'intro',
        title: L('When is this ghusl wajib?', 'یہ غسل کب واجب؟', 'متى يجب هذا الغسل؟'),
        body: L(
          'After sexual intercourse, ejaculation (even without intercourse), and other causes of janabah per your marja.',
          'جماع، انزال (بغیر جماع بھی)، اور دیگر اسباب جنابت کے مطابق مرجع۔',
          'بعد الجماع أو الاستمناء وأسباب الجنابة بحسب المرجع.',
        ),
        isRequired: false,
      }),
      ...ghuslTartibiSteps(
        'janabat',
        title,
        L('Janabah ghusl complete. Wudu is not required before ghusl, but many perform recommended acts after.', 'غسل جنابت مکمل۔', 'اكتمل غسل الجنابة.'),
      ),
    ],
    scholar: [
      step({
        id: 'janabat_scholar',
        kind: 'fiqh_note',
        title: L('Irtimasi vs Tartibi', 'ارتماسی و ترتیبی', 'الارتماسي والترتيبي'),
        body: L('Both methods are valid when performed correctly with niyyah.', 'دونوں درست ہیں اگر نیت و طریقہ درست ہو۔', 'كلاهما صحيح مع النية.'),
        scholarBody: L(
          'Tartibi: head/neck, then right side, then left — water must reach skin. Irtimasi: immediate full immersion.',
          'ترتیبی: سر، دایاں، بایاں۔ ارتماسی: فوری ڈوبک۔',
          'الترتيبي: الرأس ثم الأيمن ثم الأيسر. الارتماسي: الغمس فورًا.',
        ),
        isRequired: false,
        fiqhRefs: [
          {
            source: L('Imam Ja\'far al-Sadiq (as)', 'امام جعفر صادقؑ', 'الإمام جعفر الصادق (ع)'),
            citation: L('On ghusl methods', 'غسل کے طریقے', 'في طرق الغسل'),
          },
        ],
      }),
      ...ghuslTartibiSteps('janabat', title, L('Complete.', 'مکمل۔', 'اكتمل.')),
    ],
  },
};
