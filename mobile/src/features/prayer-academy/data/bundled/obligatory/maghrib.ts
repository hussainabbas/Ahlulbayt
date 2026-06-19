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

const meta = getCatalogMeta('salat_maghrib');
const name = meta.titles;
const STEPS = dailyPrayerSteps('maghrib');

export const SALAT_MAGHRIB: PrayerAcademyBundle = {
  meta: { ...meta, estimatedMinutes: 12 },
  bundleVersion: 2,
  rakatStructure: [
    ...wajibRakats(3, name),
    {
      id: 'mustahab_after',
      kind: 'mustahab',
      count: 2,
      label: L('After Maghrib', 'مغرب کے بعد', 'بعد المغرب'),
      notes: L('Highly recommended', 'بہت مستحب', 'مستحب شدًا'),
    },
  ],
  timingRules: dailyTimingRules(
    'maghrib',
    L('Maghrib time', 'وقت مغرب', 'وقت المغرب'),
    L(
      'After complete sunset. App uses Jafari method with ~17 min delay after sunset for adhan/prayer per common marja guidance.',
      'مکمل غروب کے بعد۔ ایپ جعفری طریقے سے غروب کے بعد ~۱۷ منٹ کی مہلت استعمال کرتی ہے۔',
      'بعد غروب الشمس الكامل. يستخدم التطبيق المنهج الجعفري مع مهل ~17 دقيقة بعد الغروب.',
    ),
  ),
  conditions: COMMON_CONDITIONS,
  sunniDifferences: COMMON_SUNNI_DIFFERENCES,
  steps: {
    beginner: STEPS,
    advanced: STEPS,
  },
};
