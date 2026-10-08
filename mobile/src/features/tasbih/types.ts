export type TasbihMode = 'fatima_zahra' | 'free';

export type TasbihPhaseId = 'subhanallah' | 'alhamdulillah' | 'allahu_akbar';

export interface TasbihPhase {
  id: TasbihPhaseId;
  target: number;
  arabic: string;
  transliteration: string;
  labels: { en: string; ur: string; ar: string };
}

export interface TasbihDailyRecord {
  date: string;
  subhanallah: number;
  alhamdulillah: number;
  allahuAkbar: number;
  total: number;
  cycles: number;
  goalMet: boolean;
}

export interface TasbihAnalyticsSummary {
  todayTotal: number;
  todayCycles: number;
  goalProgress: number;
  goalMet: boolean;
  currentStreak: number;
  longestStreak: number;
  last7Days: TasbihDailyRecord[];
  last30DaysTotal: number;
  averageDaily7: number;
  byDhikr: {
    subhanallah: number;
    alhamdulillah: number;
    allahuAkbar: number;
  };
}

export interface TasbihWidgetSnapshot {
  todayTotal: number;
  dailyGoalTotal: number;
  goalProgress: number;
  streak: number;
  phaseLabel: string;
  phaseCount: number;
  phaseTarget: number;
  cyclesToday: number;
  updatedAt: string;
}

export interface TasbihSessionState {
  mode: TasbihMode;
  phaseIndex: number;
  phaseCount: number;
  freeCount: number;
}
