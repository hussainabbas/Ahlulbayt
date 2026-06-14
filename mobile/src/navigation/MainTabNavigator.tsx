import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppTabBar } from '@/components/navigation/AppTabBar';
import { AiAssistantScreen } from '@/features/ai/screens/AiAssistantScreen';
import { NATIVE_AUDIO_ENABLED } from '@/features/quran/audio/config';
import { FullPlayerModal } from '@/features/quran/audio/components/FullPlayerModal';
import { MiniPlayer } from '@/features/quran/audio/components/MiniPlayer';
import { HomeScreen } from '@/features/home/screens/HomeScreen';
import { MoreScreen } from '@/features/more/screens/MoreScreen';
import { PrayerScreen } from '@/features/prayer/screens/PrayerScreen';
import { QuranScreen } from '@/features/quran/screens/QuranScreen';
import { useLocale } from '@/i18n/useLocale';

import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  const { t } = useLocale();

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      lazy: true,
      freezeOnBlur: true,
      tabBarShowLabel: true,
    }),
    [],
  );

  return (
    <View style={styles.root}>
      <Tab.Navigator
        tabBar={(props) => <AppTabBar {...props} />}
        screenOptions={screenOptions}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: t('tabs.home') }}
        />
        <Tab.Screen
          name="Prayer"
          component={PrayerScreen}
          options={{ title: t('tabs.prayer') }}
        />
        <Tab.Screen
          name="Quran"
          component={QuranScreen}
          options={{ title: t('tabs.quran') }}
        />
        <Tab.Screen
          name="AiAssistant"
          component={AiAssistantScreen}
          options={{ title: t('tabs.ai') }}
        />
        <Tab.Screen
          name="Profile"
          component={MoreScreen}
          options={{ title: t('tabs.profile') }}
        />
      </Tab.Navigator>

      {NATIVE_AUDIO_ENABLED ? (
        <>
          <MiniPlayer />
          <FullPlayerModal />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
