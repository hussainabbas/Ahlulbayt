import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

export function AiDisclaimerBanner() {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View style={[styles.banner, { backgroundColor: theme.colors.surfaceMuted, borderRadius: theme.radius.md }]}>
      <Text variant="caption" color="secondary" style={{ lineHeight: 18 }}>
        {t('ai.disclaimer')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    padding: 12,
    marginBottom: 8,
  },
});
