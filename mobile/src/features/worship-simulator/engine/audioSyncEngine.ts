import type { SimulatorAudioTrack } from '../types';

/** Preloads and plays step narration synced with poses. Phase 2: expo-av integration. */
export class AudioSyncEngine {
  private preloaded = new Set<string>();

  async preload(assetKey: string | undefined): Promise<void> {
    if (!assetKey || this.preloaded.has(assetKey)) return;
    // Phase 2: RNFS / Asset.loadAsync
    this.preloaded.add(assetKey);
  }

  async playStep(_track: SimulatorAudioTrack | null, onCue?: (text: string) => void): Promise<void> {
    if (!_track) return;
    for (const cue of _track.cues) {
      await new Promise<void>((r) => setTimeout(r, cue.endMs - cue.startMs));
      onCue?.(cue.text);
    }
  }

  stop(): void {
    // Phase 2: player.stop()
  }
}

export const worshipAudioSync = new AudioSyncEngine();
