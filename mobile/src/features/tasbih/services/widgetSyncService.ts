import { NativeModules, Platform } from 'react-native';

import { setString } from '@/core/storage/mmkv';

import { FATIMA_ZAHRA_PHASES } from '../constants/fatimaZahra';
import type { TasbihWidgetSnapshot } from '../types';

export const TASBIH_WIDGET_STORAGE_KEY = 'widget.tasbih.snapshot';

const { TasbihWidgetModule } = NativeModules;

export function syncTasbihWidget(snapshot: TasbihWidgetSnapshot): void {
  const json = JSON.stringify(snapshot);
  setString(TASBIH_WIDGET_STORAGE_KEY, json);

  if (Platform.OS === 'android' && TasbihWidgetModule?.updateWidget) {
    TasbihWidgetModule.updateWidget(json);
  }
}

export function buildWidgetSnapshot(params: {
  todayTotal: number;
  dailyGoalCycles: number;
  streak: number;
  phaseIndex: number;
  phaseCount: number;
  cyclesToday: number;
  cycleTotal: number;
}): TasbihWidgetSnapshot {
  const phase = FATIMA_ZAHRA_PHASES[params.phaseIndex] ?? FATIMA_ZAHRA_PHASES[0]!;
  const dailyGoalTotal = params.dailyGoalCycles * params.cycleTotal;

  return {
    todayTotal: params.todayTotal,
    dailyGoalTotal,
    goalProgress: Math.min(1, params.todayTotal / dailyGoalTotal),
    streak: params.streak,
    phaseLabel: phase.labels.en,
    phaseCount: params.phaseCount,
    phaseTarget: phase.target,
    cyclesToday: params.cyclesToday,
    updatedAt: new Date().toISOString(),
  };
}
