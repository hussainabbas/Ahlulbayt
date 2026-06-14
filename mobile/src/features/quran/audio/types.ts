export type QuranRepeatMode = 'off' | 'one' | 'all';

export type SleepTimerMode = 'minutes' | 'end_of_surah';

export interface QuranAudioTrackMeta {
  id: string;
  surah: number;
  reciterId: string;
  title: string;
  subtitle: string;
  surahNameArabic: string;
  surahNameEnglish: string;
}

export interface QuranPlaylist {
  id: string;
  name: string;
  trackIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DownloadRecord {
  id: string;
  reciterId: string;
  surah: number;
  localPath: string;
  fileSizeBytes: number;
  downloadedAt: string;
}

export interface DownloadJob {
  id: string;
  reciterId: string;
  surah: number;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'failed';
  error?: string;
}

export const PLAYBACK_SPEEDS = [0.75, 0.875, 1, 1.1, 1.25, 1.5, 1.75, 2] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

export const SLEEP_TIMER_MINUTES = [5, 10, 15, 30, 45, 60, 90] as const;
