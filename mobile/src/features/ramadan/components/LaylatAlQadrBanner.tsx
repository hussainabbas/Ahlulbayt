import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

interface LaylatAlQadrBannerProps {
  hijriDay: number;
  isOddNight: boolean;
  onPress: () => void;
}

export function LaylatAlQadrBanner({ hijriDay, isOddNight, onPress }: LaylatAlQadrBannerProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrapper,
        {
          backgroundColor: theme.colors.backgroundSecondary,
          borderColor: theme.colors.accentGold,
          borderRadius: theme.radius.lg,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: theme.colors.accentGold }]} />
      <View style={styles.body}>
        <Text variant="label" color="secondary">
          {t('home.ramadan.laylatLabel')}
        </Text>
        <Text variant="headingMd">
          {isOddNight
            ? t('home.ramadan.laylatOdd', { day: hijriDay })
            : t('home.ramadan.laylatLastTen', { day: hijriDay })}
        </Text>
        <Text variant="bodySm" color="secondary">
          {t('home.ramadan.laylatSubtitle')}
        </Text>
        <View style={styles.actionRow}>
          <Text variant="caption" color="accent">
            {t('home.ramadan.laylatAction')}
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
  accent: { width: 3 },
  body: {
    flex: 1,
    padding: layout.screenPaddingX,
    gap: layout.listGap,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: layout.listGap,
  },
});
