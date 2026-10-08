import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

interface UnverifiedDisclaimerProps {
  compact?: boolean;
  messageKey?: string;
}

export function UnverifiedDisclaimer({
  compact,
  messageKey = 'citations.unverifiedDisclaimer',
}: UnverifiedDisclaimerProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.banner,
        compact ? styles.compact : null,
        {
          backgroundColor: theme.colors.surfaceMuted,
          borderColor: theme.colors.borderSubtle,
        },
      ]}
      accessibilityRole="text"
    >
      <Icon name="book" size={compact ? 14 : 16} color={theme.colors.textTertiary} />
      <Text variant={compact ? 'caption' : 'bodySm'} color="tertiary" style={styles.text}>
        {t(messageKey)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: layout.listGap,
    padding: layout.blockGap,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  compact: {
    padding: 10,
  },
  text: {
    flex: 1,
    lineHeight: 20,
  },
});
