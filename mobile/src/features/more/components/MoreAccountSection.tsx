import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

interface MoreAccountSectionProps {
  isGuest: boolean;
  onSignOut: () => void;
}

export function MoreAccountSection({ isGuest, onSignOut }: MoreAccountSectionProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View style={styles.wrap}>
      <Text variant="overline" color="secondary">
        {t('more.sections.account')}
      </Text>
      <Pressable
        onPress={onSignOut}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.signOutBtn,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.error,
            opacity: pressed ? 0.88 : 1,
          },
        ]}
      >
        <Text variant="bodyMd" weight="600" style={{ color: theme.colors.error }}>
          {isGuest ? t('more.exitGuest') : t('more.signOut')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
  },
  signOutBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
