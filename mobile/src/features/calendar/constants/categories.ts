import type { CalendarEventCategory } from '../types';

export const CATEGORY_COLORS: Record<CalendarEventCategory, string> = {
  wiladat: '#3D9B8A',
  shahadat: '#8B3A3A',
  muharram: '#A04545',
  arbaeen: '#6B4E9B',
  ghadeer: '#C4A962',
  mubahila: '#4A6FA5',
};

export const CATEGORY_ORDER: Array<CalendarEventCategory | 'all'> = [
  'all',
  'muharram',
  'wiladat',
  'shahadat',
  'arbaeen',
  'ghadeer',
  'mubahila',
];

export const FILTER_TABS: Array<{ id: CalendarEventCategory | 'all'; labelKey: string }> = [
  { id: 'all', labelKey: 'calendar.filterAll' },
  { id: 'muharram', labelKey: 'calendar.categories.muharram' },
  { id: 'wiladat', labelKey: 'calendar.categories.wiladat' },
  { id: 'shahadat', labelKey: 'calendar.categories.shahadat' },
  { id: 'arbaeen', labelKey: 'calendar.categories.arbaeen' },
  { id: 'ghadeer', labelKey: 'calendar.categories.ghadeer' },
  { id: 'mubahila', labelKey: 'calendar.categories.mubahila' },
];

export const HIJRI_MONTH_KEYS = [
  'calendar.months.muharram',
  'calendar.months.safar',
  'calendar.months.rabi1',
  'calendar.months.rabi2',
  'calendar.months.jumada1',
  'calendar.months.jumada2',
  'calendar.months.rajab',
  'calendar.months.shaban',
  'calendar.months.ramadan',
  'calendar.months.shawwal',
  'calendar.months.dhulqadah',
  'calendar.months.dhulhijjah',
] as const;
