export type CalendarEventCategory =
  | 'wiladat'
  | 'shahadat'
  | 'muharram'
  | 'arbaeen'
  | 'ghadeer'
  | 'mubahila';

export type CalendarFilterCategory = CalendarEventCategory | 'all';

export interface ShiaCalendarEvent {
  id: string;
  titleKey: string;
  descriptionKey: string;
  hijriMonth: number;
  hijriDay: number;
  categories: CalendarEventCategory[];
  priority: number;
  amaalKey?: string;
}

export interface CalendarEventInstance extends ShiaCalendarEvent {
  daysUntil: number;
  isToday: boolean;
}

export interface HijriMonthView {
  year: number;
  month: number;
  daysInMonth: number;
}

export interface CalendarDayCell {
  day: number;
  isToday: boolean;
  isSelected: boolean;
  events: ShiaCalendarEvent[];
  hasHighPriority: boolean;
}
