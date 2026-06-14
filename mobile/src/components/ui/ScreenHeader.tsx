import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Text } from '@/components/ui/Text';
import { layout } from '@/theme/layout';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}

export function ScreenHeader({ title, subtitle, style }: ScreenHeaderProps) {
  return (
    <View style={[styles.root, style]}>
      <Text variant="displayMd">{title}</Text>
      {subtitle ? (
        <Text variant="bodySm" color="secondary" style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: layout.listGap,
    marginBottom: layout.sectionGap,
  },
  subtitle: {
    maxWidth: '92%',
  },
});
