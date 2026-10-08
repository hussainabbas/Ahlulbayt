import type { FidyaInput, FidyaResult } from '../types';
import { FIDYA_CITATIONS, FIDYA_DEFAULT_GRAMS_PER_DAY } from '../data/jafariRulings';

/**
 * Fidya for those permanently unable to fast (elderly, chronic illness).
 * Per general Jafari guidance: ~750g staple food per missed day to a poor person.
 */
export function calculateFidya(input: FidyaInput): FidyaResult {
  const missedDays = Math.max(0, Math.floor(input.missedDays));
  const perDayGrams = input.gramsPerDay ?? FIDYA_DEFAULT_GRAMS_PER_DAY;
  const totalGrams = missedDays * perDayGrams;
  const totalKg = Math.round((totalGrams / 1000) * 100) / 100;

  return {
    missedDays,
    perDayGrams,
    totalGrams,
    totalKg,
    summaryKey: 'fasting.fidya.resultSummary',
    detailKey: 'fasting.fidya.resultDetail',
    citations: FIDYA_CITATIONS,
    disclaimerKey: 'fasting.calculators.disclaimer',
    consultMarja: true,
  };
}
