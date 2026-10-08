import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { PLAYBACK_SPEEDS } from '../types';
import { useQuranPlayer } from '../hooks/useQuranPlayer';
import { PlayerControls } from './PlayerControls';
import { PlaylistSheet } from './PlaylistSheet';
import { SleepTimerSheet } from './SleepTimerSheet';

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function FullPlayerModal() {
  const { theme } = useTheme();
  const { t } = useLocale();
  const insets = useSafeAreaInsets();
  const {
    activeTrack,
    hasActiveTrack,
    isPlayerExpanded,
    setPlayerExpanded,
    progress,
    playbackRate,
    repeatMode,
    sleepTimerMode,
    sleepTimerRemainingMs,
    setPlaybackRate,
    cycleRepeatMode,
    setSleepTimerMinutes,
    setSleepTimerEndOfSurah,
    clearSleepTimer,
  } = useQuranPlayer();

  const [showSpeed, setShowSpeed] = useState(false);
  const [showSleep, setShowSleep] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const arabicName = useMemo(() => {
    if (!activeTrack || !('surahNameArabic' in activeTrack)) return '';
    return String((activeTrack as { surahNameArabic?: string }).surahNameArabic ?? '');
  }, [activeTrack]);

  if (!hasActiveTrack) return null;

  return (
    <Modal visible={isPlayerExpanded} animationType="slide" onRequestClose={() => setPlayerExpanded(false)}>
      <View
        style={[
          styles.screen,
          {
            backgroundColor: theme.colors.backgroundPrimary,
            paddingTop: insets.top + 12,
            paddingBottom: insets.bottom + 16,
          },
        ]}
      >
        <View style={styles.header}>
          <Pressable onPress={() => setPlayerExpanded(false)}>
            <Text variant="bodyMd" color="accent">
              {t('quran.player.collapse')}
            </Text>
          </Pressable>
          <Text variant="overline" color="secondary">
            {t('quran.player.nowPlaying')}
          </Text>
          <View style={{ width: 64 }} />
        </View>

        <View style={styles.artwork}>
          <Text variant="displayMd" style={[styles.arabic, { color: theme.colors.accentGold }]}>
            {arabicName || '﷽'}
          </Text>
        </View>

        <View style={styles.meta}>
          <Text variant="headingLg" style={styles.center}>
            {activeTrack?.title}
          </Text>
          <Text variant="bodyMd" color="secondary" style={styles.center}>
            {activeTrack?.artist}
          </Text>
          {activeTrack?.description ? (
            <Text variant="caption" color="tertiary" style={styles.center}>
              {activeTrack.description}
            </Text>
          ) : null}
        </View>

        <View style={styles.timeline}>
          <View style={[styles.track, { backgroundColor: theme.colors.surfaceMuted }]}>
            <View
              style={[
                styles.fill,
                {
                  backgroundColor: theme.colors.accentPrimary,
                  width: `${progress.duration > 0 ? (progress.position / progress.duration) * 100 : 0}%`,
                },
              ]}
            />
          </View>
          <View style={styles.timeRow}>
            <Text variant="caption" color="tertiary">
              {formatTime(progress.position)}
            </Text>
            <Text variant="caption" color="tertiary">
              {formatTime(progress.duration)}
            </Text>
          </View>
        </View>

        <PlayerControls />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tools}>
          <ToolChip
            label={`${playbackRate}x`}
            active={playbackRate !== 1}
            onPress={() => setShowSpeed(true)}
          />
          <ToolChip
            label={t(`quran.player.repeat.${repeatMode}`)}
            active={repeatMode !== 'off'}
            onPress={() => void cycleRepeatMode()}
          />
          <ToolChip
            label={
              sleepTimerMode
                ? sleepTimerRemainingMs != null
                  ? t('quran.player.sleepActive', {
                      time: formatTime(Math.ceil(sleepTimerRemainingMs / 1000)),
                    })
                  : t('quran.player.sleepEndSurah')
                : t('quran.player.sleep')
            }
            active={sleepTimerMode != null}
            onPress={() => setShowSleep(true)}
          />
          <ToolChip label={t('quran.player.playlist')} onPress={() => setShowPlaylist(true)} />
        </ScrollView>

        <Modal visible={showSpeed} transparent animationType="fade">
          <Pressable style={styles.sheetBackdrop} onPress={() => setShowSpeed(false)}>
            <Pressable
              style={[styles.sheet, { backgroundColor: theme.colors.surfaceElevated }]}
              onPress={(e) => e.stopPropagation()}
            >
              <Text variant="headingSm">{t('quran.player.speed')}</Text>
              {PLAYBACK_SPEEDS.map((speed) => (
                <Pressable
                  key={speed}
                  onPress={() => {
                    void setPlaybackRate(speed);
                    setShowSpeed(false);
                  }}
                  style={styles.sheetRow}
                >
                  <Text variant="bodyMd" color={playbackRate === speed ? 'accent' : 'primary'}>
                    {speed}x
                  </Text>
                </Pressable>
              ))}
            </Pressable>
          </Pressable>
        </Modal>

        <SleepTimerSheet
          visible={showSleep}
          onClose={() => setShowSleep(false)}
          onSelectMinutes={(m) => {
            setSleepTimerMinutes(m);
            setShowSleep(false);
          }}
          onSelectEndOfSurah={() => {
            setSleepTimerEndOfSurah();
            setShowSleep(false);
          }}
          onClear={() => {
            clearSleepTimer();
            setShowSleep(false);
          }}
        />

        <PlaylistSheet visible={showPlaylist} onClose={() => setShowPlaylist(false)} />
      </View>
    </Modal>
  );
}

function ToolChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? theme.colors.accentPrimaryMuted : theme.colors.surfaceMuted,
          borderColor: active ? theme.colors.accentPrimary : theme.colors.borderSubtle,
        },
      ]}
    >
      <Text variant="caption" color={active ? 'accent' : 'secondary'}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  artwork: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    marginBottom: 24,
  },
  arabic: {
    textAlign: 'center',
    writingDirection: 'rtl',
    lineHeight: 56,
  },
  meta: {
    gap: 6,
    marginBottom: 24,
  },
  center: {
    textAlign: 'center',
  },
  timeline: {
    marginBottom: 16,
  },
  track: {
    height: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  tools: {
    gap: 8,
    paddingVertical: 20,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  sheetBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 8,
  },
  sheetRow: {
    paddingVertical: 12,
  },
});
