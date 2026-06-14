import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { useQuranPlayer } from '../hooks/useQuranPlayer';

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function MiniPlayer() {
  const { theme } = useTheme();
  const { t } = useLocale();
  const insets = useSafeAreaInsets();
  const {
    activeTrack,
    isPlaying,
    isBuffering,
    hasActiveTrack,
    progress,
    togglePlayback,
    setPlayerExpanded,
  } = useQuranPlayer();

  if (!hasActiveTrack || !activeTrack) return null;

  return (
    <Pressable
      onPress={() => setPlayerExpanded(true)}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderTopColor: theme.colors.borderSubtle,
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      <View style={[styles.progressTrack, { backgroundColor: theme.colors.surfaceMuted }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: theme.colors.accentPrimary,
              width: `${progress.duration > 0 ? (progress.position / progress.duration) * 100 : 0}%`,
            },
          ]}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.meta}>
          <Text variant="bodySm" numberOfLines={1}>
            {activeTrack.title}
          </Text>
          <Text variant="caption" color="secondary" numberOfLines={1}>
            {activeTrack.artist} · {formatTime(progress.position)}
          </Text>
        </View>

        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            void togglePlayback();
          }}
          style={[styles.playBtn, { backgroundColor: theme.colors.accentPrimary }]}
        >
          <Text variant="bodyMd" style={{ color: theme.colors.textInverse }}>
            {isBuffering ? '…' : isPlaying ? '⏸' : '▶'}
          </Text>
        </Pressable>
      </View>

      <Text variant="caption" color="tertiary" style={styles.hint}>
        {t('quran.player.tapToExpand')}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  progressTrack: {
    height: 3,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    textAlign: 'center',
    marginTop: 4,
  },
});
