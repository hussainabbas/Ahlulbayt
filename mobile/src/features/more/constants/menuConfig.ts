import type { RootStackParamList } from '@/navigation/types';

type MenuIconName = 'book' | 'bookmark' | 'search' | 'settings';

export type MoreMenuKey =
  | 'insights'
  | 'premium'
  | 'mafatih'
  | 'sahifa'
  | 'masoomeen'
  | 'hadith'
  | 'nahjul'
  | 'tasbih'
  | 'dua'
  | 'ziyarat'
  | 'worshipGuide'
  | 'prayerAcademy'
  | 'calendar'
  | 'qibla'
  | 'muharram'
  | 'ramadan'
  | 'fasting';

export type MoreMenuRoute = Extract<
  keyof RootStackParamList,
  | 'Insights'
  | 'Paywall'
  | 'Mafatih'
  | 'Sahifa'
  | 'Masoomeen'
  | 'Hadith'
  | 'Nahjul'
  | 'Tasbih'
  | 'Duas'
  | 'Ziyarat'
  | 'WorshipGuide'
  | 'PrayerAcademy'
  | 'Calendar'
  | 'Qibla'
  | 'MuharramMode'
  | 'RamadanHub'
  | 'Fasting'
>;

export interface MoreMenuItem {
  key: MoreMenuKey;
  route: MoreMenuRoute;
  subscriptionOnly?: boolean;
}

export interface MoreMenuSection {
  id: 'personal' | 'library' | 'worship' | 'tools';
  items: MoreMenuItem[];
}

export const MORE_MENU_SECTIONS: MoreMenuSection[] = [
  {
    id: 'personal',
    items: [
      { key: 'insights', route: 'Insights' },
      { key: 'premium', route: 'Paywall', subscriptionOnly: true },
    ],
  },
  {
    id: 'library',
    items: [
      { key: 'mafatih', route: 'Mafatih' },
      { key: 'sahifa', route: 'Sahifa' },
      { key: 'masoomeen', route: 'Masoomeen' },
      { key: 'hadith', route: 'Hadith' },
      { key: 'nahjul', route: 'Nahjul' },
    ],
  },
  {
    id: 'worship',
    items: [
      { key: 'worshipGuide', route: 'WorshipGuide' },
      { key: 'prayerAcademy', route: 'PrayerAcademy' },
      { key: 'dua', route: 'Duas' },
      { key: 'ziyarat', route: 'Ziyarat' },
      { key: 'tasbih', route: 'Tasbih' },
      { key: 'fasting', route: 'Fasting' },
    ],
  },
  {
    id: 'tools',
    items: [
      { key: 'calendar', route: 'Calendar' },
      { key: 'qibla', route: 'Qibla' },
      { key: 'muharram', route: 'MuharramMode' },
      { key: 'ramadan', route: 'RamadanHub' },
    ],
  },
];

export const MORE_QUICK_ACTIONS: MoreMenuItem[] = [
  { key: 'mafatih', route: 'Mafatih' },
  { key: 'tasbih', route: 'Tasbih' },
  { key: 'calendar', route: 'Calendar' },
  { key: 'qibla', route: 'Qibla' },
];

export interface MenuIconConfig {
  icon?: MenuIconName;
  label?: string;
  tone: 'accent' | 'gold' | 'muted' | 'rose';
}

export const MENU_ICON_CONFIG: Record<MoreMenuKey, MenuIconConfig> = {
  insights: { icon: 'bookmark', tone: 'accent' },
  premium: { label: '✦', tone: 'gold' },
  mafatih: { icon: 'book', tone: 'accent' },
  sahifa: { icon: 'book', tone: 'muted' },
  masoomeen: { label: '14', tone: 'accent' },
  hadith: { icon: 'search', tone: 'muted' },
  nahjul: { icon: 'book', tone: 'rose' },
  tasbih: { label: '33', tone: 'accent' },
  dua: { icon: 'book', tone: 'accent' },
  ziyarat: { label: 'ز', tone: 'muted' },
  worshipGuide: { label: '◉', tone: 'accent' },
  prayerAcademy: { label: '⌁', tone: 'muted' },
  calendar: { label: '◷', tone: 'accent' },
  qibla: { label: '⌖', tone: 'accent' },
  muharram: { label: '☾', tone: 'rose' },
  ramadan: { label: '☪', tone: 'gold' },
  fasting: { label: '◌', tone: 'accent' },
};
