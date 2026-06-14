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
  | 'muharram';

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
    ],
  },
  {
    id: 'tools',
    items: [
      { key: 'calendar', route: 'Calendar' },
      { key: 'qibla', route: 'Qibla' },
      { key: 'muharram', route: 'MuharramMode' },
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
  size?: 'md' | 'lg';
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
  ziyarat: { label: 'ز', tone: 'muted', size: 'lg' },
  worshipGuide: { label: '◉', tone: 'accent', size: 'lg' },
  prayerAcademy: { label: '⌁', tone: 'muted', size: 'lg' },
  calendar: { label: '◷', tone: 'muted', size: 'lg' },
  qibla: { label: '⌖', tone: 'accent', size: 'lg' },
  muharram: { label: '☾', tone: 'rose', size: 'lg' },
};
