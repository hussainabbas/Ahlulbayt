import { getCatalogMeta } from '../../../constants/catalog';
import type { PrayerAcademyBundle } from '../../../types';
import {
  COMMON_CONDITIONS,
  COMMON_SUNNI_DIFFERENCES,
  dailyTimingRules,
  fourRakatWajibSteps,
  L,
  threeRakatWajibSteps,
  twoRakatWajibSteps,
  wajibRakats,
} from '../../shared/contentHelpers';

const meta = getCatalogMeta('salat_fajr');
const name = meta.titles;

export const SALAT_FAJR: PrayerAcademyBundle = {
  meta,
  bundleVersion: 1,
  rakatStructure: [
    ...wajibRakats(2, name),
    {
      id: 'mustahab_before',
      kind: 'mustahab',
      count: 2,
      label: L('Mustahab before Fajr', 'فجر سے پہلے مستحب', 'مستحب قبل الفجر'),
      notes: L('Optional; not wajib', 'اختیاری؛ واجب نہیں', 'اختياري؛ ليس واجبًا'),
    },
  ],
  timingRules: dailyTimingRules(
    'fajr',
    L('Fajr time', 'وقت فجر', 'وقت الفجر'),
    L(
      'From true dawn (Fajr al-Sadiq) until sunrise. Ends at sunrise — do not pray wajib Fajr after sun rises.',
      'صبح صادق سے طلوع آفتاب تک۔ طلوع کے بعد واجب فجر نہیں۔',
      'من الفجر الصادق إلى طلوع الشمس. لا تصلي الفجر الواجب بعد الطلوع.',
    ),
  ),
  conditions: COMMON_CONDITIONS,
  sunniDifferences: COMMON_SUNNI_DIFFERENCES,
  audioCues: [{ id: 'takbir', label: L('Takbir', 'تکبیر', 'التكبير'), assetKey: 'prayer/takbir' }],
  steps: {
    beginner: twoRakatWajibSteps(name, true),
    advanced: [
      ...twoRakatWajibSteps(name, true),
      {
        id: 'adv_fajr_note',
        kind: 'fiqh_note',
        titles: L('Fajr qunoot', 'فجر میں قنوت', 'قنوت الفجر'),
        body: L(
          'Qunoot in Fajr 2nd rakat is wajib per most marja. Some scholars emphasize specific qunoot text from Ahlul Bayt (as).',
          'اکثر مراجع کے نزدیک فجر کی دوسری رکعت میں قنوت واجب ہے۔',
          'القنوت في الركعة الثانية من الفجر واجب عند أكثر المراجع.',
        ),
        advancedOnly: true,
        fiqhRefs: [
          {
            source: L('Imam Ja\'far al-Sadiq (as)', 'امام جعفر صادقؑ', 'الإمام جعفر الصادق (ع)'),
            citation: L('On performing qunoot in Fajr', 'فجر میں قنوت', 'في القنوت في الفجر'),
          },
        ],
      },
    ],
  },
};
