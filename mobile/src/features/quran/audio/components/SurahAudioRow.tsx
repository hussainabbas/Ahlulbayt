import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { buildTrackId } from '../constants/audioSources';
import { useQuranDownloadStore } from '../stores/quranDownloadStore';
import type { SurahMeta } from '../../types';

interface SurahAudioRowProps {
  meta: SurahMeta;
  reciterId: string;
  onPlay: (surah: number) => void;
  onQueue: (surah: number) => void;
}

function SurahAudioRowComponent({ meta, reciterId, onPlay, onQueue }: SurahAudioRowProps) {
  const { theme } = useTheme();
  const { t } = useLocale();
  const trackId = buildTrackId(reciterId, meta.number);

  const downloaded = useQuranDownloadStore((s) => Boolean(s.downloads[trackId]));
  const job = useQuranDownloadStore((s) => s.jobs[trackId]);
  const downloadSurah = useQuranDownloadStore((s) => s.downloadSurah);
  const deleteDownload = useQuranDownloadStore((s) => s.deleteDownload);

  const isDownloading = job?.status === 'downloading' || job?.status === 'pending';

  return (
    <Pressable
      onPress={() => onPlay(meta.number)}
      style={({ pressed }) => [
        styles.row,
        {
          borderBottomColor: theme.colors.borderSubtle,
          backgroundColor: pressed ? theme.colors.surfaceMuted : 'transparent',
        },
      ]}
    >
      <View style={[styles.number, { backgroundColor: theme.colors.backgroundSecondary }]}>
        <Text variant="caption" color="accent" weight="600">
          {meta.number}
        </Text>
      </View>

      <View style={styles.meta}>
        <Text variant="bodyMd" weight="500">
          {meta.nameEnglish}
        </Text>
        <Text variant="caption" color="secondary">
          {meta.nameArabic} · {meta.ayahCount} {t('quran.ayahs')}
        </Text>
        {isDownloading ? (
          <Text variant="caption" color="accent">
            {t('quran.player.downloading', { percent: Math.round((job?.progress ?? 0) * 100) })}
          </Text>
        ) : downloaded ? (
          <View style={styles.offlineRow}>
            <Icon name="download" size={12} color={theme.colors.accentPrimary} />
            <Text variant="caption" color="accent">
              {t('quran.player.offline')}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.actions}>
        <ActionChip label="+" onPress={() => onQueue(meta.number)} compact />
        <ActionChip
          label={downloaded ? '✓' : '↓'}
          onPress={() =>
            downloaded
              ? void deleteDownload(reciterId, meta.number)
              : void downloadSurah(reciterId, meta.number)
          }
          compact
        />
      </View>
    </Pressable>
  );
}

const ActionChip = memo(function ActionChip({
  label,
  onPress,
  compact = false,
}: {
  label: string;
  onPress: () => void;
  compact?: boolean;
}) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        compact && styles.chipCompact,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
        },
      ]}
    >
      <Text variant="caption" color="accent">
        {label}
      </Text>
    </Pressable>
  );
});

export const SurahAudioRow = memo(SurahAudioRowComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.blockGap,
    paddingHorizontal: layout.screenPaddingX,
    paddingVertical: layout.blockGap + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: layout.listRowMinHeight + 8,
  },
  number: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  offlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipCompact: {
    minWidth: 32,
    alignItems: 'center',
  },
});
