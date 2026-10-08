import { useEffect, useLayoutEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useFastingHub } from '@/features/fasting/hooks/useFastingHub';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { AmaalGuideCard } from '../components/AmaalGuideCard';
import { CharityTrackerCard } from '../components/CharityTrackerCard';
import { DailyContentCard } from '../components/DailyContentCard';
import { FastingTrackerCard } from '../components/FastingTrackerCard';
import { LaylatAlQadrBanner } from '../components/LaylatAlQadrBanner';
import { PrayerTrackerCard } from '../components/PrayerTrackerCard';
import { RamadanDayPicker } from '../components/RamadanDayPicker';
import { RamadanHeroWidget } from '../components/RamadanHeroWidget';
import { RamadanModeControls } from '../components/RamadanModeControls';
import { useRamadanMode } from '../hooks/useRamadanMode';
import { useQuranGoalStore } from '../stores/quranGoalStore';
import type { QuranGoalUnit } from '../types';

export function RamadanHubScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const fastingHub = useFastingHub();

  const {
    hijri,
    seasonActive,
    isModeActive,
    mode,
    currentDay,
    daily,
    lastTen,
    setMode,
    setSelectedDay,
    markDayVisited,
  } = useRamadanMode();

  const unit = useQuranGoalStore((s) => s.unit);
  const dailyTarget = useQuranGoalStore((s) => s.dailyTarget);
  const setGoal = useQuranGoalStore((s) => s.setGoal);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('ramadanMode.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
    });
  }, [navigation, t, theme]);

  useEffect(() => {
    markDayVisited(currentDay);
  }, [currentDay, markDayVisited]);

  const todayRamadanDay = hijri.month === 9 ? hijri.day : 1;

  const openDua = () => {
    if (!daily) return;
    if (daily.dua.duaId) {
      navigation.navigate('DuaReader', { duaId: daily.dua.duaId });
    } else if (daily.dua.sahifaId) {
      navigation.navigate('SahifaReader', { sahifaId: daily.dua.sahifaId });
    }
  };

  const cycleUnit = () => {
    const units: QuranGoalUnit[] = ['pages', 'ayahs', 'juz'];
    const next = units[(units.indexOf(unit) + 1) % units.length];
    setGoal(next, dailyTarget);
  };

  if (!daily) {
    return (
      <Screen>
        <Text variant="bodyMd" color="secondary">
          {t('ramadanMode.notAvailable')}
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
        <Text variant="displayMd">{t('ramadanMode.title')}</Text>
        <Text variant="bodySm" color="secondary">
          {seasonActive ? t('ramadanMode.subtitleActive') : t('ramadanMode.subtitle')}
        </Text>

        <RamadanModeControls mode={mode} isModeActive={isModeActive} onSetMode={setMode} />

        {hijri.month === 9 ? (
          <RamadanHeroWidget
            countdown={fastingHub.countdown}
            formatTime={fastingHub.formatTime}
            isFasted={fastingHub.isFasted()}
            onToggleFast={() => fastingHub.toggleFast('ramadan')}
            onOpenHub={() => navigation.navigate('Fasting')}
          />
        ) : null}

        {lastTen ? (
          <LaylatAlQadrBanner
            hijriDay={hijri.day}
            isOddNight={hijri.day % 2 === 1}
            onPress={() => navigation.navigate('LaylatAlQadr')}
          />
        ) : null}

        <RamadanDayPicker
          activeDay={currentDay}
          todayDay={todayRamadanDay}
          onSelect={setSelectedDay}
        />

        <DailyContentCard
          daily={daily}
          countdown={fastingHub.countdown}
          formatTime={fastingHub.formatTime}
          onOpenDua={openDua}
        />
        <AmaalGuideCard items={daily.amaal} />

        <View style={styles.goalRow}>
          <Text variant="headingSm">{t('ramadanMode.quranGoal')}</Text>
          <Pressable onPress={cycleUnit}>
            <Text variant="caption" color="accent">
              {t(`ramadanMode.quranUnit.${unit}`)} · {dailyTarget}/day
            </Text>
          </Pressable>
        </View>

        <FastingTrackerCard />
        <PrayerTrackerCard />
        <CharityTrackerCard />

        <Pressable onPress={() => navigation.navigate('KaffaraCalculator')}>
          <Text variant="bodySm" color="accent">
            {t('fasting.kaffara.title')} ›
          </Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('FidyaCalculator')}>
          <Text variant="bodySm" color="accent">
            {t('fasting.fidya.title')} ›
          </Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Fasting')}>
          <Text variant="bodySm" color="accent">
            {t('ramadanMode.fastingHub')} ›
          </Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('LaylatAlQadr')}>
          <Text variant="bodySm" color="accent">
            {t('ramadanMode.laylatHub')} ›
          </Text>
        </Pressable>

        <Text variant="caption" color="tertiary" style={styles.offline}>
          {t('ramadanMode.offline')}
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
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offline: {
    textAlign: 'center',
  },
});
