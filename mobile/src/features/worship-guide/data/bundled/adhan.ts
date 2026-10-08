import { getCatalogMeta } from '../../constants/catalog';
import type { WorshipGuideBundle, WorshipGuideStep } from '../../types';
import type { AdhanRecitation } from '../shared/adhanRecitations';
import {
  ADHAN_ALLAHU_AKBAR,
  ADHAN_FALAH,
  ADHAN_KHAIR,
  ADHAN_LA_ILAHA,
  ADHAN_RASUL,
  ADHAN_SALAH,
  ADHAN_SHAHADA,
  ADHAN_WALI,
} from '../shared/adhanRecitations';
import { E } from '../shared/englishText';
import { L, step } from '../shared/taharahHelpers';

function phrase(id: string, count: number, r: AdhanRecitation): WorshipGuideStep {
  return step({
    id,
    kind: 'fiqh_note',
    title: L(
      `${r.transliteration.en} (×${count})`,
      `${r.transliteration.ur} (×${count})`,
      `${r.transliteration.ar} (×${count})`,
    ),
    body: r.translation,
    arabicText: r.arabicText,
    transliteration: r.transliteration,
    translation: r.translation,
  });
}

const ADHAN_STEPS: WorshipGuideStep[] = [
  step({
    id: 'adhan_intro',
    kind: 'intro',
    title: E('Adhan — Call to Prayer', 'اذان — نماز کی دعوت', 'الأذان — دعوة إلى الصلاة'),
    body: E(
      'Stand facing the Qiblah and recite the Adhan before Salaah. Counts shown as (×4) or (×2).',
      'قبلہ رخ ہو کر نماز سے پہلے اذان پڑھیں۔ تعداد (×4) یا (×2) کے طور پر دکھائی گئی ہے۔',
      'قف مستقبلاً القبلة واقرأ الأذان قبل الصلاة. العدد موضح بـ (×4) أو (×2).',
    ),
    isRequired: false,
    citations: [{ source: 'ShiaSalaah.org', verified: true }],
  }),
  phrase('adhan_1', 4, ADHAN_ALLAHU_AKBAR),
  phrase('adhan_2', 2, ADHAN_SHAHADA),
  phrase('adhan_3', 2, ADHAN_RASUL),
  phrase('adhan_4', 2, ADHAN_WALI),
  phrase('adhan_5', 2, ADHAN_SALAH),
  phrase('adhan_6', 2, ADHAN_FALAH),
  phrase('adhan_7', 2, ADHAN_KHAIR),
  phrase('adhan_8', 2, ADHAN_ALLAHU_AKBAR),
  phrase('adhan_9', 2, ADHAN_LA_ILAHA),
  step({
    id: 'adhan_complete',
    kind: 'completion',
    title: E('Adhan complete', 'اذان مکمل', 'اكتمل الأذان'),
    body: E(
      'You may recite Dua after Adhan, then proceed to Iqama when ready to begin Salaah.',
      'اذان کے بعد دعا پڑھ سکتے ہیں، پھر نماز شروع کرنے کے لیے اقامہ پڑھیں۔',
      'يمكنك قراءة دعاء بعد الأذان، ثم الإقامة عند الاستعداد لبدء الصلاة.',
    ),
    isRequired: false,
  }),
];

export const ADHAN_GUIDE: WorshipGuideBundle = {
  meta: getCatalogMeta('adhan_guide'),
  bundleVersion: 2,
  steps: {
    beginner: ADHAN_STEPS,
    standard: ADHAN_STEPS,
    scholar: ADHAN_STEPS,
  },
};
