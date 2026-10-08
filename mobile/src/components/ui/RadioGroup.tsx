import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

export interface RadioOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface RadioGroupProps<T extends string> {
  options: RadioOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function RadioGroup<T extends string>({ options, value, onChange }: RadioGroupProps<T>) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.group,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      {options.map((option, index) => {
        const selected = option.value === value;
        const isLast = index === options.length - 1;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={({ pressed }) => [
              styles.row,
              !isLast && {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: theme.colors.borderSubtle,
              },
              pressed && { backgroundColor: theme.colors.surfaceMuted },
              selected && { backgroundColor: theme.colors.accentPrimaryMuted },
            ]}
          >
            <View style={styles.labelWrap}>
              <Text variant="bodyMd" weight={selected ? '600' : '400'} color={selected ? 'accent' : 'primary'}>
                {option.label}
              </Text>
              {option.description ? (
                <Text variant="caption" color="secondary">
                  {option.description}
                </Text>
              ) : null}
            </View>
            <View
              style={[
                styles.radioOuter,
                {
                  borderColor: selected ? theme.colors.accentPrimary : theme.colors.borderStrong,
                },
              ]}
            >
              {selected ? (
                <View style={[styles.radioInner, { backgroundColor: theme.colors.accentPrimary }]} />
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: layout.blockGap,
    paddingHorizontal: layout.listRowPaddingX,
    paddingVertical: layout.blockGap + 2,
    minHeight: layout.listRowMinHeight,
  },
  labelWrap: {
    flex: 1,
    gap: 2,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
