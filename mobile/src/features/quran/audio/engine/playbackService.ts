import TrackPlayer, { Event } from 'react-native-track-player';

import { useQuranPlayerStore } from '../stores/quranPlayerStore';

export default async function playbackService(): Promise<void> {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    void TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    void TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    void TrackPlayer.stop();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    void TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    void TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => {
    void TrackPlayer.seekTo(position);
  });

  TrackPlayer.addEventListener(Event.RemoteJumpForward, async ({ interval }) => {
    const position = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(position + interval);
  });

  TrackPlayer.addEventListener(Event.RemoteJumpBackward, async ({ interval }) => {
    const position = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(Math.max(0, position - interval));
  });

  TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async () => {
    const repeatMode = await TrackPlayer.getRepeatMode();
    useQuranPlayerStore.getState().syncRepeatModeFromNative(repeatMode);
  });

  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, async () => {
    const { sleepTimerMode, clearSleepTimer } = useQuranPlayerStore.getState();
    if (sleepTimerMode === 'end_of_surah') {
      await TrackPlayer.pause();
      clearSleepTimer();
    }
  });
}
