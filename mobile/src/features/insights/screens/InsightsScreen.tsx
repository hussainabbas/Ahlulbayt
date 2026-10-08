import { StyleSheet, View } from 'react-native';

import { BreakdownSkeleton, MetricGridSkeleton } from '@/components/feedback/skeletonPresets';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';
import { useAuthStore } from '@/stores/authStore';

import { useUserInsights, useInsightsSource } from '../hooks/useUserInsights';

export function InsightsScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data, isLoading, isFetching, refetch } = useUserInsights(30);
  const { isLocalOnly } = useInsightsSource();

  if (!isAuthenticated) {
    return (
      <Screen>
        <Text variant="displayMd">{t('insights.title')}</Text>
        <Text variant="bodyMd" color="secondary" style={styles.subtitle}>
          {t('insights.signInRequired')}
        </Text>
      </Screen>
    );
  }

  const showSkeleton = isLoading && !data;

  return (
    <Screen
      scroll
      refreshing={isFetching && !isLoading}
      onRefresh={() => void refetch()}
    >
      <Text variant="displayMd">{t('insights.title')}</Text>
      <Text variant="bodySm" color="secondary" style={styles.subtitle}>
        {isLocalOnly ? t('insights.localSubtitle', { days: 30 }) : t('insights.subtitle', { days: 30 })}
      </Text>
      {isLocalOnly ? (
        <Text variant="caption" color="tertiary" style={styles.localNote}>
          {t('insights.localOnly')}
        </Text>
      ) : null}

      {showSkeleton ? (
        <>
          <MetricGridSkeleton />
          <BreakdownSkeleton />
        </>
      ) : data ? (
        <>
          <View style={styles.grid}>
            <MetricCard
              label={t('insights.sessions')}
              value={String(data.engagement.sessionCount)}
              theme={theme}
            />
            <MetricCard
              label={t('insights.prayerRate')}
              value={`${data.prayer.completionRate}%`}
              theme={theme}
            />
            <MetricCard
              label={t('insights.prayersDone')}
              value={String(data.prayer.totalCompleted)}
              theme={theme}
            />
            <MetricCard
              label={t('insights.ayahsRead')}
              value={String(data.reading.ayahsRead)}
              theme={theme}
            />
            <MetricCard
              label={t('insights.readingMinutes')}
              value={String(data.reading.minutes)}
              theme={theme}
            />
          </View>

          <Card style={styles.section}>
            <Text variant="headingSm" style={styles.sectionTitle}>
              {t('insights.prayerBreakdown')}
            </Text>
            {data.prayer.byPrayer.map((row) => (
              <View key={row.prayer} style={styles.breakdownRow}>
                <Text variant="bodyMd">{t(`prayer.${row.prayer}`)}</Text>
                <Text variant="bodyMd" color="accent">
                  {row.count}
                </Text>
              </View>
            ))}
          </Card>
        </>
      ) : null}
    </Screen>
  );
}

function MetricCard({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: ReturnType<typeof useTheme>['theme'];
}) {
  return (
    <View
      style={[
        styles.metric,
        { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.borderSubtle },
      ]}
    >
      <Text variant="caption" color="secondary">
        {label}
      </Text>
      <Text variant="headingMd">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    marginTop: 6,
    marginBottom: 8,
  },
  localNote: {
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metric: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
});
