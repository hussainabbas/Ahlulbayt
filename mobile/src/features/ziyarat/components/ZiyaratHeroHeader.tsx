import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { OCCASION_LABELS } from '../constants/catalog';
import type { ZiyaratMeta } from '../types';

interface ZiyaratHeroHeaderProps {
  meta: ZiyaratMeta;
  progress: number;
}

export function ZiyaratHeroHeader({ meta, progress }: ZiyaratHeroHeaderProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();

  const title =
    locale === 'ur' ? meta.titles.ur : locale === 'ar' ? meta.titles.ar : meta.titles.en;
  const subtitle = locale === 'ur' ? meta.subtitles.ur : meta.subtitles.en;
  const imam = locale === 'ur' ? meta.imam.ur : locale === 'ar' ? meta.imam.ar : meta.imam.en;
  const occasion = OCCASION_LABELS[meta.occasion];
  const occasionLabel =
    locale === 'ur' ? occasion.ur : locale === 'ar' ? occasion.ar : occasion.en;

  return (
    <View style={[styles.wrap, { borderRadius: theme.radius.lg }]}>
      <LinearGradient
        colors={['rgba(212, 184, 122, 0.12)', 'rgba(61, 155, 138, 0.08)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          {
            borderColor: theme.colors.borderSubtle,
            borderRadius: theme.radius.lg,
          },
        ]}
      >
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.round(progress * 100)}%`,
                backgroundColor: theme.colors.accentGold,
              },
            ]}
          />
        </View>

        <View style={[styles.occasionPill, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
          <Text variant="caption" color="accent">
            {occasionLabel}
          </Text>
        </View>

        <Text variant="headingMd" style={styles.title}>
          {title}
        </Text>
        <Text variant="bodySm" color="secondary">
          {subtitle}
        </Text>
        <Text variant="caption" color="accent" style={{ marginTop: 8 }}>
          {imam}
        </Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  gradient: {
    padding: 20,
    borderWidth: 1,
    gap: 4,
  },
  progressTrack: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 1,
    marginBottom: 14,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 1,
  },
  occasionPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 8,
  },
  title: {
    marginTop: 4,
  },
});
