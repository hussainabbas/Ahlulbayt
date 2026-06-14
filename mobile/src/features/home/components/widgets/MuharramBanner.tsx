import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useRootNavigation } from '@/navigation/hooks';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { HijriDate } from '../../types';

interface MuharramBannerProps {
  hijri: HijriDate;
}

export function MuharramBanner({ hijri }: MuharramBannerProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const rootNavigation = useRootNavigation();

  const isAshura = hijri.isAshuraPeriod && hijri.day <= 10;
  const daysLeft = hijri.daysUntilAshura;

  return (
    <Pressable
      onPress={() => rootNavigation.navigate('MuharramMode')}
      style={({ pressed }) => [
        styles.wrapper,
        {
          backgroundColor: theme.isMuharram
            ? theme.colors.surfaceElevated
            : theme.colors.backgroundSecondary,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: theme.colors.accentGold }]} />
      <View style={styles.body}>
        <Text variant="label" color="secondary">
          {t('home.muharram.label')}
        </Text>
        <Text variant="headingMd" style={styles.title}>
          {isAshura
            ? t('home.muharram.ashuraTitle')
            : daysLeft != null && daysLeft > 0
              ? t('home.muharram.countdown', { days: daysLeft })
              : t('home.muharram.title')}
        </Text>
        <Text variant="bodySm" color="secondary" style={styles.subtitle}>
          {t('home.muharram.subtitle')}
        </Text>
        <View style={styles.actionRow}>
          <Text variant="caption" color="accent">
            {t('home.muharram.enterMode')}
          </Text>
          <Icon name="chevron" size={14} color={theme.colors.accentPrimary} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  accent: {
    width: 3,
  },
  body: {
    flex: 1,
    padding: layout.screenPaddingX,
    gap: layout.listGap,
  },
  title: {
    marginTop: 2,
  },
  subtitle: {
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: layout.listGap,
  },
});
