import type { PrayerGuideStep } from '../types';

/** Short cues only in the pose card — full Arabic stays in the step block below. */
export function getAvatarSubtitle(step: PrayerGuideStep): string | null {
  if (step.kind === 'recitation') return null;
  return step.arabic ?? null;
}
