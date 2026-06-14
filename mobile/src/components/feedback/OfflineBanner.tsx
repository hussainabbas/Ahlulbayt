import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

import { useLocale } from '@/i18n/useLocale';
import { useAppStore } from '@/stores/appStore';
import { useTheme } from '@/theme/ThemeContext';

import { Text } from '../ui/Text';

export function OfflineBanner() {
  const isOnline = useAppStore((s) => s.isOnline);
  const { t } = useLocale();
  const { theme } = useTheme();

  if (isOnline) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInUp.duration(200)}
      exiting={FadeOutUp.duration(200)}
      style={[styles.banner, { backgroundColor: theme.colors.surfaceMuted }]}
    >
      <View style={styles.content}>
        <Text variant="bodySm" weight="600">
          {t('common.offline')}
        </Text>
        <Text variant="caption" color="secondary">
          {t('common.offlineHint')}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  content: {
    gap: 2,
  },
});
