import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { TasbihPhase } from '../types';

interface TasbihPhaseIndicatorProps {
  phases: TasbihPhase[];
  activeIndex: number;
  phaseCounts: number[];
}

export function TasbihPhaseIndicator({
  phases,
  activeIndex,
  phaseCounts,
}: TasbihPhaseIndicatorProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();

  return (
    <View style={styles.row}>
      {phases.map((phase, index) => {
        const active = index === activeIndex;
        const done = index < activeIndex || phaseCounts[index]! >= phase.target;
        const count = phaseCounts[index] ?? 0;

        const label =
          locale === 'ur' ? phase.labels.ur : locale === 'ar' ? phase.labels.ar : phase.labels.en;

        return (
          <View
            key={phase.id}
            style={[
              styles.chip,
              {
                backgroundColor: active
                  ? theme.colors.accentPrimaryMuted
                  : done
                    ? theme.colors.surfaceMuted
                    : 'transparent',
                borderColor: active ? theme.colors.accentPrimary : theme.colors.borderSubtle,
              },
            ]}
          >
            <Text variant="caption" color={active ? 'accent' : done ? 'secondary' : 'tertiary'}>
              {count}/{phase.target}
            </Text>
            <Text
              variant="caption"
              color={active ? 'accent' : 'tertiary'}
              numberOfLines={1}
              style={styles.chipLabel}
            >
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 90,
    gap: 2,
  },
  chipLabel: {
    maxWidth: 100,
    textAlign: 'center',
  },
});
