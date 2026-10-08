import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import type { MainTabParamList } from '@/navigation/types';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { getShadow } from '@/theme/shadows';
import { useTheme } from '@/theme/ThemeContext';

import { QiblaCompassMini } from '@/features/qibla/components/QiblaCompassMini';
import {
  formatQiblaBearing,
  formatQiblaDistance,
  useQiblaPreview,
} from '@/features/qibla/hooks/useQiblaPreview';

export function QiblaWidget() {
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const { bearing, distanceKm } = useQiblaPreview();

  const openQibla = () => navigation.navigate('Qibla');

  return (
    <Pressable
      onPress={openQibla}
      style={({ pressed }) => [
        styles.wrapper,
        getShadow('sm', theme.scheme),
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
          opacity: pressed ? 0.94 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={t('home.qibla.open')}
    >
      <View style={[styles.accent, { backgroundColor: theme.colors.accentGold }]} />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.titleRow}>
            <Text variant="label" color="secondary">
              {t('home.qibla.title')}
            </Text>
            <View
              style={[
                styles.offlinePill,
                { backgroundColor: theme.colors.accentPrimaryMuted },
              ]}
            >
              <Text variant="caption" color="accent">
                {t('qibla.offline')}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={openQibla}
            style={({ pressed }) => [
              styles.cta,
              {
                backgroundColor: theme.colors.accentPrimaryMuted,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            hitSlop={8}
          >
            <Text variant="bodySm" color="accent">
              {t('home.qibla.open')}
            </Text>
            <Icon name="chevron" size={14} color={theme.colors.accentPrimary} />
          </Pressable>
        </View>

        <View style={styles.bodyRow}>
          <View style={styles.stats}>
            <View style={styles.statBlock}>
              <Text variant="caption" color="secondary">
                {t('qibla.info.bearing')}
              </Text>
              <Text variant="displayMd" color="primary">
                {formatQiblaBearing(bearing)}
              </Text>
            </View>
            <View style={styles.statBlock}>
              <Text variant="caption" color="secondary">
                {t('qibla.info.distance')}
              </Text>
              <Text variant="headingSm">
                {formatQiblaDistance(distanceKm, locale)}
              </Text>
            </View>
          </View>
          <QiblaCompassMini bearing={bearing} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  accent: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: layout.screenPaddingX,
    gap: layout.blockGap,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  offlinePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  stats: {
    flex: 1,
    gap: layout.blockGap,
  },
  statBlock: {
    gap: 2,
  },
});
