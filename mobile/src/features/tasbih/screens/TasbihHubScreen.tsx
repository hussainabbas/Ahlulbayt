import { useLayoutEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { layout } from '@/theme/layout';
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
  const insets = useSafeAreaInsets();
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
      headerShadowVisible: false,
    });
  }, [navigation, t, theme]);

  return (
    <Screen padded={false} safeTop={false} safeBottom={false}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: layout.screenPaddingX,
            paddingBottom: insets.bottom + layout.blockGap,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="bodySm" color="secondary" style={styles.subtitle}>
          {t('tasbih.subtitle')}
        </Text>

        <Card padded={false} style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={[styles.heroAccent, { backgroundColor: theme.colors.accentPrimary }]} />
            <View style={styles.heroBody}>
              <Text variant="headingSm">{t('tasbih.fatimaZahra.title')}</Text>
              <Text variant="bodySm" color="secondary">
                {t('tasbih.fatimaZahra.description')}
              </Text>
              <Text variant="caption" color="tertiary">
                34 + 33 + 33 = {CYCLE_TOTAL}
              </Text>
              <Button
                label={
                  analytics.todayTotal > 0
                    ? `${t('tasbih.continue')} →`
                    : `${t('tasbih.start')} →`
                }
                size="lg"
                onPress={() => navigation.navigate('TasbihCounter')}
                style={styles.startBtn}
              />
            </View>
          </View>
        </Card>

        <Card variant="inset" style={styles.analyticsCard}>
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
            <StatBox
              label={t('tasbih.analytics.total30')}
              value={String(analytics.last30DaysTotal)}
            />
          </View>
        </Card>

        <Card variant="inset" style={styles.section}>
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
                        : theme.colors.surfaceElevated,
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
        </Card>

        <Card padded={false}>
          <View style={[styles.settingRow, { borderBottomColor: theme.colors.borderSubtle }]}>
            <View style={styles.settingText}>
              <Text variant="overline" color="secondary">
                {t('tasbih.settings.title')}
              </Text>
              <Text variant="bodyMd">{t('tasbih.settings.haptics')}</Text>
            </View>
            <Switch
              value={hapticsEnabled}
              onValueChange={setHapticsEnabled}
              trackColor={{ true: theme.colors.accentPrimary, false: theme.colors.surfaceMuted }}
              thumbColor={theme.colors.surfaceElevated}
            />
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.statBox,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
        },
      ]}
    >
      <Text variant="headingSm" color="accent">
        {value}
      </Text>
      <Text variant="caption" color="tertiary" style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: layout.listGap,
    gap: layout.sectionGap,
  },
  subtitle: {
    maxWidth: '92%',
  },
  heroCard: {
    overflow: 'hidden',
  },
  heroRow: {
    flexDirection: 'row',
  },
  heroAccent: {
    width: 4,
  },
  heroBody: {
    flex: 1,
    padding: layout.screenPaddingX,
    gap: layout.blockGap,
  },
  startBtn: {
    marginTop: layout.listGap,
  },
  analyticsCard: {
    gap: layout.sectionGap,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: layout.blockGap,
  },
  statBox: {
    flex: 1,
    padding: layout.blockGap,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    gap: layout.listGap,
  },
  statLabel: {
    textAlign: 'center',
  },
  section: {
    gap: layout.blockGap,
  },
  goalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: layout.listGap,
  },
  goalChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingX,
    paddingVertical: layout.blockGap + 2,
    minHeight: layout.listRowMinHeight,
  },
  settingText: {
    flex: 1,
    gap: layout.listGap,
    paddingRight: layout.blockGap,
  },
});
