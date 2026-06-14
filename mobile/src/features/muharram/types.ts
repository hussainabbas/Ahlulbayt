import type { DuaId } from '@/features/dua/types';
import type { ZiyaratId } from '@/features/ziyarat/types';

export interface MuharramDayContent {
  day: number;
  karbalaEventKey: string;
  karbalaDetailKey: string;
  majlisTitleKey: string;
  majlisBodyKey: string;
  majlisThemeKey: string;
  amalTitleKey: string;
  amalBodyKey: string;
  amalStepsKey: string;
  duaId?: DuaId;
  ziyaratId: ZiyaratId;
}

export type MuharramModeState = 'auto' | 'on' | 'off';
