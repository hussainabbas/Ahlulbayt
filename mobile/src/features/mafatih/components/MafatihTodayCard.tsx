import { Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
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
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.92 }]}>
      <LinearGradient
        colors={['rgba(61, 155, 138, 0.15)', 'rgba(212, 184, 122, 0.08)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.card,
          {
            borderColor: theme.colors.accentPrimary,
            borderRadius: theme.radius.lg,
          },
        ]}
      >
        <View style={[styles.accent, { backgroundColor: theme.colors.accentPrimary }]} />
        <View style={styles.body}>
          <Text variant="overline" color="accent">
            {t('mafatih.today')}
          </Text>
          <Text variant="headingMd" style={{ marginTop: 6 }}>
            {title}
          </Text>
          <Text variant="bodySm" color="secondary" numberOfLines={2}>
            {subtitle}
          </Text>
          <Text variant="caption" color="tertiary" style={{ marginTop: 8 }}>
            § {entry.mafatihRef} · {entry.estimatedMinutes} min
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    overflow: 'hidden',
    minHeight: 110,
  },
  accent: {
    width: 3,
  },
  body: {
    flex: 1,
    padding: 16,
  },
});
