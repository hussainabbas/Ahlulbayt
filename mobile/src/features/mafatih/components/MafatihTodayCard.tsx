import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { MafatihEntry } from '../types';

interface MafatihTodayCardProps {
  entry: MafatihEntry;
  onPress: () => void;
}

export function MafatihTodayCard({ entry, onPress }: MafatihTodayCardProps) {
  const { locale, t } = useLocale();
  const { theme } = useTheme();

  const title =
    locale === 'ur' ? entry.titles.ur : locale === 'ar' ? entry.titles.ar : entry.titles.en;
  const subtitle = locale === 'ur' ? entry.subtitles.ur : entry.subtitles.en;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && { opacity: 0.94 }]}
      accessibilityRole="button"
    >
      <View
        style={[
          styles.card,
          {
            borderColor: theme.colors.accentPrimary,
            borderRadius: theme.radius.lg,
            backgroundColor: theme.colors.surfaceElevated,
          },
        ]}
      >
        <View style={[styles.accent, { backgroundColor: theme.colors.accentGold }]} />
        <View style={styles.body}>
          <Text variant="overline" color="accent">
            {t('mafatih.today')}
          </Text>
          <Text variant="headingSm" style={styles.title}>
            {title}
          </Text>
          <Text variant="bodySm" color="secondary" numberOfLines={2}>
            {subtitle}
          </Text>
          <Text variant="caption" color="tertiary" style={styles.meta}>
            § {entry.mafatihRef} · {entry.estimatedMinutes} min
          </Text>
        </View>
        <View style={styles.chevron}>
          <Icon name="chevron" size={18} color={theme.colors.accentPrimary} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginTop: layout.sectionGap,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
    minHeight: 104,
  },
  accent: {
    width: 4,
    alignSelf: 'stretch',
  },
  body: {
    flex: 1,
    paddingVertical: layout.blockGap + 2,
    paddingHorizontal: layout.blockGap + 2,
    gap: 4,
  },
  title: {
    marginTop: 2,
  },
  meta: {
    marginTop: 6,
  },
  chevron: {
    paddingRight: layout.blockGap + 2,
  },
});
