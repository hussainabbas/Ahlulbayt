import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { HijriDate } from '../../types';

interface IslamicDateWidgetProps {
  hijri: HijriDate;
  gregorian: string;
}

export function IslamicDateWidget({ hijri, gregorian }: IslamicDateWidgetProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      <Text variant="label" color="secondary">
        {gregorian}
      </Text>
      <Text variant="headingMd" style={styles.hijri} numberOfLines={3}>
        {hijri.formatted}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 100,
    padding: layout.blockGap + 4,
    justifyContent: 'space-between',
  },
  hijri: {
    marginTop: 4,
  },
});
