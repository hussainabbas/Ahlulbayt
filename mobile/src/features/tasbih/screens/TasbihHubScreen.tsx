import { useLayoutEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { TasbihAnalyticsChart } from '../components/TasbihAnalyticsChart';
import { TasbihGoalProgress } from '../components/TasbihGoalProgress';
import { TasbihStreakBadge } from '../components/TasbihStreakBadge';
import { CYCLE_TOTAL, GOAL_CYCLE_OPTIONS } from '../constants/fatimaZahra';
import { useTasbihAnalytics } from '../hooks/useTasbihSession';
import { useTasbihStore } from '../stores/tasbihStore';

export function TasbihHubScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const analytics = useTasbihAnalytics();
  const dailyGoalCycles = useTasbihStore((s) => s.settings.dailyGoalCycles);
  const hapticsEnabled = useTasbihStore((s) => s.settings.hapticsEnabled);
  const setDailyGoalCycles = useTasbihStore((s) => s.setDailyGoalCycles);
  const setHapticsEnabled = useTasbihStore((s) => s.setHapticsEnabled);
  const goalTotal = dailyGoalCycles * CYCLE_TOTAL;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('tasbih.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
    });
  }, [navigation, t, theme]);

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingHorizontal: theme.spacing[5] }]}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="displayMd">{t('tasbih.title')}</Text>
        <Text variant="bodySm" color="secondary">
          {t('tasbih.subtitle')}
        </Text>

        <Card style={styles.heroCard}>
          <Text variant="headingSm">{t('tasbih.fatimaZahra.title')}</Text>
          <Text variant="bodySm" color="secondary">
            {t('tasbih.fatimaZahra.description')}
          </Text>
          <Text variant="caption" color="tertiary">
            34 + 33 + 33 = {CYCLE_TOTAL}
          </Text>
          <Pressable
            onPress={() => navigation.navigate('TasbihCounter')}
            style={[styles.startBtn, { backgroundColor: theme.colors.accentPrimary }]}
          >
            <Text variant="bodyMd" color="inverse">
              {analytics.todayTotal > 0 ? t('tasbih.continue') : t('tasbih.start')} →
            </Text>
          </Pressable>
        </Card>

        <TasbihGoalProgress
          current={analytics.todayTotal}
          goal={goalTotal}
          cycles={analytics.todayCycles}
        />

        <TasbihStreakBadge
          current={analytics.currentStreak}
          longest={analytics.longestStreak}
        />

        <TasbihAnalyticsChart days={analytics.last7Days} goalTotal={goalTotal} />

        <View style={styles.statsGrid}>
          <StatBox label={t('tasbih.analytics.avg7')} value={String(analytics.averageDaily7)} />
          <StatBox label={t('tasbih.analytics.total30')} value={String(analytics.last30DaysTotal)} />
        </View>

        <View style={styles.section}>
          <Text variant="overline" color="secondary">
            {t('tasbih.dailyGoal')}
          </Text>
          <View style={styles.goalRow}>
            {GOAL_CYCLE_OPTIONS.map((cycles) => {
              const active = dailyGoalCycles === cycles;
              return (
                <Pressable
                  key={cycles}
                  onPress={() => setDailyGoalCycles(cycles)}
                  style={[
                    styles.goalChip,
                    {
                      backgroundColor: active
                        ? theme.colors.accentPrimaryMuted
                        : theme.colors.surfaceMuted,
                      borderColor: active ? theme.colors.accentPrimary : theme.colors.borderSubtle,
                    },
                  ]}
                >
                  <Text variant="caption" color={active ? 'accent' : 'secondary'}>
                    {cycles}× ({cycles * CYCLE_TOTAL})
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="overline" color="secondary">
            {t('tasbih.settings.title')}
          </Text>
          <Pressable
            onPress={() => setHapticsEnabled(!hapticsEnabled)}
            style={[styles.settingRow, { borderColor: theme.colors.borderSubtle }]}
          >
            <Text variant="bodyMd">{t('tasbih.settings.haptics')}</Text>
            <Text variant="bodySm" color={hapticsEnabled ? 'accent' : 'tertiary'}>
              {hapticsEnabled ? t('tasbih.settings.on') : t('tasbih.settings.off')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.statBox, { backgroundColor: theme.colors.surfaceMuted }]}>
      <Text variant="headingSm" color="accent">
        {value}
      </Text>
      <Text variant="caption" color="tertiary">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 16,
    paddingBottom: 40,
    gap: 20,
  },
  heroCard: {
    gap: 10,
  },
  startBtn: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    gap: 4,
    alignItems: 'center',
  },
  section: {
    gap: 10,
  },
  goalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
});
