import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/ui/Skeleton';
import { useTheme } from '@/theme/ThemeContext';

export function WeatherSkeleton() {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.weather,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      <Skeleton width="40%" height={10} borderRadius={4} />
      <View style={styles.weatherRow}>
        <Skeleton width={36} height={36} borderRadius={18} />
        <View style={styles.weatherMeta}>
          <Skeleton width={48} height={22} borderRadius={6} />
          <Skeleton width={72} height={10} borderRadius={4} />
        </View>
      </View>
    </View>
  );
}

export function MetricGridSkeleton({ count = 6 }: { count?: number }) {
  const { theme } = useTheme();

  return (
    <View style={styles.metricGrid}>
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={[
            styles.metricCard,
            {
              backgroundColor: theme.colors.surfaceMuted,
              borderColor: theme.colors.borderSubtle,
            },
          ]}
        >
          <Skeleton width="60%" height={10} borderRadius={4} />
          <Skeleton width="40%" height={20} borderRadius={6} style={{ marginTop: 8 }} />
        </View>
      ))}
    </View>
  );
}

export function BreakdownSkeleton({ rows = 5 }: { rows?: number }) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.breakdown,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.md,
        },
      ]}
    >
      <Skeleton width="50%" height={14} borderRadius={4} style={{ marginBottom: 16 }} />
      {Array.from({ length: rows }, (_, i) => (
        <View key={i} style={styles.breakdownRow}>
          <Skeleton width="35%" height={12} borderRadius={4} />
          <Skeleton width={24} height={12} borderRadius={4} />
        </View>
      ))}
    </View>
  );
}

export function PlanCardSkeleton() {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.planCard,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.md,
        },
      ]}
    >
      <Skeleton width="45%" height={16} borderRadius={6} />
      <Skeleton width="30%" height={12} borderRadius={4} style={{ marginTop: 8 }} />
      <Skeleton width="55%" height={10} borderRadius={4} style={{ marginTop: 12 }} />
    </View>
  );
}

export function ListRowSkeleton({ rows = 6 }: { rows?: number }) {
  const { theme } = useTheme();

  return (
    <View style={styles.listRows}>
      {Array.from({ length: rows }, (_, i) => (
        <View
          key={i}
          style={[styles.listRow, { borderBottomColor: theme.colors.borderSubtle }]}
        >
          <Skeleton width={32} height={32} borderRadius={16} />
          <View style={styles.listRowBody}>
            <Skeleton width="70%" height={14} borderRadius={4} />
            <Skeleton width="45%" height={10} borderRadius={4} style={{ marginTop: 8 }} />
          </View>
        </View>
      ))}
    </View>
  );
}

export function SearchResultSkeleton({ rows = 5 }: { rows?: number }) {
  return <ListRowSkeleton rows={rows} />;
}

export function BootstrapSkeleton() {
  const { theme } = useTheme();

  return (
    <View style={[styles.bootstrap, { backgroundColor: theme.colors.backgroundPrimary }]}>
      <Skeleton width={120} height={14} borderRadius={6} style={{ marginBottom: 12 }} />
      <Skeleton width="75%" height={28} borderRadius={8} style={{ marginBottom: 28 }} />
      <View style={styles.bootstrapRow}>
        <View
          style={[
            styles.bootstrapMini,
            { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.borderSubtle },
          ]}
        >
          <Skeleton width="50%" height={10} borderRadius={4} />
          <Skeleton width="60%" height={18} borderRadius={6} style={{ marginTop: 12 }} />
        </View>
        <WeatherSkeleton />
      </View>
      <Skeleton width="100%" height={120} borderRadius={theme.radius.lg} style={{ marginTop: 20 }} />
      <Skeleton width="100%" height={88} borderRadius={theme.radius.lg} style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  weather: {
    flex: 1,
    borderWidth: 1,
    padding: 16,
    minHeight: 100,
    justifyContent: 'space-between',
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  weatherMeta: {
    gap: 6,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  breakdown: {
    marginTop: 24,
    padding: 16,
    borderWidth: 1,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  planCard: {
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  listRows: {
    gap: 0,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  listRowBody: {
    flex: 1,
  },
  bootstrap: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  bootstrapRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bootstrapMini: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    minHeight: 100,
  },
});
