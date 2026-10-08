import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { GuideDifficulty } from '../types';

interface DifficultyToggleProps {
  value: GuideDifficulty;
  onChange: (value: GuideDifficulty) => void;
}

export function DifficultyToggle({ value, onChange }: DifficultyToggleProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View style={[styles.track, { backgroundColor: theme.colors.surfaceMuted }]}>
      {(['beginner', 'advanced'] as const).map((level) => {
        const active = value === level;
        return (
          <Pressable
            key={level}
            onPress={() => onChange(level)}
            style={[
              styles.segment,
              active && { backgroundColor: theme.colors.surfaceElevated },
            ]}
          >
            <Text variant="caption" weight={active ? '600' : '400'} color={active ? 'accent' : 'secondary'}>
              {t(`prayerAcademy.difficulty.${level}`)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: 999,
    padding: 3,
    gap: 2,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: layout.listGap,
    borderRadius: 999,
  },
});
