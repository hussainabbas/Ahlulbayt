import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
  type Track,
} from 'react-native-track-player';

import { logger } from '@/core/logging/logger';

let setupPromise: Promise<void> | null = null;
let serviceRegistered = false;

function registerPlaybackServiceOnce() {
  if (serviceRegistered) return;
  serviceRegistered = true;
  TrackPlayer.registerPlaybackService(
    () => require('./playbackService').default,
  );
}

export async function setupTrackPlayer(): Promise<void> {
  if (setupPromise) return setupPromise;

  setupPromise = (async () => {
    registerPlaybackServiceOnce();

    try {
      await TrackPlayer.getActiveTrack();
      return;
    } catch {
      // Player not yet initialized.
    }

    await TrackPlayer.setupPlayer({
      autoHandleInterruptions: true,
      maxCacheSize: 1024 * 50,
    });

    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
        alwaysPauseOnInterruption: false,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
        Capability.SeekTo,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.JumpForward,
        Capability.JumpBackward,
        Capability.SetRepeatMode,
        Capability.SetRating,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SeekTo,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.JumpForward,
        Capability.JumpBackward,
      ],
      forwardJumpInterval: 15,
      backwardJumpInterval: 15,
      progressUpdateEventInterval: 0.25,
    });

    logger.info('Quran track player initialized');
  })();

  return setupPromise;
}

export function mapRepeatMode(mode: 'off' | 'one' | 'all'): RepeatMode {
  switch (mode) {
    case 'one':
      return RepeatMode.Track;
    case 'all':
      return RepeatMode.Queue;
    default:
      return RepeatMode.Off;
  }
}

export function unmapRepeatMode(mode: RepeatMode): 'off' | 'one' | 'all' {
  switch (mode) {
    case RepeatMode.Track:
      return 'one';
    case RepeatMode.Queue:
      return 'all';
    default:
      return 'off';
  }
}

export type { Track };
