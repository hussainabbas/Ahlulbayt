import TrackPlayer, { State, type Track } from 'react-native-track-player';

import { setupTrackPlayer } from '@/features/quran/audio/engine/trackPlayerSetup';

import { buildZiyaratTrackId } from '../constants/catalog';
import { ZiyaratRepository } from '../engine/ziyaratRepository';
import type { ZiyaratId } from '../types';
import { ziyaratDownloadService } from './ziyaratDownloadService';

class ZiyaratAudioService {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    await setupTrackPlayer();
    this.initialized = true;
  }

  async buildTrack(reciterId: string, id: ZiyaratId, localPath?: string | null): Promise<Track> {
    const meta = ZiyaratRepository.getMeta(id);
    const url = ziyaratDownloadService.resolvePlaybackUrl(reciterId, id, localPath);
    return {
      id: buildZiyaratTrackId(reciterId, id),
      url,
      title: meta?.titles.en ?? id,
      artist: 'Ziyarat Recitation',
      album: 'Ziyarat',
      genre: 'Ziyarat',
      ziyaratId: id,
      reciterId,
    };
  }

  async play(reciterId: string, id: ZiyaratId, localPath?: string | null): Promise<void> {
    await this.initialize();
    const track = await this.buildTrack(reciterId, id, localPath);
    await TrackPlayer.reset();
    await TrackPlayer.add(track);
    await TrackPlayer.play();
  }

  async togglePlay(reciterId: string, id: ZiyaratId, localPath?: string | null): Promise<void> {
    await this.initialize();
    const state = await TrackPlayer.getPlaybackState();
    const active = await TrackPlayer.getActiveTrack();
    const trackId = buildZiyaratTrackId(reciterId, id);

    if (active?.id === trackId && state.state === State.Playing) {
      await TrackPlayer.pause();
      return;
    }
    if (active?.id === trackId && state.state === State.Paused) {
      await TrackPlayer.play();
      return;
    }
    await this.play(reciterId, id, localPath);
  }

  async getIsPlaying(id: ZiyaratId, reciterId: string): Promise<boolean> {
    const state = await TrackPlayer.getPlaybackState();
    const active = await TrackPlayer.getActiveTrack();
    return active?.id === buildZiyaratTrackId(reciterId, id) && state.state === State.Playing;
  }
}

export const ziyaratAudioService = new ZiyaratAudioService();
