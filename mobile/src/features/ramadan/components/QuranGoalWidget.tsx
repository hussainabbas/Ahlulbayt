import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { useQuranGoalStore } from '../stores/quranGoalStore';

interface QuranGoalWidgetProps {
  onOpenHub?: () => void;
}

export function QuranGoalWidget({ onOpenHub }: QuranGoalWidgetProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const unit = useQuranGoalStore((s) => s.unit);
  const dailyTarget = useQuranGoalStore((s) => s.dailyTarget);
  const todayProgress = useQuranGoalStore((s) => s.todayProgress);
  const incrementProgress = useQuranGoalStore((s) => s.incrementProgress);
  const progressPercent = useQuranGoalStore((s) => s.progressPercent);

  const pct = progressPercent();

  return (
    <Pressable
      onPress={onOpenHub}
      style={[
        styles.root,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: theme.colors.accentPrimary }]} />
      <View style={styles.body}>
        <Text variant="label" color="secondary">
          {t('home.ramadan.quranGoal')}
        </Text>
        <Text variant="headingMd">
          {todayProgress} / {dailyTarget} {t(`ramadanMode.quranUnit.${unit}`)}
        </Text>
        <View style={[styles.track, { backgroundColor: theme.colors.backgroundSecondary }]}>
          <View
            style={[
              styles.fill,
              { width: `${pct}%`, backgroundColor: theme.colors.accentPrimary },
            ]}
          />
        </View>
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            incrementProgress(1);
          }}
          style={[styles.btn, { backgroundColor: theme.colors.accentPrimaryMuted }]}
        >
          <Text variant="caption" color="accent">
            +1 {t(`ramadanMode.quranUnit.${unit}`)}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  accent: { width: 3 },
  body: {
    flex: 1,
    padding: layout.screenPaddingX,
    gap: layout.listGap,
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
  btn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
