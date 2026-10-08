import { getCatalogMeta } from '../../constants/catalog';
import type { WorshipGuideBundle, WorshipGuideStep } from '../../types';
import {
  ADHAN_ALLAHU_AKBAR,
  ADHAN_FALAH,
  ADHAN_KHAIR,
  ADHAN_LA_ILAHA,
  ADHAN_RASUL,
  ADHAN_SALAH,
  ADHAN_SHAHADA,
  ADHAN_WALI,
  IQAMA_QAD_QAMAT,
} from '../shared/adhanRecitations';
import { E } from '../shared/englishText';
import { L, step } from '../shared/taharahHelpers';

type AdhanRec = typeof ADHAN_ALLAHU_AKBAR;

function phrase(id: string, count: number, r: AdhanRec): WorshipGuideStep {
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

const IQAMA_STEPS: WorshipGuideStep[] = [
  step({
    id: 'iqama_intro',
    kind: 'intro',
    title: E('Iqama — Second Call to Prayer', 'اقامہ — دوسری دعوت', 'الإقامة — النداء الثاني'),
    body: E(
      'Recite the Iqama immediately before beginning the congregational or individual Salaah.',
      'جماعتی یا انفرادی نماز شروع کرنے سے فوراً پہلے اقامہ پڑھیں۔',
      'اقرأ الإقامة مباشرة قبل بدء الصلاة جماعة أو فرادى.',
    ),
    isRequired: false,
    citations: [{ source: 'ShiaSalaah.org', verified: true }],
  }),
  phrase('iqama_1', 2, ADHAN_ALLAHU_AKBAR),
  phrase('iqama_2', 2, ADHAN_SHAHADA),
  phrase('iqama_3', 2, ADHAN_RASUL),
  phrase('iqama_4', 2, ADHAN_WALI),
  phrase('iqama_5', 2, ADHAN_SALAH),
  phrase('iqama_6', 2, ADHAN_FALAH),
  phrase('iqama_7', 2, ADHAN_KHAIR),
  phrase('iqama_8', 2, IQAMA_QAD_QAMAT),
  phrase('iqama_9', 2, ADHAN_ALLAHU_AKBAR),
  phrase('iqama_10', 2, ADHAN_LA_ILAHA),
  step({
    id: 'iqama_complete',
    kind: 'completion',
    title: E('Begin Salaah', 'نماز شروع کریں', 'ابدأ الصلاة'),
    body: E(
      'After Iqama, make Niyyah and begin with Takbiratul Ihram.',
      'اقامہ کے بعد نیت کریں اور تکبیرۃ الاحرام سے شروع کریں۔',
      'بعد الإقامة انوِ وابدأ بالتكبير للإحرام.',
    ),
    isRequired: false,
  }),
];

export const IQAMA_GUIDE: WorshipGuideBundle = {
  meta: getCatalogMeta('iqama_guide'),
  bundleVersion: 2,
  steps: {
    beginner: IQAMA_STEPS,
    standard: IQAMA_STEPS,
    scholar: IQAMA_STEPS,
  },
};
