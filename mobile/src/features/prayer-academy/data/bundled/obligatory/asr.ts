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

const meta = getCatalogMeta('salat_asr');
const name = meta.titles;
const STEPS = dailyPrayerSteps('asr');

export const SALAT_ASR: PrayerAcademyBundle = {
  meta: { ...meta, estimatedMinutes: 15 },
  bundleVersion: 2,
  rakatStructure: wajibRakats(4, name),
  timingRules: [
    ...dailyTimingRules(
      'asr',
      L('Asr time', 'وقت عصر', 'وقت العصر'),
      L(
        'Begins when shadow of an object equals its length (after Dhuhr). Preferred time (fadhilat) ends when sun yellows; permitted until Maghrib.',
        'جب سایہ چیز کے برابر ہو (ظہر کے بعد)۔ فضیلت کا وقت پیلے پڑنے تک؛ جائز مغرب تک۔',
        'يبدأ عندما يصبح ظل الشيء مثله. وقت الفضيلة حتى اصفار الشمس؛ والجواز حتى المغرب.',
      ),
    ),
  ],
  conditions: COMMON_CONDITIONS,
  sunniDifferences: [
    ...COMMON_SUNNI_DIFFERENCES,
    {
      topic: L('Asr — no qunoot', 'عصر — بلا قنوت', 'العصر — بلا قنوت'),
      jafari: L('Qunoot is not performed in Asr prayer.', 'عصر میں قنوت نہیں پڑھتے۔', 'لا قنوت في صلاة العصر.'),
    },
  ],
  steps: {
    beginner: STEPS,
    advanced: STEPS,
  },
};
