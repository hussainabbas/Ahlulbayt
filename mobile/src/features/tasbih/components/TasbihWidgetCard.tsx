import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { CYCLE_TOTAL } from '../constants/fatimaZahra';
import { useTasbihAnalytics } from '../hooks/useTasbihSession';
import { useTasbihStore } from '../stores/tasbihStore';

interface TasbihWidgetCardProps {
  onPress: () => void;
  onContinue?: () => void;
}

export function TasbihWidgetCard({ onPress, onContinue }: TasbihWidgetCardProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const analytics = useTasbihAnalytics();
  const dailyGoalCycles = useTasbihStore((s) => s.settings.dailyGoalCycles);
  const goalTotal = dailyGoalCycles * CYCLE_TOTAL;

  const actionLabel =
    analytics.todayTotal > 0 ? t('tasbih.widget.continue') : t('tasbih.widget.start');

  return (
    <Pressable
      onPress={onContinue ?? onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: theme.colors.accentPrimary }]} />
      <View style={styles.body}>
        <View style={styles.header}>
          <Text variant="overline" color="secondary">
            {t('tasbih.widget.title')}
          </Text>
          <Pressable onPress={onPress} hitSlop={8}>
            <Text variant="caption" color="accent">
              {t('tasbih.widget.details')}
            </Text>
          </Pressable>
        </View>

        <Text variant="headingSm">{t('tasbih.fatimaZahra.title')}</Text>

        <View style={styles.stats}>
          <View>
            <Text variant="displayMd" color="accent">
              {analytics.todayTotal}
            </Text>
            <Text variant="caption" color="tertiary">
              / {goalTotal} {t('tasbih.today')}
            </Text>
          </View>
          <View style={styles.streak}>
            <Text variant="headingSm" color="accent">
              🔥 {analytics.currentStreak}
            </Text>
            <Text variant="caption" color="tertiary">
              {t('tasbih.streak.current')}
            </Text>
          </View>
        </View>

        <View style={[styles.track, { backgroundColor: theme.colors.surfaceMuted }]}>
          <View
            style={[
              styles.fill,
              {
                width: `${analytics.goalProgress * 100}%`,
                backgroundColor: theme.colors.accentPrimary,
              },
            ]}
          />
        </View>

        <Text variant="caption" color="accent">
          {actionLabel} →
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  accent: {
    width: 4,
  },
  body: {
    flex: 1,
    padding: 20,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  streak: {
    alignItems: 'flex-end',
    gap: 2,
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
});
