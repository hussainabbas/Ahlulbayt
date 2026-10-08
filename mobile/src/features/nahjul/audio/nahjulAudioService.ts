import TrackPlayer, { State, type Track } from 'react-native-track-player';

import { setupTrackPlayer } from '@/features/quran/audio/engine/trackPlayerSetup';

import { buildNahjulTrackId } from '../constants/catalog';
import { NahjulRepository } from '../engine/nahjulRepository';
import type { NahjulId } from '../types';
import { nahjulDownloadService } from './nahjulDownloadService';

class NahjulAudioService {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    await setupTrackPlayer();
    this.initialized = true;
  }

  async buildTrack(reciterId: string, nahjulId: NahjulId, localPath?: string | null): Promise<Track> {
    const meta = NahjulRepository.getMeta(nahjulId);
    const url = nahjulDownloadService.resolvePlaybackUrl(reciterId, nahjulId, localPath);

    return {
      id: buildNahjulTrackId(reciterId, nahjulId),
      url,
      title: meta?.titles.en ?? nahjulId,
      artist: 'Nahjul Balagha',
      album: 'Peak of Eloquence',
      genre: 'Sermon',
      nahjulId,
      reciterId,
    };
  }

  async play(reciterId: string, nahjulId: NahjulId, localPath?: string | null): Promise<void> {
    await this.initialize();
    const track = await this.buildTrack(reciterId, nahjulId, localPath);
    await TrackPlayer.reset();
    await TrackPlayer.add(track);
    await TrackPlayer.play();
  }

  async togglePlay(reciterId: string, nahjulId: NahjulId, localPath?: string | null): Promise<void> {
    await this.initialize();
    const state = await TrackPlayer.getPlaybackState();
    const active = await TrackPlayer.getActiveTrack();
    const trackId = buildNahjulTrackId(reciterId, nahjulId);

    if (active?.id === trackId && state.state === State.Playing) {
      await TrackPlayer.pause();
      return;
    }
    if (active?.id === trackId && state.state === State.Paused) {
      await TrackPlayer.play();
      return;
    }
    await this.play(reciterId, nahjulId, localPath);
  }

  async stop(): Promise<void> {
    await TrackPlayer.reset();
  }

  async getIsPlaying(nahjulId: NahjulId, reciterId: string): Promise<boolean> {
    const state = await TrackPlayer.getPlaybackState();
    const active = await TrackPlayer.getActiveTrack();
    return active?.id === buildNahjulTrackId(reciterId, nahjulId) && state.state === State.Playing;
  }
}

export const nahjulAudioService = new NahjulAudioService();
