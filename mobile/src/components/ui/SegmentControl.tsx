import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

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
  /** Allow horizontal scroll when labels overflow (default: auto when >4 options). */
  scrollable?: boolean;
}

export function SegmentControl<T extends string>({
  options,
  value,
  onChange,
  scrollable = options.length > 4,
}: SegmentControlProps<T>) {
  const { theme } = useTheme();

  const tabs = options.map((option) => {
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
          <View style={[styles.indicator, { backgroundColor: theme.colors.accentPrimary }]} />
        ) : (
          <View style={styles.indicatorPlaceholder} />
        )}
      </Pressable>
    );
  });

  const borderStyle = { borderBottomColor: theme.colors.borderSubtle };

  if (scrollable) {
    return (
      <View style={[styles.container, borderStyle]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {tabs}
        </ScrollView>
      </View>
    );
  }

  return <View style={[styles.row, borderStyle]}>{tabs}</View>;
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: layout.blockGap,
  },
  scrollContent: {
    flexDirection: 'row',
    gap: layout.blockGap,
    paddingRight: layout.blockGap,
  },
  row: {
    flexDirection: 'row',
    gap: layout.blockGap,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: layout.blockGap,
  },
  tab: {
    paddingBottom: layout.listGap,
    minWidth: 72,
    paddingHorizontal: 2,
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
