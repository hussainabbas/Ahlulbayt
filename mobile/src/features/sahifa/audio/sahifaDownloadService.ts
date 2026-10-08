import RNFS from 'react-native-fs';

import { logger } from '@/core/logging/logger';

import {
  buildSahifaTrackId,
  getSahifaAudioDir,
  getSahifaAudioFileName,
  getSahifaStreamUrl,
} from '../constants/catalog';
import type { SahifaDownloadRecord, SahifaId } from '../types';

class SahifaDownloadService {
  getLocalPath(reciterId: string, sahifaId: SahifaId): string {
    return `${RNFS.DocumentDirectoryPath}/${getSahifaAudioDir(reciterId)}/${getSahifaAudioFileName(sahifaId)}`;
  }

  async ensureDir(reciterId: string): Promise<string> {
    const dir = `${RNFS.DocumentDirectoryPath}/${getSahifaAudioDir(reciterId)}`;
    if (!(await RNFS.exists(dir))) {
      await RNFS.mkdir(dir);
    }
    return dir;
  }

  async isDownloaded(reciterId: string, sahifaId: SahifaId): Promise<boolean> {
    return RNFS.exists(this.getLocalPath(reciterId, sahifaId));
  }

  resolvePlaybackUrl(reciterId: string, sahifaId: SahifaId, localPath?: string | null): string {
    if (localPath) {
      return localPath.startsWith('file://') ? localPath : `file://${localPath}`;
    }
    return getSahifaStreamUrl(sahifaId, reciterId);
  }

  async download(
    reciterId: string,
    sahifaId: SahifaId,
    onProgress?: (progress: number) => void,
  ): Promise<SahifaDownloadRecord> {
    await this.ensureDir(reciterId);
    const dest = this.getLocalPath(reciterId, sahifaId);

    if (await RNFS.exists(dest)) {
      const stat = await RNFS.stat(dest);
      return {
        sahifaId,
        reciterId,
        localPath: dest,
        fileSizeBytes: Number(stat.size),
        downloadedAt: stat.mtime?.toISOString() ?? new Date().toISOString(),
      };
    }

    const url = getSahifaStreamUrl(sahifaId, reciterId);
    onProgress?.(0);

    const task = RNFS.downloadFile({
      fromUrl: url,
      toFile: dest,
      background: true,
      discretionary: true,
      progress: (res) => {
        if (res.contentLength > 0) {
          onProgress?.(res.bytesWritten / res.contentLength);
        }
      },
    });

    const result = await task.promise;
    if (result.statusCode !== 200) {
      await RNFS.unlink(dest).catch(() => undefined);
      logger.warn('Sahifa audio download failed', { sahifaId, reciterId, status: result.statusCode });
      throw new Error(`Download failed: ${result.statusCode}`);
    }

    const stat = await RNFS.stat(dest);
    onProgress?.(1);

    return {
      sahifaId,
      reciterId,
      localPath: dest,
      fileSizeBytes: Number(stat.size),
      downloadedAt: new Date().toISOString(),
    };
  }

  async remove(reciterId: string, sahifaId: SahifaId): Promise<void> {
    const path = this.getLocalPath(reciterId, sahifaId);
    if (await RNFS.exists(path)) {
      await RNFS.unlink(path);
    }
  }

  getTrackId(reciterId: string, sahifaId: SahifaId): string {
    return buildSahifaTrackId(reciterId, sahifaId);
  }
}

export const sahifaDownloadService = new SahifaDownloadService();
