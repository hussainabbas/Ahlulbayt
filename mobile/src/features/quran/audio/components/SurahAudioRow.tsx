import { memo, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { buildTrackId } from '../constants/audioSources';
import { useQuranDownloadStore } from '../stores/quranDownloadStore';
import { useQuranTextDownloadStore } from '../../stores/quranTextDownloadStore';
import type { SurahMeta } from '../../types';

interface SurahAudioRowProps {
  meta: SurahMeta;
  reciterId: string;
  onOpenReader: (surah: number) => void;
  onPlayAudio: (surah: number) => void;
  onQueue: (surah: number) => void;
}

function SurahAudioRowComponent({
  meta,
  reciterId,
  onOpenReader,
  onPlayAudio,
  onQueue,
}: SurahAudioRowProps) {
  const { theme } = useTheme();
  const { t } = useLocale();
  const trackId = buildTrackId(reciterId, meta.number);

  const audioDownloaded = useQuranDownloadStore((s) => Boolean(s.downloads[trackId]));
  const textOffline = useQuranTextDownloadStore((s) => Boolean(s.offlineSurahs[meta.number]));
  const job = useQuranDownloadStore((s) => s.jobs[trackId]);
  const downloadSurah = useQuranDownloadStore((s) => s.downloadSurah);
  const deleteDownload = useQuranDownloadStore((s) => s.deleteDownload);

  const isAudioDownloading = job?.status === 'downloading' || job?.status === 'pending';
  const revelationLabel =
    meta.revelation === 'meccan' ? t('quran.meta.meccan') : t('quran.meta.medinan');

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.md,
        },
      ]}
    >
      <Pressable
        onPress={() => onOpenReader(meta.number)}
        accessibilityRole="button"
        accessibilityLabel={meta.nameEnglish}
        style={({ pressed }) => [styles.mainRow, pressed && { opacity: 0.92 }]}
      >
        <View style={[styles.numberBadge, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
          <Text variant="caption" color="accent" weight="600">
            {meta.number}
          </Text>
        </View>

        <View style={styles.body}>
          <View style={styles.titleBlock}>
            <Text variant="bodyMd" weight="600" numberOfLines={2}>
              {meta.nameEnglish}
            </Text>
            <Text
              variant="bodySm"
              color="secondary"
              numberOfLines={1}
              style={styles.arabicName}
            >
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

          {isAudioDownloading ? (
            <Text variant="caption" color="accent">
              {t('quran.hub.downloadingAudio', { percent: Math.round((job?.progress ?? 0) * 100) })}
            </Text>
          ) : null}
        </View>

        <Icon name="chevron" size={14} color={theme.colors.textTertiary} style={styles.chevron} />
      </Pressable>

      <View style={[styles.actionRow, { borderTopColor: theme.colors.borderSubtle }]}>
        <RowAction
          label={t('quran.hub.playSurah')}
          onPress={() => onPlayAudio(meta.number)}
          accent
        >
          ▶
        </RowAction>
        <RowAction label={t('quran.hub.queue')} onPress={() => onQueue(meta.number)}>
          <Icon name="plus" size={14} color={theme.colors.textSecondary} />
        </RowAction>
        <RowAction
          label={audioDownloaded ? t('quran.hub.audioSaved') : t('quran.hub.audio')}
          active={audioDownloaded}
          onPress={() =>
            audioDownloaded
              ? void deleteDownload(reciterId, meta.number)
              : void downloadSurah(reciterId, meta.number)
          }
        >
          <Icon
            name={audioDownloaded ? 'check' : 'download'}
            size={14}
            color={audioDownloaded ? theme.colors.accentPrimary : theme.colors.textSecondary}
          />
        </RowAction>
      </View>
    </View>
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
      <Text variant="caption" color={accent ? 'accent' : 'secondary'} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const RowAction = memo(function RowAction({
  label,
  onPress,
  active,
  accent,
  children,
}: {
  label: string;
  onPress: () => void;
  active?: boolean;
  accent?: boolean;
  children: ReactNode;
}) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.rowAction,
        {
          backgroundColor: active
            ? theme.colors.accentPrimaryMuted
            : pressed
              ? theme.colors.surfaceMuted
              : 'transparent',
        },
      ]}
    >
      {children}
      <Text
        variant="caption"
        color={active || accent ? 'accent' : 'secondary'}
        numberOfLines={1}
        weight={accent ? '600' : '400'}
      >
        {label}
      </Text>
    </Pressable>
  );
});

export const SurahAudioRow = memo(SurahAudioRowComponent);

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: layout.screenPaddingX,
    overflow: 'hidden',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  body: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },
  titleBlock: {
    gap: 2,
  },
  arabicName: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    maxWidth: '100%',
  },
  chevron: {
    marginTop: 10,
    flexShrink: 0,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  rowAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    minHeight: 40,
  },
});
