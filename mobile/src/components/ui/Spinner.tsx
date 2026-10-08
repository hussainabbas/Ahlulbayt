import { ActivityIndicator, StyleSheet, View, type ActivityIndicatorProps } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';

interface SpinnerProps extends Pick<ActivityIndicatorProps, 'size'> {
  label?: string;
  centered?: boolean;
  color?: string;
}

export function Spinner({ size = 'small', label, centered = false, color }: SpinnerProps) {
  const { theme } = useTheme();
  const indicatorColor = color ?? theme.colors.accentPrimary;

  const content = (
    <View style={[styles.row, centered && styles.centered]}>
      <ActivityIndicator size={size} color={indicatorColor} />
      {label ? (
        <Text variant="bodySm" color="secondary">
          {label}
        </Text>
      ) : null}
    </View>
  );

  if (centered) {
    return <View style={styles.centeredWrap}>{content}</View>;
  }

  return content;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  centered: {
    justifyContent: 'center',
  },
  centeredWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
});
