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

const meta = getCatalogMeta('salat_isha');
const name = meta.titles;

export const SALAT_ISHA: PrayerAcademyBundle = {
  meta,
  bundleVersion: 1,
  rakatStructure: [
    ...wajibRakats(4, name),
    {
      id: 'shaf',
      kind: 'nafl',
      count: 2,
      label: L('Shaf\' (nafl)', 'شفع', 'الشفع'),
      notes: L('After wajib Isha', 'واجب عشاء کے بعد', 'بعد العشاء الواجبة'),
    },
    {
      id: 'witr',
      kind: 'witr',
      count: 1,
      label: L('Witr', 'وتر', 'الوتر'),
      notes: L('One rakat with qunoot', 'ایک رکعت قنوت کے ساتھ', 'ركعة واحدة مع القنوت'),
    },
  ],
  timingRules: dailyTimingRules(
    'isha',
    L('Isha time', 'وقت عشاء', 'وقت العشاء'),
    L(
      'Begins after Maghrib time ends (twilight/night). Ends at midnight (fadhilat) or before subh sadiq (permitted).',
      'مغرب کے بعد (شفق/رات)۔ نصف رات (فضیلت) یا صبح صادق سے پہلے (جائز)۔',
      'يبدأ بعد المغرب. ينتهي وقت الفضيلة بنصف الليل أو قبل الفجر الصادق.',
    ),
  ),
  conditions: COMMON_CONDITIONS,
  sunniDifferences: COMMON_SUNNI_DIFFERENCES,
  steps: {
    beginner: fourRakatWajibSteps(name, true),
    advanced: [
      ...fourRakatWajibSteps(name, true),
      {
        id: 'shaf_witr',
        kind: 'fiqh_note',
        titles: L('Shaf\' & Witr after Isha', 'شفع و وتر', 'الشفع والوتر'),
        body: L(
          '2 rakats Shaf\' (nafl) then 1 rakat Witr with qunoot — highly recommended nightly practice.',
          '۲ رکعت شفع پھر ۱ رکعت وتر قنوت کے ساتھ — شب کی بہترین مستحب عبادت۔',
          'ركعتان شفع ثم ركعة وتر مع القنوت — من أفضل العبادات الليلية.',
        ),
        advancedOnly: true,
        fiqhRefs: [
          {
            source: L('Imam Ja\'far al-Sadiq (as)', 'امام جعفر صادقؑ', 'الإمام جعفر الصادق (ع)'),
            citation: L('Virtue of Witr after Isha', 'عشاء کے بعد وتر', 'فضل الوتر بعد العشاء'),
          },
        ],
      },
    ],
  },
};
