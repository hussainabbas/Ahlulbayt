import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

interface TasbihStreakBadgeProps {
  current: number;
  longest: number;
  compact?: boolean;
}

export function TasbihStreakBadge({ current, longest, compact }: TasbihStreakBadgeProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.badge,
        compact && styles.compact,
        {
          backgroundColor: theme.colors.accentPrimaryMuted,
          borderColor: theme.colors.accentPrimary,
        },
      ]}
    >
      <Text variant="displayMd" color="accent">
        {current}
      </Text>
      <View style={styles.text}>
        <Text variant="caption" color="accent">
          {t('tasbih.streak.current')}
        </Text>
        {!compact ? (
          <Text variant="caption" color="tertiary">
            {t('tasbih.streak.best', { count: longest })}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  compact: {
    padding: 12,
    gap: 8,
  },
  text: {
    gap: 2,
  },
});
