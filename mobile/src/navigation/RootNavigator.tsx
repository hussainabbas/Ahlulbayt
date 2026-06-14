import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { OnboardingFlow } from '@/features/onboarding/OnboardingFlow';

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
        getComponent={lazyScreen(
          () => require('@/features/mafatih/screens/MafatihHubScreen').MafatihHubScreen,
        )}
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
        name="Paywall"
        getComponent={lazyScreen(
          () => require('@/features/monetization/screens/PaywallScreen').PaywallScreen,
        )}
        options={stack.modal()}
      />
    </Stack.Navigator>
  );
}
