import type { NavigatorScreenParams } from '@react-navigation/native';

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
  Mafatih: undefined;
  MafatihReader: { ref: string };
  Duas: undefined;
  DuaReader: { duaId: string };
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
  Masoomeen: undefined;
  MasoomeenProfile: { masoomeenId: string };
  Hadith: undefined;
  HadithDetail: { hadithId: string };
  Paywall: { highlight?: 'ai' | 'advanced_quran' | 'cloud_sync' | 'exclusive_content' } | undefined;
  Insights: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
