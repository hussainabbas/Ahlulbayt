import { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { useQuranTextDownloadStore } from '../stores/quranTextDownloadStore';
import type { SurahBundle } from '../types';

interface SurahReaderHeaderProps {
  bundle: SurahBundle;
  onDownloadComplete?: (bundle: SurahBundle) => void;
}

const BADGE_SIZE = 36;

export function SurahReaderHeader({ bundle, onDownloadComplete }: SurahReaderHeaderProps) {
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const { meta } = bundle;

  const isOffline = useQuranTextDownloadStore((s) => s.offlineSurahs[meta.number]);
  const progress = useQuranTextDownloadStore((s) => s.progress[meta.number]);
  const refreshOffline = useQuranTextDownloadStore((s) => s.refreshOffline);
  const downloadText = useQuranTextDownloadStore((s) => s.downloadSurahText);
  const removeText = useQuranTextDownloadStore((s) => s.removeSurahText);

  const isDownloading = progress != null;
  const localizedName =
    locale === 'ur' ? meta.nameUrdu : locale === 'ar' ? meta.nameArabic : meta.nameEnglish;
  const revelationLabel =
    meta.revelation === 'meccan' ? t('quran.meta.meccan') : t('quran.meta.medinan');

  useEffect(() => {
    void refreshOffline(meta.number);
  }, [meta.number, bundle.bundleVersion, refreshOffline]);

  const onPressDownload = async () => {
    if (isOffline) {
      await removeText(meta.number);
      onDownloadComplete?.(bundle);
      return;
    }

    const saved = await downloadText(meta, bundle);
    if (saved) onDownloadComplete?.(saved);
  };

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={['rgba(212, 184, 122, 0.14)', 'rgba(61, 155, 138, 0.1)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.card,
          {
            borderColor: theme.colors.borderSubtle,
            borderRadius: theme.radius.lg,
          },
        ]}
      >
        <View style={styles.topRow}>
          <View style={[styles.numberBadge, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
            <Text variant="caption" color="accent" weight="600">
              {meta.number}
            </Text>
          </View>
          <View style={styles.chips}>
            <MetaChip label={`${meta.ayahCount} ${t('quran.ayahs')}`} />
            <MetaChip label={`${t('quran.meta.juz')} ${meta.juzStart}`} />
            <MetaChip label={revelationLabel} accent />
          </View>
        </View>

        <Text variant="displayMd" style={styles.arabicName}>
          {meta.nameArabic}
        </Text>
        <Text variant="bodySm" color="secondary">
          {localizedName}
        </Text>

        {!isOffline && bundle.bundleVersion === 0 ? (
          <Text variant="caption" color="tertiary" style={styles.hint}>
            {t('quran.downloadPrompt')}
          </Text>
        ) : null}

        <Pressable
          onPress={() => void onPressDownload()}
          disabled={isDownloading}
          accessibilityRole="button"
          accessibilityLabel={
            isOffline ? t('quran.reader.removeOffline') : t('quran.reader.downloadText')
          }
          style={({ pressed }) => [
            styles.downloadBtn,
            {
              backgroundColor: isOffline
                ? theme.colors.surfaceElevated
                : pressed
                  ? theme.colors.accentPrimary
                  : theme.colors.accentPrimaryMuted,
              borderColor: theme.colors.borderSubtle,
              borderRadius: theme.radius.md,
              opacity: isDownloading ? 0.85 : 1,
            },
          ]}
        >
          {isDownloading ? (
            <View style={styles.downloadBtnContent}>
              <ActivityIndicator size="small" color={theme.colors.accentPrimary} />
              <Text variant="label" color="accent">
                {t('quran.reader.downloadingText', {
                  percent: Math.round((progress ?? 0) * 100),
                })}
              </Text>
            </View>
          ) : isOffline ? (
            <View style={styles.downloadBtnContent}>
              <Icon name="check" size={16} color={theme.colors.accentPrimary} />
              <Text variant="label" color="accent">
                {t('quran.hub.textSaved')}
              </Text>
              <Text variant="caption" color="tertiary">
                · {t('quran.reader.removeOffline')}
              </Text>
            </View>
          ) : (
            <View style={styles.downloadBtnContent}>
              <Icon name="download" size={16} color={theme.colors.accentPrimary} />
              <Text variant="label" color="accent">
                {t('quran.reader.downloadText')}
              </Text>
            </View>
          )}
        </Pressable>
      </LinearGradient>
    </View>
  );
}

function MetaChip({ label, accent }: { label: string; accent?: boolean }) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: accent ? theme.colors.accentPrimaryMuted : theme.colors.surfaceMuted,
        },
      ]}
    >
      <Text variant="caption" color={accent ? 'accent' : 'secondary'}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: layout.blockGap,
  },
  card: {
    padding: layout.blockGap + 4,
    borderWidth: 1,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.listGap,
    marginBottom: 4,
  },
  numberBadge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chips: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  chip: {
    minHeight: 28,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arabicName: {
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 4,
  },
  hint: {
    marginTop: 2,
  },
  downloadBtn: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
