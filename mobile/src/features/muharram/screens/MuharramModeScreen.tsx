import { useEffect, useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { DailyAmalCard } from '../components/DailyAmalCard';
import { DailyZiyaratCard } from '../components/DailyZiyaratCard';
import { KarbalaEventCard } from '../components/KarbalaEventCard';
import { MajlisContentCard } from '../components/MajlisContentCard';
import { MuharramDayPicker } from '../components/MuharramDayPicker';
import { MuharramModeControls } from '../components/MuharramModeControls';
import { useMuharramMode } from '../hooks/useMuharramMode';

export function MuharramModeScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    hijri,
    seasonActive,
    isModeActive,
    mode,
    blackTheme,
    currentDay,
    daily,
    daysUntilAshura,
    setMode,
    setBlackTheme,
    setSelectedDay,
    markDayVisited,
  } = useMuharramMode();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('muharramMode.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
    });
  }, [navigation, t, theme]);

  useEffect(() => {
    markDayVisited(currentDay);
  }, [currentDay, markDayVisited]);

  const todayMuharramDay = hijri.month === 1 ? hijri.day : 1;

  const openDua = () => {
    if (daily?.duaId) {
      navigation.navigate('DuaReader', { duaId: daily.duaId });
    }
  };

  const openZiyarat = () => {
    if (daily?.ziyaratId) {
      navigation.navigate('ZiyaratReader', { ziyaratId: daily.ziyaratId });
    }
  };

  if (!daily) {
    return (
      <Screen>
        <Text variant="bodyMd" color="secondary">
          {t('muharramMode.notAvailable')}
        </Text>
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingHorizontal: theme.spacing[5] }]}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="displayMd">{t('muharramMode.title')}</Text>
        <Text variant="bodySm" color="secondary">
          {seasonActive
            ? daysUntilAshura != null && daysUntilAshura > 0
              ? t('muharramMode.countdown', { days: daysUntilAshura })
              : t('muharramMode.subtitleActive')
            : t('muharramMode.subtitle')}
        </Text>

        <MuharramModeControls
          mode={mode}
          blackTheme={blackTheme}
          isModeActive={isModeActive}
          onSetMode={setMode}
          onToggleBlackTheme={() => setBlackTheme(!blackTheme)}
        />

        <MuharramDayPicker
          activeDay={currentDay}
          todayDay={todayMuharramDay}
          onSelect={setSelectedDay}
        />

        <KarbalaEventCard day={currentDay} content={daily} />
        <MajlisContentCard content={daily} />
        <DailyAmalCard content={daily} onOpenDua={daily.duaId ? openDua : undefined} />
        <DailyZiyaratCard content={daily} onOpen={openZiyarat} />

        <Text variant="caption" color="tertiary" style={styles.offline}>
          {t('muharramMode.offline')}
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 16,
    paddingBottom: 40,
    gap: 20,
  },
  offline: {
    textAlign: 'center',
  },
});
