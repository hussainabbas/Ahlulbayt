import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';

interface SelectionCardProps {
  title: string;
  subtitle?: string;
  selected: boolean;
  onPress: () => void;
  leading?: React.ReactNode;
  accessibilityLabel?: string;
}

export function SelectionCard({
  title,
  subtitle,
  selected,
  onPress,
  leading,
  accessibilityLabel,
}: SelectionCardProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel ?? title}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: selected
            ? theme.colors.accentPrimaryMuted
            : theme.colors.surfaceElevated,
          borderColor: selected ? theme.colors.accentPrimary : theme.colors.borderSubtle,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={styles.textBlock}>
        <Text variant="headingSm" color={selected ? 'accent' : 'primary'}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="bodySm" color="secondary" style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View
        style={[
          styles.radio,
          {
            borderColor: selected ? theme.colors.accentPrimary : theme.colors.borderStrong,
          },
        ]}
      >
        {selected ? (
          <View style={[styles.radioDot, { backgroundColor: theme.colors.accentPrimary }]} />
        ) : null}
      </View>
    </Pressable>
  );
}

interface InterestChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function InterestChip({ label, selected, onPress }: InterestChipProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected
            ? theme.colors.accentPrimaryMuted
            : theme.colors.surfaceElevated,
          borderColor: selected ? theme.colors.accentPrimary : theme.colors.borderSubtle,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <Text variant="bodySm" weight={selected ? '600' : '400'} color={selected ? 'accent' : 'primary'}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    minHeight: 72,
    gap: 12,
  },
  leading: {
    width: 40,
    alignItems: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  subtitle: {
    lineHeight: 18,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 9999,
    borderWidth: 1,
  },
});
