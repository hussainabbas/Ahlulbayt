import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { useQuranAudio } from '../../hooks/useQuranAudio';
import type { QuranAyah } from '../../types';
import { NATIVE_AUDIO_ENABLED } from '../config';
import { useQuranPlayer } from '../hooks/useQuranPlayer';

interface ReaderAudioBarProps {
  ayahs: QuranAyah[];
  surahNumber: number;
}

export function ReaderAudioBar({ ayahs, surahNumber }: ReaderAudioBarProps) {
  const { theme } = useTheme();
  const { t } = useLocale();
  const insets = useSafeAreaInsets();
  const {
    isPlaying: ayahPlaying,
    activeAyah,
    toggle: toggleAyah,
    loadAyah,
    playNextAyah,
    playPreviousAyah,
  } = useQuranAudio();
  const {
    isPlaying: surahPlaying,
    activeSurah,
    hasActiveTrack,
    playSurah,
    togglePlayback,
  } = useQuranPlayer();

  if (!NATIVE_AUDIO_ENABLED) return null;

  const surahActive = hasActiveTrack && activeSurah === surahNumber && !activeAyah;
  const isPlaying = ayahPlaying || (surahActive && surahPlaying);
  const label = activeAyah
    ? t('quran.readerAudio.ayah', { number: activeAyah.ayah })
    : surahActive
      ? t('quran.readerAudio.surahPlaying')
      : t('quran.readerAudio.idle');

  const onPlayPause = async () => {
    if (activeAyah) {
      await toggleAyah();
      return;
    }
    if (surahActive) {
      await togglePlayback();
      return;
    }
    await playSurah(surahNumber);
  };

  const onPlayFirstAyah = async () => {
    const first = ayahs[0];
    if (first) await loadAyah(first);
  };

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderTopColor: theme.colors.borderSubtle,
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      <View style={styles.progressPulse}>
        {isPlaying ? (
          <View style={[styles.pulse, { backgroundColor: theme.colors.accentPrimary }]} />
        ) : null}
      </View>

      <Text variant="caption" color="secondary" numberOfLines={1} style={styles.label}>
        {label}
      </Text>

      <View style={styles.controls}>
        <ControlButton label={t('quran.readerAudio.prevAyah')} onPress={() => void playPreviousAyah(ayahs)}>
          ⏮
        </ControlButton>
        <Pressable
          onPress={() => void onPlayPause()}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? t('quran.readerAudio.pause') : t('quran.readerAudio.play')}
          style={({ pressed }) => [
            styles.playBtn,
            {
              backgroundColor: pressed
                ? theme.colors.accentPrimaryMuted
                : theme.colors.accentPrimary,
            },
          ]}
        >
          <Text variant="headingMd" style={{ color: theme.colors.textInverse }}>
            {isPlaying ? '⏸' : '▶'}
          </Text>
        </Pressable>
        <ControlButton label={t('quran.readerAudio.nextAyah')} onPress={() => void playNextAyah(ayahs)}>
          ⏭
        </ControlButton>
        <ControlButton label={t('quran.readerAudio.playAyah')} onPress={() => void onPlayFirstAyah()}>
          🎧
        </ControlButton>
      </View>
    </View>
  );
}

function ControlButton({
  label,
  onPress,
  children,
}: {
  label: string;
  onPress: () => void;
  children: string;
}) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={({ pressed }) => [
        styles.iconBtn,
        { backgroundColor: pressed ? theme.colors.surfaceMuted : 'transparent' },
      ]}
    >
      <Text variant="bodyMd">{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
    paddingHorizontal: layout.screenPaddingX,
    gap: 6,
  },
  progressPulse: {
    height: 2,
    borderRadius: 1,
    overflow: 'hidden',
  },
  pulse: {
    height: 2,
    width: '35%',
    borderRadius: 1,
  },
  label: {
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
