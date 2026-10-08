import type { NavigatorScreenParams } from '@react-navigation/native';

import type { MafatihCollectionId } from '@/features/mafatih/types';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyOtp: { email?: string; purpose?: string };
};

export type MainTabParamList = {
  Home: undefined;
  Prayer: undefined;
  Quran: undefined;
  AiAssistant: { seedPrompt?: string } | undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Bootstrap: undefined;
  Onboarding: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Settings: undefined;
  QuranSearch: { query?: string } | undefined;
  QuranReader: { surahNumber: number; ayah?: number };
  Mafatih: { collectionId?: MafatihCollectionId } | undefined;
  MafatihReader: { ref: string };
  Duas: undefined;
  DuaReader: { duaId: string };
  DailyLifeDuas: undefined;
  DailyLifeCategory: { categoryId: string };
  DailyLifeDuaReader: { duaId: string };
  Ziyarat: undefined;
  ZiyaratReader: { ziyaratId: string };
  Sahifa: undefined;
  SahifaReader: { sahifaId: string };
  Nahjul: undefined;
  NahjulReader: { nahjulId: string };
  Tasbih: undefined;
  TasbihCounter: undefined;
  Qibla: undefined;
  Calendar: undefined;
  MuharramMode: undefined;
  MuharramDayDetail: { day: number };
  KarbalaTimeline: undefined;
  MartyrsList: undefined;
  MartyrProfile: { martyrId: string };
  ArbaeenJourney: undefined;
  SafarEvents: undefined;
  Masoomeen: undefined;
  MasoomeenProfile: { masoomeenId: string };
  Hadith: undefined;
  HadithDetail: { hadithId: string };
  Paywall: { highlight?: 'ai' | 'advanced_quran' | 'cloud_sync' | 'exclusive_content' } | undefined;
  Insights: undefined;
  PrayerAcademy: undefined;
  PrayerAcademyGuide: { prayerId: string; step?: number };
  WorshipGuide: undefined;
  WorshipGuideSession: { guideId: string; step?: number };
  Fasting: undefined;
  RamadanHub: undefined;
  LaylatAlQadr: undefined;
  KaffaraCalculator: undefined;
  FidyaCalculator: undefined;
  Support: undefined;
  SupportCrypto: { optionId: string };
  SupportBank: undefined;
  SupportTransparency: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
