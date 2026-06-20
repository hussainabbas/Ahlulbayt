import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { OnboardingFlow } from '@/features/onboarding/OnboardingFlow';
import { MafatihHubScreen } from '@/features/mafatih/screens/MafatihHubScreen';

import { AuthNavigator } from './AuthNavigator';
import { BootstrapScreen } from './BootstrapScreen';
import { lazyScreen } from './lazyScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { useStackScreenOptions } from './useStackScreenOptions';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const stack = useStackScreenOptions();

  return (
    <Stack.Navigator initialRouteName="Bootstrap" screenOptions={stack.root}>
      <Stack.Screen name="Bootstrap" component={BootstrapScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingFlow} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen
        name="Settings"
        getComponent={lazyScreen(
          () => require('@/features/settings/screens/SettingsScreen').SettingsScreen,
        )}
        options={stack.titled()}
      />
      <Stack.Screen
        name="QuranSearch"
        getComponent={lazyScreen(
          () => require('@/features/quran/search/screens/QuranSearchScreen').QuranSearchScreen,
        )}
        options={stack.modal()}
      />
      <Stack.Screen
        name="QuranReader"
        getComponent={lazyScreen(
          () => require('@/features/quran/screens/QuranReaderScreen').QuranReaderScreen,
        )}
        options={stack.base}
      />
      <Stack.Screen
        name="Mafatih"
        component={MafatihHubScreen}
        options={stack.titled()}
      />
      <Stack.Screen
        name="MafatihReader"
        getComponent={lazyScreen(
          () => require('@/features/mafatih/screens/MafatihReaderScreen').MafatihReaderScreen,
        )}
        options={stack.base}
      />
      <Stack.Screen
        name="Duas"
        getComponent={lazyScreen(() => require('@/features/dua/screens/DuasScreen').DuasScreen)}
        options={stack.titled()}
      />
      <Stack.Screen
        name="DuaReader"
        getComponent={lazyScreen(
          () => require('@/features/dua/screens/DuaReaderScreen').DuaReaderScreen,
        )}
        options={stack.base}
      />
      <Stack.Screen
        name="DailyLifeDuas"
        getComponent={lazyScreen(
          () =>
            require('@/features/daily-life-duas/screens/DailyLifeDuasScreen').DailyLifeDuasScreen,
        )}
        options={stack.titled()}
      />
      <Stack.Screen
        name="DailyLifeCategory"
        getComponent={lazyScreen(
          () =>
            require('@/features/daily-life-duas/screens/DailyLifeCategoryScreen')
              .DailyLifeCategoryScreen,
        )}
        options={stack.titled()}
      />
      <Stack.Screen
        name="DailyLifeDuaReader"
        getComponent={lazyScreen(
          () =>
            require('@/features/daily-life-duas/screens/DailyLifeDuaReaderScreen')
              .DailyLifeDuaReaderScreen,
        )}
        options={stack.base}
      />
      <Stack.Screen
        name="Ziyarat"
        getComponent={lazyScreen(
          () => require('@/features/ziyarat/screens/ZiyaratScreen').ZiyaratScreen,
        )}
        options={stack.titled()}
      />
      <Stack.Screen
        name="ZiyaratReader"
        getComponent={lazyScreen(
          () => require('@/features/ziyarat/screens/ZiyaratReaderScreen').ZiyaratReaderScreen,
        )}
        options={stack.base}
      />
      <Stack.Screen
        name="Sahifa"
        getComponent={lazyScreen(
          () => require('@/features/sahifa/screens/SahifaScreen').SahifaScreen,
        )}
        options={stack.titled()}
      />
      <Stack.Screen
        name="SahifaReader"
        getComponent={lazyScreen(
          () => require('@/features/sahifa/screens/SahifaReaderScreen').SahifaReaderScreen,
        )}
        options={stack.base}
      />
      <Stack.Screen
        name="Nahjul"
        getComponent={lazyScreen(
          () => require('@/features/nahjul/screens/NahjulScreen').NahjulScreen,
        )}
        options={stack.titled()}
      />
      <Stack.Screen
        name="NahjulReader"
        getComponent={lazyScreen(
          () => require('@/features/nahjul/screens/NahjulReaderScreen').NahjulReaderScreen,
        )}
        options={stack.base}
      />
      <Stack.Screen
        name="Tasbih"
        getComponent={lazyScreen(
          () => require('@/features/tasbih/screens/TasbihHubScreen').TasbihHubScreen,
        )}
        options={stack.titled()}
      />
      <Stack.Screen
        name="TasbihCounter"
        getComponent={lazyScreen(
          () => require('@/features/tasbih/screens/TasbihCounterScreen').TasbihCounterScreen,
        )}
        options={stack.base}
      />
      <Stack.Screen
        name="MuharramMode"
        getComponent={lazyScreen(
          () => require('@/features/muharram/screens/MuharramModeScreen').MuharramModeScreen,
        )}
        options={stack.base}
      />
      <Stack.Screen
        name="MuharramDayDetail"
        getComponent={lazyScreen(
          () =>
            require('@/features/muharram/screens/MuharramDayDetailScreen').MuharramDayDetailScreen,
        )}
        options={stack.base}
      />
      <Stack.Screen
        name="KarbalaTimeline"
        getComponent={lazyScreen(
          () => require('@/features/muharram/screens/KarbalaTimelineScreen').KarbalaTimelineScreen,
        )}
        options={stack.base}
      />
      <Stack.Screen
        name="MartyrsList"
        getComponent={lazyScreen(
          () => require('@/features/muharram/screens/MartyrsListScreen').MartyrsListScreen,
        )}
        options={stack.base}
      />
      <Stack.Screen
        name="MartyrProfile"
        getComponent={lazyScreen(
          () => require('@/features/muharram/screens/MartyrProfileScreen').MartyrProfileScreen,
        )}
        options={stack.base}
      />
      <Stack.Screen
        name="ArbaeenJourney"
        getComponent={lazyScreen(
          () => require('@/features/muharram/screens/ArbaeenJourneyScreen').ArbaeenJourneyScreen,
        )}
        options={stack.base}
      />
      <Stack.Screen
        name="SafarEvents"
        getComponent={lazyScreen(
          () => require('@/features/muharram/screens/SafarEventsScreen').SafarEventsScreen,
        )}
        options={stack.base}
      />
      <Stack.Screen
        name="Calendar"
        getComponent={lazyScreen(
          () => require('@/features/calendar/screens/CalendarScreen').CalendarScreen,
        )}
        options={stack.base}
      />
      <Stack.Screen
        name="Qibla"
        getComponent={lazyScreen(() => require('@/features/qibla/screens/QiblaScreen').QiblaScreen)}
        options={stack.base}
      />
      <Stack.Screen
        name="Masoomeen"
        getComponent={lazyScreen(
          () => require('@/features/masoomeen/screens/MasoomeenHubScreen').MasoomeenHubScreen,
        )}
        options={stack.titled()}
      />
      <Stack.Screen
        name="MasoomeenProfile"
        getComponent={lazyScreen(
          () => require('@/features/masoomeen/screens/MasoomeenProfileScreen').MasoomeenProfileScreen,
        )}
        options={stack.base}
      />
      <Stack.Screen
        name="Hadith"
        getComponent={lazyScreen(
          () => require('@/features/hadith/screens/HadithHubScreen').HadithHubScreen,
        )}
        options={stack.titled()}
      />
      <Stack.Screen
        name="HadithDetail"
        getComponent={lazyScreen(
          () => require('@/features/hadith/screens/HadithDetailScreen').HadithDetailScreen,
        )}
        options={stack.base}
      />
      <Stack.Screen
        name="Insights"
        getComponent={lazyScreen(
          () => require('@/features/insights/screens/InsightsScreen').InsightsScreen,
        )}
        options={stack.base}
      />
      <Stack.Screen
        name="PrayerAcademy"
        getComponent={lazyScreen(
          () =>
            require('@/features/prayer-academy/screens/PrayerAcademyHubScreen').PrayerAcademyHubScreen,
        )}
        options={stack.titled()}
      />
      <Stack.Screen
        name="PrayerAcademyGuide"
        getComponent={lazyScreen(
          () =>
            require('@/features/prayer-academy/screens/PrayerAcademyGuideScreen').PrayerAcademyGuideScreen,
        )}
        options={stack.base}
      />
      <Stack.Screen
        name="WorshipGuide"
        getComponent={lazyScreen(
          () =>
            require('@/features/worship-guide/screens/WorshipGuideHubScreen').WorshipGuideHubScreen,
        )}
        options={stack.titled()}
      />
      <Stack.Screen
        name="WorshipGuideSession"
        getComponent={lazyScreen(
          () =>
            require('@/features/worship-guide/screens/WorshipGuideSessionScreen').WorshipGuideSessionScreen,
        )}
        options={stack.base}
      />
      <Stack.Screen
        name="Fasting"
        getComponent={lazyScreen(
          () => require('@/features/fasting/screens/FastingHubScreen').FastingHubScreen,
        )}
        options={stack.titled()}
      />
      <Stack.Screen
        name="RamadanHub"
        getComponent={lazyScreen(
          () => require('@/features/ramadan/screens/RamadanHubScreen').RamadanHubScreen,
        )}
        options={stack.base}
      />
      <Stack.Screen
        name="LaylatAlQadr"
        getComponent={lazyScreen(
          () => require('@/features/ramadan/screens/LaylatAlQadrScreen').LaylatAlQadrScreen,
        )}
        options={stack.base}
      />
      <Stack.Screen
        name="KaffaraCalculator"
        getComponent={lazyScreen(
          () =>
            require('@/features/fasting/screens/KaffaraCalculatorScreen').KaffaraCalculatorScreen,
        )}
        options={stack.titled()}
      />
      <Stack.Screen
        name="FidyaCalculator"
        getComponent={lazyScreen(
          () => require('@/features/fasting/screens/FidyaCalculatorScreen').FidyaCalculatorScreen,
        )}
        options={stack.titled()}
      />
      <Stack.Screen
        name="Paywall"
        getComponent={lazyScreen(
          () => require('@/features/monetization/screens/PaywallScreen').PaywallScreen,
        )}
        options={stack.modal()}
      />
      <Stack.Screen
        name="Support"
        getComponent={lazyScreen(
          () => require('@/features/support/screens/SupportHubScreen').SupportHubScreen,
        )}
        options={stack.titled()}
      />
      <Stack.Screen
        name="SupportCrypto"
        getComponent={lazyScreen(
          () => require('@/features/support/screens/SupportCryptoScreen').SupportCryptoScreen,
        )}
        options={stack.base}
      />
      <Stack.Screen
        name="SupportTransparency"
        getComponent={lazyScreen(
          () =>
            require('@/features/support/screens/SupportTransparencyScreen').SupportTransparencyScreen,
        )}
        options={stack.titled()}
      />
    </Stack.Navigator>
  );
}
