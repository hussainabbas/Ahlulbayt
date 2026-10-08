import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';

interface DailyLifeSectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function DailyLifeSectionHeader({ title, subtitle }: DailyLifeSectionHeaderProps) {
  return (
    <View style={styles.wrap}>
      <Text variant="overline" color="secondary">
        {title}
      </Text>
      {subtitle ? (
        <Text variant="caption" color="tertiary">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 2,
  },
});
