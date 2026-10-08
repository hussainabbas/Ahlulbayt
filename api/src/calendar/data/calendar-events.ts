export type CalendarEventType = 'wiladat' | 'shahadat' | 'occasion' | 'fasting' | 'amaal';

export interface CalendarEvent {
  id: string;
  hijriMonth: number;
  hijriDay: number;
  type: CalendarEventType;
  titles: { en: string; ar: string; ur: string };
  description?: { en: string };
  tags: string[];
  priority: number;
}

export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'muharram_1',
    hijriMonth: 1,
    hijriDay: 1,
    type: 'occasion',
    titles: { en: 'Start of Muharram', ar: 'بداية محرم', ur: 'محرم کا آغاز' },
    description: { en: 'Beginning of the sacred month of Muharram' },
    tags: ['muharram'],
    priority: 100,
  },
  {
    id: 'ashura',
    hijriMonth: 1,
    hijriDay: 10,
    type: 'shahadat',
    titles: { en: 'Ashura — Martyrdom of Imam Husayn (a.s.)', ar: 'عاشوراء', ur: 'یوم عاشور' },
    description: { en: 'Day of Ashura and the tragedy of Karbala' },
    tags: ['muharram', 'karbala', 'imam_husayn'],
    priority: 100,
  },
  {
    id: 'arbaeen',
    hijriMonth: 2,
    hijriDay: 20,
    type: 'occasion',
    titles: { en: 'Arbaeen', ar: 'الأربعين', ur: 'اربعین' },
    tags: ['karbala', 'ziyarat'],
    priority: 90,
  },
  {
    id: 'ghadeer',
    hijriMonth: 12,
    hijriDay: 18,
    type: 'occasion',
    titles: { en: 'Eid al-Ghadeer', ar: 'عيد الغدير', ur: 'عید غدیر' },
    description: { en: 'Appointment of Imam Ali (a.s.) at Ghadeer Khumm' },
    tags: ['eid', 'imam_ali'],
    priority: 95,
  },
  {
    id: 'mubahila',
    hijriMonth: 12,
    hijriDay: 24,
    type: 'occasion',
    titles: { en: 'Day of Mubahila', ar: 'يوم المباهلة', ur: 'یوم مباہلہ' },
    tags: ['ahlebayt'],
    priority: 80,
  },
  {
    id: 'wiladat_imam_ali',
    hijriMonth: 7,
    hijriDay: 13,
    type: 'wiladat',
    titles: { en: 'Wiladat of Imam Ali (a.s.)', ar: 'ولادة الإمام علي', ur: 'ولادت امام علیؑ' },
    tags: ['masoomeen', 'imam_ali'],
    priority: 85,
  },
  {
    id: 'wiladat_imam_mahdi',
    hijriMonth: 8,
    hijriDay: 15,
    type: 'wiladat',
    titles: { en: 'Wiladat of Imam Mahdi (a.j.)', ar: 'ولادة الإمام المهدي', ur: 'ولادت امام مہدیؑ' },
    tags: ['masoomeen', 'imam_mahdi'],
    priority: 90,
  },
  {
    id: 'shahadat_imam_husayn',
    hijriMonth: 1,
    hijriDay: 10,
    type: 'shahadat',
    titles: { en: 'Shahadat of Imam Husayn (a.s.)', ar: 'استشهاد الإمام الحسين', ur: 'شہادت امام حسینؑ' },
    tags: ['muharram', 'imam_husayn'],
    priority: 100,
  },
];
