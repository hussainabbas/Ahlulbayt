import type { ColorScheme } from '@/theme/colors';

import type { TajweedRule } from '../types';

/** Madani Mushaf inspired tajweed palette. */
export const TAJWEED_COLORS: Record<TajweedRule, { light: string; dark: string }> = {
  default: { light: '#1A1A18', dark: '#F2F0EB' },
  ham_wasl: { light: '#8A877F', dark: '#9B9890' },
  slnt: { light: '#8A877F', dark: '#6B6860' },
  laam_shamsiyah: { light: '#8A877F', dark: '#9B9890' },
  madda_normal: { light: '#B45309', dark: '#F59E0B' },
  madda_permissible: { light: '#C2410C', dark: '#FB923C' },
  madda_necessary: { light: '#DC2626', dark: '#F87171' },
  madda_obligatory: { light: '#DC2626', dark: '#EF4444' },
  qalaqah: { light: '#2563EB', dark: '#60A5FA' },
  ghunnah: { light: '#059669', dark: '#34D399' },
  ikhfa: { light: '#7C3AED', dark: '#A78BFA' },
  ikhfa_shafawi: { light: '#7C3AED', dark: '#A78BFA' },
  idgham_ghunnah: { light: '#059669', dark: '#34D399' },
  idgham_wo_ghunnah: { light: '#0891B2', dark: '#22D3EE' },
  idgham_shafawi: { light: '#0891B2', dark: '#22D3EE' },
  iqlab: { light: '#DB2777', dark: '#F472B6' },
};

export function getTajweedColor(rule: TajweedRule, scheme: ColorScheme): string {
  return TAJWEED_COLORS[rule][scheme];
}

export const TAJWEED_LEGEND: { rule: TajweedRule; labelKey: string }[] = [
  { rule: 'ghunnah', labelKey: 'quran.tajweed.ghunnah' },
  { rule: 'qalaqah', labelKey: 'quran.tajweed.qalaqah' },
  { rule: 'madda_normal', labelKey: 'quran.tajweed.madd' },
  { rule: 'ikhfa', labelKey: 'quran.tajweed.ikhfa' },
  { rule: 'idgham_ghunnah', labelKey: 'quran.tajweed.idgham' },
  { rule: 'iqlab', labelKey: 'quran.tajweed.iqlab' },
];
