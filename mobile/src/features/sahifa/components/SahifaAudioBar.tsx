import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

interface SahifaAudioBarProps {
  isPlaying: boolean;
  isDownloaded: boolean;
  isDownloading: boolean;
  downloadProgress: number;
  onTogglePlay: () => void;
  onDownload: () => void;
  onRemoveOffline: () => void;
}

export function SahifaAudioBar({
  isPlaying,
  isDownloaded,
  isDownloading,
  downloadProgress,
  onTogglePlay,
  onDownload,
  onRemoveOffline,
}: SahifaAudioBarProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderTopColor: theme.colors.borderSubtle,
        },
      ]}
    >
      <Pressable
        onPress={onTogglePlay}
        style={[styles.playBtn, { backgroundColor: theme.colors.accentPrimary }]}
      >
        <Text variant="bodyMd" color="inverse">
          {isPlaying ? '❚❚' : '▶'}
        </Text>
      </Pressable>

      <View style={styles.info}>
        <Text variant="bodySm" color="primary">
          {isPlaying ? t('sahifa.audio.playing') : t('sahifa.audio.listen')}
        </Text>
        {isDownloaded ? (
          <Text variant="caption" color="accent">
            {t('sahifa.audio.offline')}
          </Text>
        ) : isDownloading ? (
          <Text variant="caption" color="secondary">
            {t('sahifa.audio.downloading', { percent: Math.round(downloadProgress * 100) })}
          </Text>
        ) : null}
      </View>

      {isDownloading ? (
        <ActivityIndicator color={theme.colors.accentPrimary} />
      ) : (
        <Pressable
          onPress={isDownloaded ? onRemoveOffline : onDownload}
          style={[styles.downloadBtn, { borderColor: theme.colors.borderSubtle }]}
        >
          <Text variant="caption" color={isDownloaded ? 'accent' : 'secondary'}>
            {isDownloaded ? t('sahifa.audio.removeOffline') : '↓'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 12,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  downloadBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 999,
  },
});
