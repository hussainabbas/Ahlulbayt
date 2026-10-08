import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

export function FiqhDisclaimerBanner() {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: theme.colors.surfaceMuted,
          borderColor: theme.colors.borderSubtle,
        },
      ]}
    >
      <Text variant="caption" weight="600" color="secondary">
        {t('fasting.calculators.unverifiedTitle')}
      </Text>
      <Text variant="caption" color="tertiary">
        {t('fasting.calculators.disclaimer')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    padding: layout.blockGap,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 6,
  },
});
