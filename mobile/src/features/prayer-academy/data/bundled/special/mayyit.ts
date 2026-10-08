import { getCatalogMeta } from '../../../constants/catalog';
import type { PrayerAcademyBundle } from '../../../types';
import { COMMON_CONDITIONS, L } from '../../shared/contentHelpers';

const meta = getCatalogMeta('namaz_e_mayyit');

export const NAMAZ_E_MAYYIT: PrayerAcademyBundle = {
  meta,
  bundleVersion: 1,
  rakatStructure: [
    {
      id: 'standing',
      kind: 'wajib',
      count: 1,
      label: L('Standing prayer (no ruku)', 'کھڑی نماز (بلا رکوع)', 'صلاة قائمة بلا ركوع'),
      notes: L('Five takbirs', 'پانچ تکبیریں', 'خمس تكبيرات'),
    },
  ],
  timingRules: [
    {
      id: 'when',
      title: L('When to pray', 'کب پڑھیں', 'متى تُصلى'),
      body: L(
        'After ghusl mayyit and before burial if possible. Wajib al-kifai: if some Muslims perform it, others are relieved.',
        'غسل میّت کے بعد، ترجیحاً دفن سے پہلے۔ واجب کفائی: کچھ مسلمان ادا کریں تو بقیہ سے ساقط۔',
        'بعد غسل الميت وقبل الدفن إن أمكن. واجبة كفائية.',
      ),
    },
  ],
  conditions: [
    ...COMMON_CONDITIONS.filter((c) => c.id !== 'qibla'),
    {
      id: 'qibla_optional',
      title: L('Qibla when possible', 'جہاں ممکن قبلہ', 'القبلة حيث أمكن'),
      body: L(
        'Face Qibla if body can be placed accordingly; otherwise any direction.',
        'اگر میّت قبلہ رukh رکھ سکے تو رکھیں؛ ورنہ کسی طرف۔',
        'استقبل القبلة إن أمكن وضع الميت؛ وإلا أي جهة.',
      ),
    },
    {
      id: 'ghusl_first',
      title: L('Ghusl mayyit first', 'پہلے غسل میّت', 'غسل الميت أولاً'),
      body: L('Deceased must receive Islamic ghusl before burial and funeral prayer.', 'دفن و نماز سے پہلے شرعی غسل میّت واجب۔', 'يجب غسل الميت قبل الدفن والصلاة.'),
    },
  ],
  sunniDifferences: [
    {
      topic: L('Structure', 'ڈھانچہ', 'البنية'),
      jafari: L('Five takbirs with specific duas; no ruku or sujud.', 'پانچ تکبیریں مخصوص دعاؤں کے ساتھ؛ بلا رکوع و سجود۔', 'خمس تكبيرات بأدعية؛ بلا ركوع وسجود.'),
      sunni: L('Four takbirs in common Hanafi practice.', 'حنفی طریقے میں عام طور پر چار تکبیریں۔', 'أربع تكبيرات في الحنفية.'),
    },
  ],
  steps: {
    beginner: [
      {
        id: 'prep',
        kind: 'preparation',
        titles: L('Stand before the deceased', 'میّت کے سامنے کھڑے ہوں', 'قف أمام الميت'),
        body: L(
          'Stand facing Qibla with deceased between you and Qibla (within ~6 feet). Form niyyah of Namaz-e-Mayyit.',
          'قبلہ رukh، میّت آپ اور قبلہ کے درمیان (~۶ فٹ)۔ نماز میّت کی نیت۔',
          'استقبل القبلة والميت بينك وبين القبلة. انوِ صلاة الميت.',
        ),
      },
      {
        id: 't1',
        kind: 'takbir',
        titles: L('1st Takbir — Surah al-Hamd', 'پہلی تکبیر — الحمد', 'التكبيرة الأولى — الفاتحة'),
        body: L('Say Allahu Akbar, recite al-Hamd.', 'اللہ اکبر، الحمد پڑھیں۔', 'كبّر واقرأ الفاتحة.'),
        arabic: 'اللّٰهُ أَكْبَرُ',
      },
      {
        id: 't2',
        kind: 'takbir',
        titles: L('2nd Takbir — Shahadatayn', 'دوسری تکبیر — شہادتین', 'الثانية — الشهادتان'),
        body: L('Takbir, then Shahadatayn and salawat on Prophet (s) and Ahlul Bayt (as).', 'تکبیر، پھر شہادتین و درود۔', 'كبّر ثم الشهادتان والصلوات.'),
      },
      {
        id: 't3',
        kind: 'takbir',
        titles: L('3rd Takbir — Dua for believers', 'تیسری — مومنین کی دعا', 'الثالثة — دعاء المؤمنين'),
        body: L('Takbir, then dua for all believers and the deceased.', 'تکبیر، پھر مومنین و میّت کی دعا۔', 'كبّر ثم ادعُ للمؤمنين والميت.'),
      },
      {
        id: 't4',
        kind: 'takbir',
        titles: L('4th Takbir — Dua for deceased', 'چوتھی — میّت کی دعا', 'الرابعة — دعاء للميت'),
        body: L('Takbir, then specific dua for forgiveness of the deceased.', 'تکبیر، پھر میّت کے مغفرت کی دعا۔', 'كبّر ثم ادعُ لمغفرة الميت.'),
      },
      {
        id: 't5',
        kind: 'salam',
        titles: L('5th Takbir & end', 'پanchویں تکبیر و ختم', 'الخامسة والإنهاء'),
        body: L('Final takbir, brief pause, then end (no salam required in same form as daily prayer).', 'آخری تکبیر، مختصر وقفہ، پھر ختم۔', 'تكبيرة أخيرة ثم ينتهي.'),
      },
    ],
    advanced: [],
  },
};
