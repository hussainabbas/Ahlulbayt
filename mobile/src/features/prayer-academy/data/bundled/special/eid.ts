import { getCatalogMeta } from '../../../constants/catalog';
import type { PrayerAcademyBundle, PrayerAcademyId } from '../../../types';
import { COMMON_CONDITIONS, L } from '../../shared/contentHelpers';

function eidBundle(id: PrayerAcademyId): PrayerAcademyBundle {
  const meta = getCatalogMeta(id);
  return {
    meta,
    bundleVersion: 1,
    rakatStructure: [
      {
        id: 'wajib',
        kind: 'wajib',
        count: 2,
        label: L('Eid prayer', 'عید کی نماز', 'صلاة العيد'),
      },
    ],
    timingRules: [
      {
        id: 'time',
        title: L('Time', 'وقت', 'الوقت'),
        body: L(
          'After sunrise when sun has risen sufficiently (≈ when shadow equals object length). Before zawal.',
          'طلوع آفتاب کے بعد جب سایہ برابر ہو۔ زوال سے پہلے۔',
          'بعد طلوع الشمس بمقدار يساوي ظل الشيء. قبل الزوال.',
        ),
      },
      {
        id: 'no_adhan',
        title: L('No adhan/iqamah', 'اذان/اقامہ نہیں', 'بلا أذان وإقامة'),
        body: L('Eid prayer is performed without adhan and iqamah.', 'عید کی نماز بغیر اذان و اقامہ۔', 'تُصلى بلا أذان وإقامة.'),
      },
    ],
    conditions: COMMON_CONDITIONS,
    sunniDifferences: [
      {
        topic: L('Extra takbirs', 'اضافی تکبیریں', 'التكبيرات الزائدة'),
        jafari: L('5 takbirs in 1st rakat (after al-Hamd + surah), 4 in 2nd before al-Hamd.', 'پہلی میں ۵ (الحمد+سورت بعد)، دوسری میں ۴ الحمد سے پہلے۔', '٥ في الأولى بعد الفاتحة، ٤ في الثانية قبل الفاتحة.'),
        sunni: L('Varies by school; often different takbir counts.', 'مذہب کے مطابق فرق۔', 'تختلف بحسب المذهب.'),
      },
    ],
    steps: {
      beginner: [
        {
          id: 'niyyah',
          kind: 'niyyah',
          titles: L('Intention', 'نیت', 'النية'),
          body: L(`Intend ${meta.titles.en} — 2 rakats wajib.`, `نیت: ${meta.titles.ur} — ۲ واجب رکعت۔`, `انوِ ${meta.titles.ar} — ركعتان.`),
        },
        {
          id: 'r1_takbirs',
          kind: 'takbir',
          rakatIndex: 1,
          titles: L('1st rakat — 5 takbirs', 'پہلی — ۵ تکبیر', 'الأولى — ٥ تكبيرات'),
          body: L(
            'Takbiratul Ehram, al-Hamd + surah, then 4 additional takbirs (5 total) before ruku.',
            'تکبیرہ، الحمد+سورت، پھر ۴ مزید تکبیر (کل ۵) قبل رکوع۔',
            'تكبيرة الإحرام، الفاتحة وسورة، ثم ٤ تكبيرات قبل الركوع.',
          ),
        },
        {
          id: 'r1_complete',
          kind: 'ruku',
          rakatIndex: 1,
          titles: L('Complete 1st rakat', 'پہلی مکمل', 'إتمام الأولى'),
          body: L('Ruku, two sujud, stand for 2nd rakat without salam.', 'رکوع، دو سجدے، بغیر سلام دوسری کے لیے کھڑے۔', 'اركع واسجد وقم للثانية.'),
        },
        {
          id: 'r2_takbirs',
          kind: 'takbir',
          rakatIndex: 2,
          titles: L('2nd rakat — 4 takbirs before al-Hamd', 'دوسری — ۴ تکبیر قبل الحمد', 'الثانية — ٤ تكبيرات'),
          body: L('4 takbirs, then al-Hamd + surah, ruku, sujud, tashahhud, salam.', '۴ تکبیر، الحمد+سورت، رکوع، سجدے، تشہد، سلام۔', '٤ تكبيرات ثم الفاتحة والركوع والسلام.'),
        },
        {
          id: 'khutba',
          kind: 'fiqh_note',
          titles: L('Khutba after prayer', 'نماز بعد خطبہ', 'الخطبة بعد الصلاة'),
          body: L('Two sermons after Eid prayer are sunnah/mustahab.', 'عید نماز کے بعد دو خطبے مستحب۔', 'خطبتان بعد صلاة العيد مستحبتان.'),
        },
      ],
      advanced: [],
    },
  };
}

export const SALAT_EID_FITR = eidBundle('salat_eid_fitr');
export const SALAT_EID_ADHA = eidBundle('salat_eid_adha');
