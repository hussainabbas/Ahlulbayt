import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentControlProps<T>) {
  const { theme } = useTheme();

  return (
    <View style={[styles.row, { borderBottomColor: theme.colors.borderSubtle }]}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={styles.tab}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Text
              variant="bodySm"
              color={active ? 'accent' : 'secondary'}
              weight={active ? '600' : '400'}
            >
              {option.label}
            </Text>
            {active ? (
              <View
                style={[styles.indicator, { backgroundColor: theme.colors.accentPrimary }]}
              />
            ) : (
              <View style={styles.indicatorPlaceholder} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: layout.blockGap,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: layout.blockGap,
  },
  tab: {
    paddingBottom: layout.listGap,
    minWidth: 72,
  },
  indicator: {
    height: 2,
    borderRadius: 1,
    marginTop: layout.listGap,
  },
  indicatorPlaceholder: {
    height: 2,
    marginTop: layout.listGap,
  },
});
