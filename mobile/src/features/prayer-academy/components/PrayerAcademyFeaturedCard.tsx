import { Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { PrayerAcademyMeta } from '../types';
import { pickLocalized } from '../utils/localizedText';

interface PrayerAcademyFeaturedCardProps {
  meta: PrayerAcademyMeta;
  onPress: () => void;
}

export function PrayerAcademyFeaturedCard({ meta, onPress }: PrayerAcademyFeaturedCardProps) {
  const { locale, t } = useLocale();
  const { theme } = useTheme();

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}>
      <LinearGradient
        colors={[theme.colors.accentPrimary, theme.colors.accentPrimaryMuted]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <Text variant="caption" style={{ color: theme.colors.textInverse, opacity: 0.85 }}>
          {t('prayerAcademy.featured')}
        </Text>
        <Text variant="headingSm" style={{ color: theme.colors.textInverse }}>
          {pickLocalized(meta.titles, locale)}
        </Text>
        <Text variant="bodySm" style={{ color: theme.colors.textInverse, opacity: 0.9 }} numberOfLines={2}>
          {pickLocalized(meta.purpose, locale)}
        </Text>
        <View style={styles.footer}>
          <Text variant="caption" style={{ color: theme.colors.textInverse, opacity: 0.85 }}>
            {t('prayerAcademy.startLearning')}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: layout.sectionGap,
    gap: layout.listGap,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  footer: { marginTop: layout.listGap },
});
