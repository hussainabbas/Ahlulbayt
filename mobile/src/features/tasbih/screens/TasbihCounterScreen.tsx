import { useLayoutEffect, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { TasbihCounterRing } from '../components/TasbihCounterRing';
import { TasbihGoalProgress } from '../components/TasbihGoalProgress';
import { TasbihPhaseIndicator } from '../components/TasbihPhaseIndicator';
import { useTasbihAnalytics, useTasbihSession } from '../hooks/useTasbihSession';

export function TasbihCounterScreen() {
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
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
      headerShadowVisible: false,
      headerRight: () => (
        <Pressable onPress={() => resetSession('fatima_zahra')} hitSlop={8} style={styles.resetBtn}>
          <Text variant="caption" color="accent">
            {t('tasbih.reset')}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, t, theme, resetSession]);

  return (
    <Screen safeTop={false} safeBottom={false}>
      <View style={[styles.root, { paddingBottom: insets.bottom + layout.blockGap }]}>
        <View style={styles.top}>
          <TasbihGoalProgress
            compact
            current={todayRecord.total}
            goal={goalTotal}
            cycles={todayRecord.cycles}
          />

          <TasbihPhaseIndicator
            phases={phases}
            activeIndex={phaseIndex}
            phaseCounts={phaseCounts}
          />
        </View>

        <View style={styles.ringWrap}>
          <TasbihCounterRing
            count={phaseCount}
            target={phaseTarget}
            label={phaseLabel}
            arabic={phase.arabic}
            onTap={() => increment()}
          />
        </View>

        <Card variant="inset" padded={false} style={styles.dock}>
          <Pressable
            onPress={undoLast}
            style={({ pressed }) => [
              styles.dockAction,
              pressed && { backgroundColor: theme.colors.surfaceMuted },
            ]}
          >
            <Text variant="bodySm" weight="500" color="secondary">
              {t('tasbih.undo')}
            </Text>
          </Pressable>

          <View style={[styles.dockDivider, { backgroundColor: theme.colors.borderSubtle }]} />

          <View style={styles.dockStat}>
            <Text variant="caption" color="tertiary">
              {t('tasbih.today')}
            </Text>
            <Text variant="headingSm" color="accent">
              {todayRecord.total}
            </Text>
          </View>

          <View style={[styles.dockDivider, { backgroundColor: theme.colors.borderSubtle }]} />

          <View style={styles.dockStat}>
            <Text variant="caption" color="tertiary">
              {t('tasbih.streak.current')}
            </Text>
            <Text variant="headingSm" color="accent">
              {analytics.currentStreak}
            </Text>
          </View>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: layout.listGap,
  },
  top: {
    gap: layout.blockGap,
  },
  ringWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: layout.blockGap,
  },
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: layout.listGap,
    paddingHorizontal: layout.listGap,
  },
  dockAction: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: layout.blockGap,
    borderRadius: 12,
  },
  dockDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginHorizontal: layout.listGap,
  },
  dockStat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  resetBtn: {
    marginRight: layout.listGap,
  },
});
