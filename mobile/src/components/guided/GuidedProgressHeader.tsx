import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

interface GuidedProgressHeaderProps {
  modeLabel: string;
  onModePress?: () => void;
  current: number;
  total: number;
}

export function GuidedProgressHeader({
  modeLabel,
  onModePress,
  current,
  total,
}: GuidedProgressHeaderProps) {
  const { theme } = useTheme();
  const progress = total > 0 ? current / total : 0;

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onModePress}
        disabled={!onModePress}
        style={({ pressed }) => [
          styles.modeChip,
          {
            backgroundColor: theme.colors.accentPrimaryMuted,
            opacity: onModePress && pressed ? 0.85 : 1,
          },
        ]}
      >
        <Text variant="caption" color="accent" weight="600">
          {modeLabel}
        </Text>
      </Pressable>

      <View style={[styles.track, { backgroundColor: theme.colors.surfaceMuted }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${Math.max(progress * 100, 4)}%`,
              backgroundColor: theme.colors.accentPrimary,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: layout.screenPaddingX,
    paddingVertical: 10,
    gap: 10,
  },
  modeChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
});
