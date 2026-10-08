import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({ title, subtitle, actionLabel, onAction, style }: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.rule, { backgroundColor: theme.colors.accentGold }]} />
      <Text variant="headingSm" style={styles.title}>
        {title}
      </Text>
      {subtitle ? (
        <Text variant="bodySm" color="secondary" style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} variant="secondary" onPress={onAction} style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: layout.sectionGap,
    paddingHorizontal: layout.screenPaddingX,
    gap: layout.listGap,
  },
  rule: {
    width: 32,
    height: 2,
    borderRadius: 1,
    marginBottom: layout.blockGap,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  action: {
    marginTop: layout.blockGap,
    minWidth: 160,
  },
});
