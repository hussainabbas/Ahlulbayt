import { useEffect } from 'react';

/**
 * JS mock for react-native-track-player when NATIVE_AUDIO_ENABLED is false.
 * Metro resolves the real package to this file so the native TurboModule is never loaded.
 */

export enum State {
  None = 'none',
  Ready = 'ready',
  Playing = 'playing',
  Paused = 'paused',
  Stopped = 'stopped',
  Buffering = 'buffering',
  Loading = 'loading',
  Ended = 'ended',
}

export enum RepeatMode {
  Off = 0,
  Track = 1,
  Queue = 2,
}

export enum Capability {
  Play = 'play',
  Pause = 'pause',
  Stop = 'stop',
  SeekTo = 'seekTo',
  SkipToNext = 'skipToNext',
  SkipToPrevious = 'skipToPrevious',
  JumpForward = 'jumpForward',
  JumpBackward = 'jumpBackward',
  SetRepeatMode = 'setRepeatMode',
  SetRating = 'setRating',
}

export enum AppKilledPlaybackBehavior {
  ContinuePlayback = 'continue-playback',
  PausePlayback = 'pause-playback',
  StopPlaybackAndRemoveNotification = 'stop-playback-and-remove-notification',
}

export enum Event {
  RemotePlay = 'remote-play',
  RemotePause = 'remote-pause',
  RemoteStop = 'remote-stop',
  RemoteNext = 'remote-next',
  RemotePrevious = 'remote-previous',
  RemoteSeek = 'remote-seek',
  RemoteJumpForward = 'remote-jump-forward',
  RemoteJumpBackward = 'remote-jump-backward',
  PlaybackActiveTrackChanged = 'playback-active-track-changed',
  PlaybackQueueEnded = 'playback-queue-ended',
  PlaybackState = 'playback-state',
}

export interface Track {
  id: string;
  url: string;
  title?: string;
  artist?: string;
  album?: string;
  description?: string;
  genre?: string;
  headers?: Record<string, string>;
  isLiveStream?: boolean;
  [key: string]: unknown;
}

export interface Progress {
  position: number;
  duration: number;
  buffered: number;
}

const noopAsync = async () => undefined;

const TrackPlayer = {
  setupPlayer: noopAsync,
  updateOptions: noopAsync,
  registerPlaybackService: () => undefined,
  add: noopAsync,
  reset: noopAsync,
  play: noopAsync,
  pause: noopAsync,
  stop: noopAsync,
  seekTo: noopAsync,
  skip: noopAsync,
  skipToNext: noopAsync,
  skipToPrevious: noopAsync,
  setRepeatMode: noopAsync,
  getRepeatMode: async () => RepeatMode.Off,
  setRate: noopAsync,
  getRate: async () => 1,
  getQueue: async () => [] as Track[],
  getActiveTrack: async () => undefined,
  getActiveTrackIndex: async () => undefined,
  getPosition: async () => 0,
  getPlaybackState: async () => ({ state: State.None }),
  getProgress: async () => ({ position: 0, duration: 0, buffered: 0 }),
  addEventListener: () => undefined,
};

export function useProgress(): Progress {
  return { position: 0, duration: 0, buffered: 0 };
}

export function usePlaybackState(): { state: State | undefined } {
  return { state: State.None };
}

export function useActiveTrack(): Track | undefined {
  return undefined;
}

export function useTrackPlayerEvents(
  _events: Event[],
  _handler: (event: { type: Event }) => void,
): void {
  useEffect(() => undefined, []);
}

export default TrackPlayer;
