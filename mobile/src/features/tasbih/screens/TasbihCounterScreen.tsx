import { useLayoutEffect, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { TasbihCounterRing } from '../components/TasbihCounterRing';
import { TasbihGoalProgress } from '../components/TasbihGoalProgress';
import { TasbihPhaseIndicator } from '../components/TasbihPhaseIndicator';
import { useTasbihAnalytics, useTasbihSession } from '../hooks/useTasbihSession';

export function TasbihCounterScreen() {
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    phase,
    phaseCount,
    phaseTarget,
    phases,
    phaseIndex,
    todayRecord,
    goalTotal,
    increment,
    undoLast,
    resetSession,
  } = useTasbihSession();

  const analytics = useTasbihAnalytics();

  const phaseLabel =
    locale === 'ur' ? phase.labels.ur : locale === 'ar' ? phase.labels.ar : phase.labels.en;

  const phaseCounts = useMemo(() => {
    return phases.map((p, i) => {
      if (i < phaseIndex) return p.target;
      if (i === phaseIndex) return phaseCount;
      return 0;
    });
  }, [phases, phaseIndex, phaseCount]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('tasbih.counter.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerRight: () => (
        <Pressable onPress={() => resetSession('fatima_zahra')} hitSlop={8} style={{ marginRight: 8 }}>
          <Text variant="caption" color="accent">
            {t('tasbih.reset')}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, t, theme, resetSession]);

  return (
    <Screen>
      <View style={styles.root}>
        <TasbihGoalProgress
          current={todayRecord.total}
          goal={goalTotal}
          cycles={todayRecord.cycles}
        />

        <TasbihPhaseIndicator
          phases={phases}
          activeIndex={phaseIndex}
          phaseCounts={phaseCounts}
        />

        <View style={styles.ringWrap}>
          <TasbihCounterRing
            count={phaseCount}
            target={phaseTarget}
            label={phaseLabel}
            arabic={phase.arabic}
            onTap={() => increment()}
          />
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={undoLast}
            style={[styles.actionBtn, { borderColor: theme.colors.borderSubtle }]}
          >
            <Text variant="bodySm" color="secondary">
              {t('tasbih.undo')}
            </Text>
          </Pressable>
          <View style={styles.todayStat}>
            <Text variant="caption" color="tertiary">
              {t('tasbih.today')}
            </Text>
            <Text variant="headingSm" color="accent">
              {todayRecord.total}
            </Text>
          </View>
          <View style={styles.todayStat}>
            <Text variant="caption" color="tertiary">
              {t('tasbih.streak.current')}
            </Text>
            <Text variant="headingSm" color="accent">
              🔥 {analytics.currentStreak}
            </Text>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    gap: 24,
    paddingTop: 8,
  },
  ringWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  todayStat: {
    alignItems: 'center',
    gap: 2,
  },
});
