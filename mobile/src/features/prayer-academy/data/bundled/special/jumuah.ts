import { getCatalogMeta } from '../../../constants/catalog';
import type { PrayerAcademyBundle } from '../../../types';
import { COMMON_CONDITIONS, L, twoRakatWajibSteps } from '../../shared/contentHelpers';

const meta = getCatalogMeta('salat_jumuah');

export const SALAT_JUMUAH: PrayerAcademyBundle = {
  meta,
  bundleVersion: 1,
  rakatStructure: [
    {
      id: 'wajib',
      kind: 'wajib',
      count: 2,
      label: L('Jumu\'ah (replaces Dhuhr)', 'جمعہ (ظہر کی جگہ)', 'الجمعة (مقام الظهر)'),
    },
  ],
  timingRules: [
    {
      id: 'friday_dhuhr',
      title: L('Friday at Dhuhr time', 'جمعہ ظہر کے وقت', 'يوم الجمعة وقت الظهر'),
      body: L('Performed at Dhuhr time on Friday when all conditions are met.', 'جمعہ کو ظہر کے وقت جب شرائط پوری ہوں۔', 'يوم الجمعة وقت الظهر عند توفر الشروط.'),
    },
  ],
  conditions: [
    ...COMMON_CONDITIONS,
    {
      id: 'conditions_list',
      title: L('Who must attend', 'کس پر واجب', 'من تجب عليه'),
      body: L(
        'Adult male, sane, free, not travelling, not ill — when community gathers with just Imam, adhan/iqamah, and khutba in Arabic.',
        'بالغ مرد، عاقل، آزاد، مسافر/مریض نہیں — جماعت، امام، اذان/اقامہ، عربی خطبہ۔',
        'البالغ العاقل الحر غير المسافر والمريض — مع الجماعة والإمام والأذان والخطبة.',
      ),
    },
  ],
  sunniDifferences: [
    {
      topic: L('Obligation', 'وجوب', 'الوجوب'),
      jafari: L(
        'Jumu\'ah is wajib for eligible men when conditions met; otherwise Dhuhr is prayed.',
        'شرائط پوری ہوں تو مردوں پر واجب؛ ورنہ ظہر۔',
        'واجبة للرجال المستوفين؛ وإلا يصلون الظهر.',
      ),
    },
  ],
  steps: {
    beginner: [
      {
        id: 'before',
        kind: 'preparation',
        titles: L('Adhan & Iqamah', 'اذان و اقامہ', 'الأذان والإقامة'),
        body: L('Jumu\'ah is preceded by adhan and iqamah (unlike Eid).', 'جمعہ سے پہلے اذان و اقامہ (عید برعکس)۔', 'يسبقها الأذان والإقامة.'),
      },
      ...twoRakatWajibSteps(meta.titles, false),
      {
        id: 'khutba',
        kind: 'fiqh_note',
        titles: L('Khutba — required', 'خطبہ — ضروری', 'الخطبة — شرط'),
        body: L(
          'Two khutbas in Arabic before or after prayer per marja; congregation must listen.',
          'دو خطبے عربی میں؛ جماعت کو سننا ضروری۔',
          'خطبتان بالعربية؛ على الجماعة الاستماع.',
        ),
      },
    ],
    advanced: twoRakatWajibSteps(meta.titles, false),
  },
};
