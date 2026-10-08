import { getEventsForDay } from '@/features/calendar/engine/calendarEngine';
import type { HijriParts } from '@/features/calendar/engine/hijriUtils';

import type { IslamicEventContext, IslamicSeason } from './types';

const SEASON_LABEL_KEYS: Record<IslamicSeason, string> = {
  muharram: 'islamicEvents.seasons.muharram',
  safar: 'islamicEvents.seasons.safar',
  arbaeen: 'islamicEvents.seasons.arbaeen',
  ramadan: 'islamicEvents.seasons.ramadan',
  laylat_al_qadr: 'islamicEvents.seasons.laylatAlQadr',
  eid_fitr: 'islamicEvents.seasons.eidFitr',
  eid_adha: 'islamicEvents.seasons.eidAdha',
  eid_ghadeer: 'islamicEvents.seasons.eidGhadeer',
  mubahila: 'islamicEvents.seasons.mubahila',
  general: 'islamicEvents.seasons.general',
};

function isRamadanMonth(month: number): boolean {
  return month === 9;
}

function isLaylatAlQadrWindow(month: number, day: number): boolean {
  return month === 9 && day >= 19 && day <= 27;
}

function isEidFitr(month: number, day: number): boolean {
  return month === 10 && day === 1;
}

function isEidAdha(month: number, day: number): boolean {
  return month === 12 && day === 10;
}

function isGhadeerDay(month: number, day: number): boolean {
  return month === 12 && day === 18;
}

function isMubahilaDay(month: number, day: number): boolean {
  return month === 12 && day === 24;
}

function isArbaeenDay(month: number, day: number): boolean {
  return month === 2 && day === 20;
}

function isSafarArbaeenPeriod(month: number, day: number): boolean {
  return month === 2 && day >= 1 && day <= 20;
}

export function resolveIslamicSeason(hijri: HijriParts): IslamicSeason {
  const { month, day } = hijri;

  if (month === 1) return 'muharram';
  if (isArbaeenDay(month, day)) return 'arbaeen';
  if (month === 2 && isSafarArbaeenPeriod(month, day)) return 'safar';
  if (isLaylatAlQadrWindow(month, day)) return 'laylat_al_qadr';
  if (isRamadanMonth(month)) return 'ramadan';
  if (isEidFitr(month, day)) return 'eid_fitr';
  if (isEidAdha(month, day)) return 'eid_adha';
  if (isGhadeerDay(month, day)) return 'eid_ghadeer';
  if (isMubahilaDay(month, day)) return 'mubahila';
  if (month === 2) return 'safar';

  return 'general';
}

export function buildIslamicContext(hijri: HijriParts): IslamicEventContext {
  const season = resolveIslamicSeason(hijri);
  const todayEvents = getEventsForDay(hijri.month, hijri.day);

  return {
    season,
    hijriMonth: hijri.month,
    hijriDay: hijri.day,
    hijriYear: hijri.year,
    seasonLabelKey: SEASON_LABEL_KEYS[season],
    isMuharram: hijri.month === 1,
    isSafar: hijri.month === 2,
    isRamadan: hijri.month === 9,
    isAshuraPeriod: hijri.month === 1 && hijri.day <= 10,
    isArbaeenPeriod: hijri.month === 2 && hijri.day <= 20,
    isLaylatAlQadrWindow: isLaylatAlQadrWindow(hijri.month, hijri.day),
    activeEventIds: todayEvents.map((e) => e.id),
  };
}
