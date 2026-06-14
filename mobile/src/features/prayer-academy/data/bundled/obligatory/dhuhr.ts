import { getCatalogMeta } from '../../../constants/catalog';
import type { PrayerAcademyBundle } from '../../../types';
import {
  COMMON_CONDITIONS,
  COMMON_SUNNI_DIFFERENCES,
  dailyTimingRules,
  fourRakatWajibSteps,
  L,
  wajibRakats,
} from '../../shared/contentHelpers';

const meta = getCatalogMeta('salat_dhuhr');
const name = meta.titles;

export const SALAT_DHUHR: PrayerAcademyBundle = {
  meta,
  bundleVersion: 1,
  rakatStructure: [
    {
      id: 'mustahab_before',
      kind: 'mustahab',
      count: 4,
      label: L('Before Dhuhr', 'ظہر سے پہلے', 'قبل الظهر'),
    },
    ...wajibRakats(4, name),
    {
      id: 'mustahab_after',
      kind: 'mustahab',
      count: 2,
      label: L('After Dhuhr', 'ظہر کے بعد', 'بعد الظهر'),
    },
  ],
  timingRules: dailyTimingRules(
    'dhuhr',
    L('Dhuhr time', 'وقت ظہر', 'وقت الظهر'),
    L(
      'From zawal (midday when sun passes zenith) until Asr. On Friday, Jumu\'ah replaces Dhuhr for those who qualify.',
      'زوال سے عصر تک۔ جمعہ کو اہل افراد کے لیے جمعہ ظہر کی جگہ۔',
      'من الزوال إلى العصر. يوم الجمعة تُقام صلاة الجمعة مقام الظهر للمستوفين.',
    ),
  ),
  conditions: COMMON_CONDITIONS,
  sunniDifferences: COMMON_SUNNI_DIFFERENCES,
  steps: {
    beginner: fourRakatWajibSteps(name, false),
    advanced: fourRakatWajibSteps(name, false),
  },
};
