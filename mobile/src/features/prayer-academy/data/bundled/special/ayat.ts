import { getCatalogMeta } from '../../../constants/catalog';
import type { PrayerAcademyBundle } from '../../../types';
import { COMMON_CONDITIONS, L, twoRakatWajibSteps } from '../../shared/contentHelpers';

const meta = getCatalogMeta('namaz_e_ayat');

export const NAMAZ_E_AYAT: PrayerAcademyBundle = {
  meta,
  bundleVersion: 1,
  rakatStructure: [
    {
      id: 'per_sign',
      kind: 'wajib',
      count: 2,
      label: L('Per sign (Ayah)', 'ہر آیت پر', 'لكل آية'),
      notes: L('Repeat for each sign unit', 'ہر آیت کے لیے دہرائیں', 'تُكرر لكل آية'),
    },
  ],
  timingRules: [
    {
      id: 'when',
      title: L('When it becomes wajib', 'کب واجب ہو', 'متى تجب'),
      body: L(
        'Solar/lunar eclipse, earthquake, lightning, red windstorm, and similar awe-inspiring signs. Each sign requires its own 2-rakat prayer when possible.',
        'سورج/چاند گرہن، زلزلہ، بجلی، سرخ طوفان وغیرہ۔ ہر آیت پر (جہاں ممکن) ۲ رکعت۔',
        'الكسوف والخسوف والزلزلة والصواعق والريح الحمراء ونحوها. ركعتان لكل آية حيث أمكن.',
      ),
    },
  ],
  conditions: [
    ...COMMON_CONDITIONS,
    {
      id: 'asap',
      title: L('Perform promptly', 'جلد ادا کریں', 'المبادرة'),
      body: L(
        'Delay without excuse is sinful. May be performed individually or in congregation.',
        'بغیر عذر تاخیر گناہ ہے۔ انفرادی یا جماعت سے۔',
        'التأخير بلا عذر آثم. تؤدى فرادى أو جماعة.',
      ),
    },
  ],
  steps: {
    beginner: [
      {
        id: 'intro',
        kind: 'intro',
        titles: L('Overview', 'تعارف', 'نبذة'),
        body: L(
          'Namaz-e-Ayat is 2 rakats like daily prayer but with specific structure per sign. During eclipse, recite long surahs in both rakats.',
          'نماز آیات ۲ رکعت ہے مگر ہر آیت کے لیے alag structure۔ گرہن میں دونوں رکعتوں میں لمبی سورتیں۔',
          'صلاة الآيات ركعتان ببنية خاصة. في الكسوف تُقرأ سور طويلة.',
        ),
      },
      ...twoRakatWajibSteps(meta.titles, true),
      {
        id: 'eclipse_note',
        kind: 'fiqh_note',
        titles: L('Eclipse method', 'گرہن کا طریقہ', 'طريقة الكسوف'),
        body: L(
          'For solar eclipse: 5 ruku/sujud cycles in 1st rakat, 5 in 2nd (each after a portion of long surah). Lunar eclipse: 2 ruku per rakat after long recitation.',
          'سورج گرہن: پہلی رکعت ۵ رکوع/سجدے، دوسری ۵۔ چاند گرہن: ہر رکعت میں ۲ رکوع لمبی قراءت کے بعد۔',
          'كسوف الشمس: ٥ ركوعات في كل ركعة. خسوف القمر: ركوعان في كل ركعة بعد قراءة طويلة.',
        ),
        fiqhRefs: [
          {
            source: L('Islamic Laws — Sayyid Sistani', 'احکام اسلامی', 'المسائل'),
            marja: 'sistani',
          },
        ],
      },
    ],
    advanced: twoRakatWajibSteps(meta.titles, true),
  },
};
