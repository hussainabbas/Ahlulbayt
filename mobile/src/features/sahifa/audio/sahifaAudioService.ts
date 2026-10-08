import TrackPlayer, { State, type Track } from 'react-native-track-player';

import { setupTrackPlayer } from '@/features/quran/audio/engine/trackPlayerSetup';

import { buildSahifaTrackId } from '../constants/catalog';
import { SahifaRepository } from '../engine/sahifaRepository';
import type { SahifaId } from '../types';
import { sahifaDownloadService } from './sahifaDownloadService';

class SahifaAudioService {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    await setupTrackPlayer();
    this.initialized = true;
  }

  async buildTrack(reciterId: string, sahifaId: SahifaId, localPath?: string | null): Promise<Track> {
    const meta = SahifaRepository.getMeta(sahifaId);
    const url = sahifaDownloadService.resolvePlaybackUrl(reciterId, sahifaId, localPath);

    return {
      id: buildSahifaTrackId(reciterId, sahifaId),
      url,
      title: meta?.titles.en ?? sahifaId,
      artist: 'Sahifa Sajjadiya',
      album: 'Al-Sahifa al-Sajjadiyya',
      genre: 'Dua',
      sahifaId,
      reciterId,
    };
  }

  async play(reciterId: string, sahifaId: SahifaId, localPath?: string | null): Promise<void> {
    await this.initialize();
    const track = await this.buildTrack(reciterId, sahifaId, localPath);
    await TrackPlayer.reset();
    await TrackPlayer.add(track);
    await TrackPlayer.play();
  }

  async togglePlay(reciterId: string, sahifaId: SahifaId, localPath?: string | null): Promise<void> {
    await this.initialize();
    const state = await TrackPlayer.getPlaybackState();
    const active = await TrackPlayer.getActiveTrack();
    const trackId = buildSahifaTrackId(reciterId, sahifaId);

    if (active?.id === trackId && state.state === State.Playing) {
      await TrackPlayer.pause();
      return;
    }

    if (active?.id === trackId && state.state === State.Paused) {
      await TrackPlayer.play();
      return;
    }

    await this.play(reciterId, sahifaId, localPath);
  }

  async pause(): Promise<void> {
    await TrackPlayer.pause();
  }

  async stop(): Promise<void> {
    await TrackPlayer.reset();
  }

  async getIsPlaying(sahifaId: SahifaId, reciterId: string): Promise<boolean> {
    const state = await TrackPlayer.getPlaybackState();
    const active = await TrackPlayer.getActiveTrack();
    return (
      active?.id === buildSahifaTrackId(reciterId, sahifaId) && state.state === State.Playing
    );
  }
}

export const sahifaAudioService = new SahifaAudioService();
