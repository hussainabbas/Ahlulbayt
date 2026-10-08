declare module 'react-native-fs' {
  export interface StatResult {
    path: string;
    size: number;
    isFile: () => boolean;
    mtime?: Date;
  }

  export interface DownloadProgressCallbackResult {
    jobId: number;
    contentLength: number;
    bytesWritten: number;
  }

  export interface DownloadFileOptions {
    fromUrl: string;
    toFile: string;
    background?: boolean;
    discretionary?: boolean;
    progressInterval?: number;
    progress?: (res: DownloadProgressCallbackResult) => void;
  }

  export interface DownloadResult {
    jobId: number;
    statusCode: number;
    bytesWritten: number;
  }

  const RNFS: {
    DocumentDirectoryPath: string;
    exists: (path: string) => Promise<boolean>;
    mkdir: (path: string) => Promise<void>;
    unlink: (path: string) => Promise<void>;
    stat: (path: string) => Promise<StatResult>;
    readDir: (path: string) => Promise<Array<{ name: string; size: number; isFile: () => boolean }>>;
    downloadFile: (options: DownloadFileOptions) => { jobId: number; promise: Promise<DownloadResult> };
    stopDownload: (jobId: number) => void;
  };

  export default RNFS;
}

declare module 'react-native-track-player' {
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

  const TrackPlayer: {
    setupPlayer: (options?: Record<string, unknown>) => Promise<void>;
    updateOptions: (options: Record<string, unknown>) => Promise<void>;
    registerPlaybackService: (factory: () => Promise<void>) => void;
    add: (tracks: Track | Track[]) => Promise<void>;
    reset: () => Promise<void>;
    play: () => Promise<void>;
    pause: () => Promise<void>;
    stop: () => Promise<void>;
    seekTo: (position: number) => Promise<void>;
    skip: (index: number) => Promise<void>;
    skipToNext: () => Promise<void>;
    skipToPrevious: () => Promise<void>;
    setRepeatMode: (mode: RepeatMode) => Promise<void>;
    getRepeatMode: () => Promise<RepeatMode>;
    setRate: (rate: number) => Promise<void>;
    getRate: () => Promise<number>;
    getQueue: () => Promise<Track[]>;
    getActiveTrack: () => Promise<Track | undefined>;
    getActiveTrackIndex: () => Promise<number | undefined>;
    getPosition: () => Promise<number>;
    getPlaybackState: () => Promise<{ state: State }>;
    getProgress: () => Promise<Progress>;
    addEventListener: (event: Event, listener: (payload: never) => void) => void;
  };

  export function useProgress(updateInterval?: number): Progress;
  export function usePlaybackState(): { state: State | undefined };
  export function useActiveTrack(): Track | undefined;
  export function useTrackPlayerEvents(
    events: Event[],
    handler: (event: { type: Event }) => void,
  ): void;

  export default TrackPlayer;
}
