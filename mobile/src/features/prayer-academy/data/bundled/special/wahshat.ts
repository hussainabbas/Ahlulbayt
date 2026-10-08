import { getCatalogMeta } from '../../../constants/catalog';
import type { PrayerAcademyBundle } from '../../../types';
import { COMMON_CONDITIONS, L, twoRakatWajibSteps } from '../../shared/contentHelpers';
import {
  WAHSHAT_R1_RECITATION_ARABIC,
  WAHSHAT_R2_RECITATION_ARABIC,
} from '../../shared/recitationTexts';

const meta = getCatalogMeta('namaz_e_wahshat');

export const NAMAZ_E_WAHSHAT: PrayerAcademyBundle = {
  meta,
  bundleVersion: 1,
  rakatStructure: [
    {
      id: 'mustahab',
      kind: 'mustahab',
      count: 2,
      label: L('Two rakats', 'دو رکعت', 'ركعتان'),
    },
  ],
  timingRules: [
    {
      id: 'first_night',
      title: L('First night after burial', 'دفن کی پہلی رات', 'أول ليلة بعد الدفن'),
      body: L(
        'Perform on the first night after the deceased is buried — highly emphasized in Shi\'a tradition.',
        'دفن کی پہلی رات — شیا روایات میں بہت تأکید۔',
        'في أول ليلة بعد الدفن — مؤكد في التراث الشيعي.',
      ),
    },
  ],
  conditions: COMMON_CONDITIONS,
  steps: {
    beginner: [
      {
        id: 'intro',
        kind: 'intro',
        titles: L('Purpose', 'مقصد', 'الغرض'),
        body: L(
          'Eases the loneliness (wahshat) of the grave for the believer. Can be performed by family or anyone on behalf of the deceased.',
          'قبر کی وحشت دور کرنے کے لیے۔ گھر والے یا کوئی بھی میّت کی طرف سے۔',
          'لرفع وحشة القبر. يؤديها الأهل أو غيرهم عن الميت.',
        ),
        fiqhRefs: [
          {
            source: L('From Imam Ja\'far al-Sadiq (as)', 'امام جعفر صادقؑ سے', 'عن الإمام جعفر الصادق (ع)'),
            citation: L('Recommendation for first night', 'پہلی رات کی سفارش', 'في ليلة الدفن'),
          },
        ],
      },
      {
        id: 'r1',
        kind: 'recitation',
        rakatIndex: 1,
        titles: L('1st rakat — Ayat al-Kursi', 'پہلی — آیت الکرسی', 'الأولى — آية الكرسي'),
        body: L('After al-Hamd, recite Ayat al-Kursi (2:255) once, then complete rakat.', 'الحمد کے بعد آیت الکرسی (۲:۲۵۵) ایک بار۔', 'بعد الفاتحة آية الكرسي مرة.'),
        arabic: WAHSHAT_R1_RECITATION_ARABIC,
      },
      {
        id: 'r2',
        kind: 'recitation',
        rakatIndex: 2,
        titles: L('2nd rakat — Surahs', 'دوسری — سورتیں', 'الثانية — السور'),
        body: L(
          'After al-Hamd: Surah al-Qadr 3×, al-Falaq 1×, al-Nas 1×. After prayer, recite specific dua for the deceased.',
          'الحمد کے بعد: قدر ۳×، فلق ۱×، ناس ۱×۔ نماز بعد میّت کی دعا۔',
          'بعد الفاتحة: القدر ٣×، الفلق ١×، الناس ١×. ثم دعاء للميت.',
        ),
        arabic: WAHSHAT_R2_RECITATION_ARABIC,
      },
      ...twoRakatWajibSteps(meta.titles, false).filter(
        (s) => !['r1_recite', 'r2_recite', 'prep', 'niyyah'].includes(s.id),
      ),
    ],
    advanced: twoRakatWajibSteps(meta.titles, false),
  },
};
