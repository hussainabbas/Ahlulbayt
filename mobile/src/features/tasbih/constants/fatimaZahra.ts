import type { TasbihPhase } from '../types';

/** Tasbih Fatima Zahra (AS): 34 + 33 + 33 = 100 */
export const FATIMA_ZAHRA_PHASES: TasbihPhase[] = [
  {
    id: 'subhanallah',
    target: 34,
    arabic: 'سُبْحَانَ اللّٰهِ',
    transliteration: 'Subḥān Allāh',
    labels: {
      en: 'Glory be to Allah',
      ur: 'اللہ پاک ہے',
      ar: 'سبحان الله',
    },
  },
  {
    id: 'alhamdulillah',
    target: 33,
    arabic: 'الْحَمْدُ لِلّٰهِ',
    transliteration: 'Al-ḥamdulillāh',
    labels: {
      en: 'Praise be to Allah',
      ur: 'تمام تعریفیں اللہ کے لیے',
      ar: 'الحمد لله',
    },
  },
  {
    id: 'allahu_akbar',
    target: 33,
    arabic: 'اللّٰهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    labels: {
      en: 'Allah is the Greatest',
      ur: 'اللہ سب سے بڑا ہے',
      ar: 'الله أكبر',
    },
  },
];

export const CYCLE_TOTAL = FATIMA_ZAHRA_PHASES.reduce((sum, p) => sum + p.target, 0);

export const DEFAULT_DAILY_GOAL_CYCLES = 1;

export const GOAL_CYCLE_OPTIONS = [1, 2, 3, 5, 10] as const;
