import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { buildTrackId } from '../constants/audioSources';
import { NATIVE_AUDIO_ENABLED } from '../config';
import { useQuranDownloadStore } from '../stores/quranDownloadStore';
import { useQuranTextDownloadStore } from '../../stores/quranTextDownloadStore';
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

  const audioDownloaded = useQuranDownloadStore((s) => Boolean(s.downloads[trackId]));
  const textOffline = useQuranTextDownloadStore((s) => Boolean(s.offlineSurahs[meta.number]));
  const job = useQuranDownloadStore((s) => s.jobs[trackId]);
  const downloadSurah = useQuranDownloadStore((s) => s.downloadSurah);
  const deleteDownload = useQuranDownloadStore((s) => s.deleteDownload);

  const isAudioDownloading = job?.status === 'downloading' || job?.status === 'pending';
  const showAudioActions = NATIVE_AUDIO_ENABLED;
  const revelationLabel =
    meta.revelation === 'meccan' ? t('quran.meta.meccan') : t('quran.meta.medinan');

  return (
    <Pressable
      onPress={() => onPlay(meta.number)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.md,
        },
      ]}
    >
      <View style={[styles.numberBadge, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
        <Text variant="caption" color="accent" weight="600">
          {meta.number}
        </Text>
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text variant="bodyMd" weight="600" numberOfLines={1} style={styles.englishName}>
            {meta.nameEnglish}
          </Text>
          <Text variant="bodySm" color="secondary" numberOfLines={1} style={styles.arabicName}>
            {meta.nameArabic}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <MetaPill label={`${meta.ayahCount} ${t('quran.ayahs')}`} />
          <MetaPill label={revelationLabel} subtle />
          {textOffline ? (
            <MetaPill label={t('quran.hub.textSaved')} accent showCheck />
          ) : null}
          {audioDownloaded ? <MetaPill label={t('quran.hub.audioSaved')} accent /> : null}
        </View>

        {showAudioActions && isAudioDownloading ? (
          <Text variant="caption" color="accent">
            {t('quran.hub.downloadingAudio', { percent: Math.round((job?.progress ?? 0) * 100) })}
          </Text>
        ) : null}
      </View>

      {showAudioActions ? (
        <View style={styles.actions}>
          <MiniAction
            icon="plus"
            label={t('quran.hub.queue')}
            onPress={() => onQueue(meta.number)}
            accessibilityLabel={t('quran.hub.addToQueue')}
          />
          <MiniAction
            icon={audioDownloaded ? 'check' : 'download'}
            label={audioDownloaded ? t('quran.hub.audioSaved') : t('quran.hub.audio')}
            active={audioDownloaded}
            onPress={() =>
              audioDownloaded
                ? void deleteDownload(reciterId, meta.number)
                : void downloadSurah(reciterId, meta.number)
            }
            accessibilityLabel={t('quran.hub.downloadAudio')}
          />
        </View>
      ) : (
        <Icon name="chevron" size={14} color={theme.colors.textTertiary} style={styles.chevron} />
      )}
    </Pressable>
  );
}

function MetaPill({
  label,
  accent,
  subtle,
  showCheck,
}: {
  label: string;
  accent?: boolean;
  subtle?: boolean;
  showCheck?: boolean;
}) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: accent
            ? theme.colors.accentPrimaryMuted
            : subtle
              ? theme.colors.backgroundSecondary
              : theme.colors.surfaceMuted,
        },
      ]}
    >
      {showCheck ? <Icon name="check" size={10} color={theme.colors.accentPrimary} /> : null}
      <Text variant="caption" color={accent ? 'accent' : 'secondary'}>
        {label}
      </Text>
    </View>
  );
}

const MiniAction = memo(function MiniAction({
  icon,
  label,
  active,
  onPress,
  accessibilityLabel,
}: {
  icon: 'plus' | 'download' | 'check';
  label: string;
  active?: boolean;
  onPress: () => void;
  accessibilityLabel: string;
}) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={4}
      style={({ pressed }) => [
        styles.miniAction,
        {
          backgroundColor: active
            ? theme.colors.accentPrimaryMuted
            : pressed
              ? theme.colors.surfaceMuted
              : theme.colors.backgroundPrimary,
          borderColor: theme.colors.borderSubtle,
        },
      ]}
    >
      <Icon
        name={icon}
        size={12}
        color={active ? theme.colors.accentPrimary : theme.colors.textSecondary}
      />
      <Text variant="caption" color={active ? 'accent' : 'secondary'} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
});

export const SurahAudioRow = memo(SurahAudioRowComponent);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: layout.screenPaddingX,
  },
  numberBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  body: {
    flex: 1,
    gap: 5,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  englishName: {
    flex: 1,
    flexShrink: 1,
  },
  arabicName: {
    flexShrink: 0,
    maxWidth: '42%',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 5,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  actions: {
    flexDirection: 'row',
    gap: 4,
    flexShrink: 0,
  },
  miniAction: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    width: 44,
  },
  chevron: {
    flexShrink: 0,
    marginLeft: 2,
  },
});
