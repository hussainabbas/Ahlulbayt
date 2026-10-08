import { getCatalogMeta } from '../../../constants/catalog';
import type { PrayerAcademyBundle } from '../../../types';
import { COMMON_CONDITIONS, L, twoRakatWajibSteps } from '../../shared/contentHelpers';

const meta = getCatalogMeta('salat_ghufayla');

export const SALAT_GHUFAYLA: PrayerAcademyBundle = {
  meta,
  bundleVersion: 1,
  rakatStructure: [
    {
      id: 'mustahab',
      kind: 'mustahab',
      count: 2,
      label: L('Between Maghrib & Isha', 'مغرب و عشاء کے درمیان', 'بين المغrib والعشاء'),
    },
  ],
  timingRules: [
    {
      id: 'window',
      title: L('Time window', 'وقت', 'الوقت'),
      body: L(
        'After completing Maghrib wajib until Isha begins. One of the most emphasized short nafl prayers.',
        'واجب مغرب کے بعد سے عشاء شروع ہونے تک۔ نہایت مستحب مختصر نماز۔',
        'بعد المغrib الواجب حتى العشاء. من أنفع النوافل القصيرة.',
      ),
    },
  ],
  conditions: COMMON_CONDITIONS,
  steps: {
    beginner: [
      ...twoRakatWajibSteps(meta.titles, false).slice(0, 8),
      {
        id: 'dua_between_sujud',
        kind: 'recitation',
        rakatIndex: 2,
        titles: L('Du\'a Ghufayla', 'دعائے غفیلہ', 'دعاء الغفيلة'),
        body: L(
          'In 2nd rakat, after first sujud and before second, sit briefly and recite Du\'a Ghufayla, then second sujud.',
          'دوسری رکعت میں پہلے سجدے کے بعد، دوسرے سے پہلے بیٹھ کر دعائے غفیلہ، پھر دوسra سجدہ۔',
          'في الركعة الثانية بعد السجدة الأولى وقبل الثانية اقرأ دعاء الغفيلة.',
        ),
        fiqhRefs: [
          {
            source: L('Imam Ja\'far al-Sadiq (as)', 'امام جعفر صادقؑ', 'الإمام جعفر الصادق (ع)'),
            citation: L('On Ghufayla between the two sujud', 'دو سجدوں کے درمیان غفیلہ', 'في الغفيلة بين السجدتين'),
          },
        ],
      },
      ...twoRakatWajibSteps(meta.titles, false).slice(-2),
    ],
    advanced: twoRakatWajibSteps(meta.titles, false),
  },
};

const laylMeta = getCatalogMeta('salat_layl');

export const SALAT_LAYL: PrayerAcademyBundle = {
  meta: laylMeta,
  bundleVersion: 1,
  rakatStructure: [
    { id: 'nafil', kind: 'nafl', count: 8, label: L('Salat al-Layl', 'نماز شب', 'صلاة الليل') },
    { id: 'optional', kind: 'nafl', count: 2, label: L('Optional extra', 'اضافی', 'تطوع') },
    { id: 'witr', kind: 'witr', count: 1, label: L('Witr', 'وتر', 'الوتر') },
  ],
  timingRules: [
    {
      id: 'after_midnight',
      title: L('Best time', 'بہترین وقت', 'أفضل وقت'),
      body: L(
        'From midnight until Fajr; best in last third of night. Also called Tahajjud when after sleep.',
        'آدhi رات سے فجر تک؛ آخری تہائی بہترین۔ سونے کے بعد تہجد بھی کہتے ہیں۔',
        'من منتصف الليل إلى الفجر؛ أفضل الثلث الأخير.',
      ),
    },
  ],
  conditions: COMMON_CONDITIONS,
  steps: {
    beginner: [
      {
        id: 'structure',
        kind: 'intro',
        titles: L('Structure overview', 'ڈھانچہ', 'الهيكل'),
        body: L(
          '8 rakats in sets of 2 (each set: al-Hamd + surah, qunoot in 2nd of pair optional per set), then 2 optional, then 1 Witr with qunoot.',
          '۸ رکعت ۲۲ کےセット؛ پھر ۲ اختیاری، پھر ۱ وتر قنوت کے ساتھ۔',
          '٨ ركعات زوجين، ثم ٢ تطوع، ثم ركعة وتر.',
        ),
        checklist: [
          L('Perform wudu', 'وضو کریں', 'توضأ'),
          L('Pray 2×4 pairs of rakats', '۴ جوڑے ۲ رکعت', '٤ زوجين'),
          L('End with Witr', 'وتر سے ختم', 'اختم بالوتر'),
        ],
      },
      ...twoRakatWajibSteps(laylMeta.titles, true),
    ],
    advanced: twoRakatWajibSteps(laylMeta.titles, true),
  },
};

const istikharaMeta = getCatalogMeta('salat_istikhara');

export const SALAT_ISTIKHARA: PrayerAcademyBundle = {
  meta: istikharaMeta,
  bundleVersion: 1,
  rakatStructure: [
    { id: 'nafl', kind: 'nafl', count: 2, label: L('Istikhara', 'استخارہ', 'الاستخارة') },
  ],
  timingRules: [
    {
      id: 'anytime',
      title: L('When to pray', 'کب پڑھیں', 'متى'),
      body: L('Any time except makruh hours; often before sleep after the two rakats.', 'مکروہ اوقات کے سوا؛ اکثر سونے سے پہلے۔', 'في أي وقت غير المكروه؛ غالبًا قبل النوم.'),
    },
  ],
  conditions: COMMON_CONDITIONS,
  steps: {
    beginner: [
      ...twoRakatWajibSteps(istikharaMeta.titles, false),
      {
        id: 'dua',
        kind: 'recitation',
        titles: L('Dua Istikhara', 'دعائے استخارہ', 'دعاء الاستخارة'),
        body: L(
          'After salam, recite istikhara dua asking Allah to choose the best outcome. Trust in result through heart inclination or circumstances.',
          'سلام کے بعد دعائے استخارہ — اللہ سے بہتر انتخاب مانگیں۔ دل کی مائلidad یا حالات پر توکل۔',
          'بعد السلام ادعُ بدعاء الاستخارة وتوكل على الله.',
        ),
        fiqhRefs: [
          {
            source: L('Imam Ja\'far al-Sadiq (as)', 'امام جعفر صادقؑ', 'الإمام جعفر الصادق (ع)'),
            citation: L('Method of istikhara', 'استخارہ کا طریقہ', 'كيفية الاستخارة'),
          },
        ],
      },
    ],
    advanced: twoRakatWajibSteps(istikharaMeta.titles, false),
  },
};

const naflMeta = getCatalogMeta('nafl_recommended');

export const NAFL_RECOMMENDED: PrayerAcademyBundle = {
  meta: naflMeta,
  bundleVersion: 1,
  rakatStructure: [
    { id: 'before_dhuhr', kind: 'mustahab', count: 4, label: L('Before Dhuhr', 'ظہر سے پہلے', 'قبل الظهر') },
    { id: 'after_dhuhr', kind: 'mustahab', count: 2, label: L('After Dhuhr', 'ظہر بعد', 'بعد الظهر') },
    { id: 'after_maghrib', kind: 'mustahab', count: 2, label: L('After Maghrib', 'مغرب بعد', 'بعد المغrib') },
    { id: 'after_isha_shaf', kind: 'nafl', count: 2, label: L('Shaf\' after Isha', 'شفع', 'الشفع') },
    { id: 'after_isha_witr', kind: 'witr', count: 1, label: L('Witr', 'وتر', 'الوتر') },
  ],
  timingRules: [
    {
      id: 'attached',
      title: L('Attached to daily prayers', 'واجب نمازوں سے منسلک', 'ملحقة بالصلوات'),
      body: L('These nafl prayers are performed near their related wajib salat times.', 'یہ نفل متعلقہ واجب نماز کے قریب۔', 'تُؤدى قرب صلاتها الواجبة.'),
    },
  ],
  conditions: COMMON_CONDITIONS,
  steps: {
    beginner: [
      {
        id: 'overview',
        kind: 'checklist',
        titles: L('Daily mustahab map', 'روزانہ مستحب', 'خريطة المستحبات'),
        body: L('Use this as a daily checklist alongside wajib prayers.', 'واجب نمازوں کے ساتھ چیک لسٹ۔', 'استخدمها كقائمة مع الصلوات الواجبة.'),
        checklist: [
          L('4 rakats before Dhuhr', 'ظہر سے پہلے ۴', '٤ قبل الظهر'),
          L('2 rakats after Dhuhr', 'ظہر بعد ۲', '٢ بعد الظهر'),
          L('2 rakats after Maghrib', 'مغرب بعد ۲', '٢ بعد المغrib'),
          L('2 Shaf\' + 1 Witr after Isha', 'عشاء بعد شفع+وتر', 'شفع ووتر بعد العشاء'),
          L('Salat al-Ghufayla between Maghrib & Isha', 'غفیلہ', 'الغفيلة'),
        ],
      },
    ],
    advanced: [],
  },
};
