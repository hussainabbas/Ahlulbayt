import TrackPlayer, { State, type Track } from 'react-native-track-player';

import { setupTrackPlayer } from '@/features/quran/audio/engine/trackPlayerSetup';

import { buildDuaTrackId } from '../constants/catalog';
import { DuaRepository } from '../engine/duaRepository';
import type { DuaId } from '../types';
import { duaDownloadService } from './duaDownloadService';

class DuaAudioService {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    await setupTrackPlayer();
    this.initialized = true;
  }

  async buildTrack(reciterId: string, duaId: DuaId, localPath?: string | null): Promise<Track> {
    const meta = DuaRepository.getMeta(duaId);
    const url = duaDownloadService.resolvePlaybackUrl(reciterId, duaId, localPath);

    return {
      id: buildDuaTrackId(reciterId, duaId),
      url,
      title: meta?.titles.en ?? duaId,
      artist: 'Dua Recitation',
      album: 'Duas',
      genre: 'Dua',
      duaId,
      reciterId,
    };
  }

  async play(reciterId: string, duaId: DuaId, localPath?: string | null): Promise<void> {
    await this.initialize();
    const track = await this.buildTrack(reciterId, duaId, localPath);
    await TrackPlayer.reset();
    await TrackPlayer.add(track);
    await TrackPlayer.play();
  }

  async togglePlay(reciterId: string, duaId: DuaId, localPath?: string | null): Promise<void> {
    await this.initialize();
    const state = await TrackPlayer.getPlaybackState();
    const active = await TrackPlayer.getActiveTrack();
    const trackId = buildDuaTrackId(reciterId, duaId);

    if (active?.id === trackId && state.state === State.Playing) {
      await TrackPlayer.pause();
      return;
    }

    if (active?.id === trackId && state.state === State.Paused) {
      await TrackPlayer.play();
      return;
    }

    await this.play(reciterId, duaId, localPath);
  }

  async pause(): Promise<void> {
    await TrackPlayer.pause();
  }

  async stop(): Promise<void> {
    await TrackPlayer.reset();
  }

  async getIsPlaying(duaId: DuaId, reciterId: string): Promise<boolean> {
    const state = await TrackPlayer.getPlaybackState();
    const active = await TrackPlayer.getActiveTrack();
    return (
      active?.id === buildDuaTrackId(reciterId, duaId) && state.state === State.Playing
    );
  }
}

export const duaAudioService = new DuaAudioService();
