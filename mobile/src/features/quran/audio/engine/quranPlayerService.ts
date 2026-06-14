import TrackPlayer, { type Track } from 'react-native-track-player';

import { logger } from '@/core/logging/logger';

import {
  buildTrackId,
  getReciterLabel,
  getSurahTrackTitle,
  parseTrackId,
} from '../constants/audioSources';
import { useQuranPlayerStore } from '../stores/quranPlayerStore';
import { audioDownloadService } from './audioDownloadService';
import { mapRepeatMode, setupTrackPlayer, unmapRepeatMode } from './trackPlayerSetup';
import type { PlaybackSpeed, QuranRepeatMode } from '../types';

class QuranPlayerService {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    await setupTrackPlayer();
    this.initialized = true;
  }

  async buildTrack(reciterId: string, surah: number, reciterLabel?: string): Promise<Track> {
    const { title, subtitle, arabic } = getSurahTrackTitle(surah);
    const local = await audioDownloadService.getDownloadRecord(reciterId, surah);
    const url = audioDownloadService.resolvePlaybackUrl(reciterId, surah, local?.localPath);

    return {
      id: buildTrackId(reciterId, surah),
      url,
      title,
      artist: reciterLabel ?? getReciterLabel(reciterId),
      album: 'Quran',
      description: subtitle,
      genre: 'Quran',
      headers: { 'User-Agent': 'AhlulBaytPlus/1.0' },
      isLiveStream: false,
      surah,
      reciterId,
      surahNameArabic: arabic,
    };
  }

  async buildAyahTrack(
    reciterId: string,
    surah: number,
    ayah: number,
    streamUrl: string,
  ): Promise<Track> {
    const { title, arabic } = getSurahTrackTitle(surah);
    return {
      id: `${reciterId}:${surah}:${ayah}`,
      url: streamUrl,
      title: `${title} — ${ayah}`,
      artist: getReciterLabel(reciterId),
      album: 'Quran',
      description: arabic,
      surah,
      ayah,
      reciterId,
    };
  }

  async playSurah(reciterId: string, surah: number, reciterLabel?: string): Promise<void> {
    await this.initialize();
    const track = await this.buildTrack(reciterId, surah, reciterLabel);
    await TrackPlayer.reset();
    await TrackPlayer.add(track);
    await TrackPlayer.play();
  }

  async playQueue(
    reciterId: string,
    surahs: number[],
    startIndex = 0,
    reciterLabel?: string,
  ): Promise<void> {
    await this.initialize();
    const tracks = await Promise.all(
      surahs.map((s) => this.buildTrack(reciterId, s, reciterLabel)),
    );
    await TrackPlayer.reset();
    await TrackPlayer.add(tracks);
    if (startIndex > 0) {
      await TrackPlayer.skip(startIndex);
    }
    await TrackPlayer.play();
  }

  async appendToQueue(reciterId: string, surah: number, reciterLabel?: string): Promise<void> {
    await this.initialize();
    const track = await this.buildTrack(reciterId, surah, reciterLabel);
    const queue = await TrackPlayer.getQueue();
    const exists = queue.some((t) => t.id === track.id);
    if (!exists) {
      await TrackPlayer.add(track);
    }
    const active = await TrackPlayer.getActiveTrack();
    if (!active) {
      await TrackPlayer.skip(0);
      await TrackPlayer.play();
    }
  }

  async playAyah(
    reciterId: string,
    surah: number,
    ayah: number,
    streamUrl: string,
  ): Promise<void> {
    await this.initialize();
    const track = await this.buildAyahTrack(reciterId, surah, ayah, streamUrl);
    await TrackPlayer.reset();
    await TrackPlayer.add(track);
    await TrackPlayer.play();
  }

  async togglePlayback(): Promise<void> {
    const state = await TrackPlayer.getPlaybackState();
    if (state.state === 'playing') {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  }

  async pause(): Promise<void> {
    await TrackPlayer.pause();
  }

  async play(): Promise<void> {
    await TrackPlayer.play();
  }

  async seekTo(seconds: number): Promise<void> {
    await TrackPlayer.seekTo(seconds);
  }

  async skipNext(): Promise<void> {
    await TrackPlayer.skipToNext();
  }

  async skipPrevious(): Promise<void> {
    await TrackPlayer.skipToPrevious();
  }

  async setRepeatMode(mode: QuranRepeatMode): Promise<void> {
    await TrackPlayer.setRepeatMode(mapRepeatMode(mode));
  }

  async getRepeatMode(): Promise<QuranRepeatMode> {
    const mode = await TrackPlayer.getRepeatMode();
    return unmapRepeatMode(mode);
  }

  async setPlaybackRate(rate: PlaybackSpeed): Promise<void> {
    await TrackPlayer.setRate(rate);
  }

  async getPlaybackRate(): Promise<number> {
    return TrackPlayer.getRate();
  }

  async getQueueSurahs(): Promise<number[]> {
    const queue = await TrackPlayer.getQueue();
    return queue
      .map((t) => (t as Track & { surah?: number }).surah)
      .filter((s): s is number => typeof s === 'number');
  }

  async stop(): Promise<void> {
    await TrackPlayer.reset();
    useQuranPlayerStore.getState().clearPlaybackResume();
  }

  async saveCurrentPosition(): Promise<void> {
    const active = await TrackPlayer.getActiveTrack();
    if (!active?.id) return;

    const position = await TrackPlayer.getPosition();
    if (position < 1) return;

    const meta = active as Track & { reciterId?: string; surah?: number };
    let reciterId = meta.reciterId;
    let surah = meta.surah;

    if (reciterId == null || surah == null) {
      const parsed = parseTrackId(String(active.id));
      reciterId = parsed.reciterId;
      surah = parsed.surah;
    }

    useQuranPlayerStore.getState().savePlaybackResume({
      trackId: String(active.id),
      reciterId,
      surah,
      positionSec: position,
      updatedAt: new Date().toISOString(),
    });
  }

  async restoreLastPlayback(): Promise<boolean> {
    const { lastPlayback, clearPlaybackResume } = useQuranPlayerStore.getState();
    if (!lastPlayback) return false;

    const ageMs = Date.now() - new Date(lastPlayback.updatedAt).getTime();
    if (ageMs > 7 * 24 * 60 * 60 * 1000) {
      clearPlaybackResume();
      return false;
    }

    if (lastPlayback.positionSec < 3) return false;

    await this.playSurah(lastPlayback.reciterId, lastPlayback.surah);
    await TrackPlayer.seekTo(lastPlayback.positionSec);
    await TrackPlayer.pause();
    return true;
  }

  async continueToNextSurah(reciterId: string): Promise<boolean> {
    const queue = await TrackPlayer.getQueue();
    const activeIndex = await TrackPlayer.getActiveTrackIndex();
    const current =
      activeIndex != null && activeIndex >= 0
        ? (queue[activeIndex] as Track & { surah?: number })
        : (queue[queue.length - 1] as Track & { surah?: number });

    const surah = current?.surah;
    if (surah == null || surah >= 114) return false;

    const nextSurah = surah + 1;
    const nextTrack = await this.buildTrack(reciterId, nextSurah);
    await TrackPlayer.add(nextTrack);
    await TrackPlayer.skipToNext();
    await TrackPlayer.play();
    return true;
  }

  async refreshTrackSources(reciterId: string): Promise<void> {
    const queue = await TrackPlayer.getQueue();
    if (!queue.length) return;

    const activeIndex = await TrackPlayer.getActiveTrackIndex();
    const position = await TrackPlayer.getPosition();
    const wasPlaying = (await TrackPlayer.getPlaybackState()).state === 'playing';

    const rebuilt = await Promise.all(
      queue.map(async (track) => {
        const meta = track as Track & { surah?: number; reciterId?: string };
        if (meta.surah == null) return track;
        const rid = meta.reciterId ?? reciterId;
        return this.buildTrack(rid, meta.surah);
      }),
    );

    await TrackPlayer.reset();
    await TrackPlayer.add(rebuilt);
    if (activeIndex != null && activeIndex >= 0) {
      await TrackPlayer.skip(activeIndex);
      await TrackPlayer.seekTo(position);
      if (wasPlaying) await TrackPlayer.play();
    }

    logger.info('Refreshed queue with offline sources');
  }
}

export const quranPlayerService = new QuranPlayerService();
