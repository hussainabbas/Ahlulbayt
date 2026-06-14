import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

interface ReferenceUnavailableBannerProps {
  compact?: boolean;
}

export function ReferenceUnavailableBanner({ compact }: ReferenceUnavailableBannerProps) {
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
    >
      <Text variant={compact ? 'caption' : 'bodySm'} color="secondary">
        {t('references.unavailable')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    padding: layout.blockGap,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  compact: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
});
