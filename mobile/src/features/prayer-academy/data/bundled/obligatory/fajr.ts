import { getCatalogMeta } from '../../../constants/catalog';
import type { PrayerAcademyBundle } from '../../../types';
import { dailyPrayerSteps } from '../../shared/dailyPrayerDetailedSteps';
import {
  COMMON_CONDITIONS,
  COMMON_SUNNI_DIFFERENCES,
  dailyTimingRules,
  L,
  wajibRakats,
} from '../../shared/contentHelpers';

const meta = getCatalogMeta('salat_fajr');
const name = meta.titles;
const STEPS = dailyPrayerSteps('fajr');

export const SALAT_FAJR: PrayerAcademyBundle = {
  meta: { ...meta, estimatedMinutes: 8 },
  bundleVersion: 2,
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
    beginner: STEPS,
    advanced: [
      ...STEPS,
      {
        id: 'adv_fajr_note',
        kind: 'fiqh_note',
        titles: L('Fajr qunoot', 'فجر میں قنوت', 'قنوت الفجر'),
        body: L(
          'Qunoot in Fajr 2nd rakat is wajib per most marja.',
          'اکثر مراجع کے نزدیک فجر کی دوسری رکعت میں قنوت واجب ہے۔',
          'القنوت في الركعة الثانية من الفجر واجب عند أكثر المراجع.',
        ),
        advancedOnly: true,
        citations: [{ source: 'ShiaSalaah.org', verified: true }],
      },
    ],
  },
};
