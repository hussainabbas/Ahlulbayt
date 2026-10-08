import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { TasbihPhase } from '../types';

interface TasbihPhaseIndicatorProps {
  phases: TasbihPhase[];
  activeIndex: number;
  phaseCounts: number[];
}

function phaseShortLabel(phase: TasbihPhase, locale: string): string {
  if (locale === 'ar') return phase.labels.ar;
  if (locale === 'ur') return phase.labels.ur;
  return phase.transliteration;
}

export function TasbihPhaseIndicator({
  phases,
  activeIndex,
  phaseCounts,
}: TasbihPhaseIndicatorProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.track,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
        },
      ]}
    >
      {phases.map((phase, index) => {
        const active = index === activeIndex;
        const done = index < activeIndex || phaseCounts[index]! >= phase.target;
        const count = phaseCounts[index] ?? 0;
        const isLast = index === phases.length - 1;

        return (
          <View
            key={phase.id}
            style={[
              styles.segment,
              !isLast && {
                borderRightWidth: StyleSheet.hairlineWidth,
                borderRightColor: theme.colors.borderSubtle,
              },
              active && { backgroundColor: theme.colors.accentPrimaryMuted },
              done && !active && { backgroundColor: theme.colors.surfaceMuted },
            ]}
          >
            <View style={styles.segmentTop}>
              <View
                style={[
                  styles.stepDot,
                  {
                    backgroundColor: done
                      ? theme.colors.accentPrimary
                      : active
                        ? theme.colors.accentPrimary
                        : theme.colors.borderStrong,
                  },
                ]}
              />
              <Text
                variant="caption"
                weight="600"
                color={active || done ? 'accent' : 'secondary'}
              >
                {count}/{phase.target}
              </Text>
            </View>
            <Text
              variant="caption"
              color={active ? 'accent' : done ? 'secondary' : 'tertiary'}
              numberOfLines={2}
              style={styles.segmentLabel}
            >
              {phaseShortLabel(phase, locale)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: layout.blockGap,
    gap: layout.listGap,
    minHeight: 72,
  },
  segmentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  segmentLabel: {
    textAlign: 'center',
    lineHeight: 16,
  },
});
