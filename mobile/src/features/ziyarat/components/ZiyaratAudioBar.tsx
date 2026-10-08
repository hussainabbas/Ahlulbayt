import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

interface ZiyaratAudioBarProps {
  isPlaying: boolean;
  isDownloaded: boolean;
  isDownloading: boolean;
  downloadProgress: number;
  onTogglePlay: () => void;
  onDownload: () => void;
  onRemoveOffline: () => void;
}

export function ZiyaratAudioBar({
  isPlaying,
  isDownloaded,
  isDownloading,
  downloadProgress,
  onTogglePlay,
  onDownload,
  onRemoveOffline,
}: ZiyaratAudioBarProps) {
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
        style={[styles.playBtn, { backgroundColor: theme.colors.accentGold }]}
      >
        <Text variant="bodyMd" color="inverse">
          {isPlaying ? '❚❚' : '▶'}
        </Text>
      </Pressable>

      <View style={styles.info}>
        <Text variant="bodySm" color="primary">
          {isPlaying ? t('ziyarat.audio.playing') : t('ziyarat.audio.listen')}
        </Text>
        {isDownloaded ? (
          <Text variant="caption" color="accent">
            {t('ziyarat.audio.offline')}
          </Text>
        ) : isDownloading ? (
          <Text variant="caption" color="secondary">
            {t('ziyarat.audio.downloading', { percent: Math.round(downloadProgress * 100) })}
          </Text>
        ) : null}
      </View>

      {isDownloading ? (
        <ActivityIndicator color={theme.colors.accentGold} />
      ) : (
        <Pressable
          onPress={isDownloaded ? onRemoveOffline : onDownload}
          style={[styles.downloadBtn, { borderColor: theme.colors.borderSubtle }]}
        >
          <Text variant="caption" color={isDownloaded ? 'accent' : 'secondary'}>
            {isDownloaded ? t('ziyarat.audio.removeOffline') : '↓'}
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
