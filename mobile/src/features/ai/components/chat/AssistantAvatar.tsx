import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

export function AssistantAvatar() {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.colors.accentPrimaryMuted,
          borderColor: theme.colors.borderSubtle,
        },
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={[styles.bar, { backgroundColor: theme.colors.accentGold }]} />
      <Text variant="caption" color="accent" weight="600">
        AB
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: 2,
  },
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
});
