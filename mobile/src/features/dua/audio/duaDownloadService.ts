import RNFS from 'react-native-fs';

import { logger } from '@/core/logging/logger';

import {
  buildDuaTrackId,
  getDuaAudioDir,
  getDuaAudioFileName,
  getDuaStreamUrl,
} from '../constants/catalog';
import type { DuaDownloadRecord, DuaId } from '../types';

class DuaDownloadService {
  getLocalPath(reciterId: string, duaId: DuaId): string {
    return `${RNFS.DocumentDirectoryPath}/${getDuaAudioDir(reciterId)}/${getDuaAudioFileName(duaId)}`;
  }

  async ensureDir(reciterId: string): Promise<string> {
    const dir = `${RNFS.DocumentDirectoryPath}/${getDuaAudioDir(reciterId)}`;
    if (!(await RNFS.exists(dir))) {
      await RNFS.mkdir(dir);
    }
    return dir;
  }

  async isDownloaded(reciterId: string, duaId: DuaId): Promise<boolean> {
    return RNFS.exists(this.getLocalPath(reciterId, duaId));
  }

  resolvePlaybackUrl(reciterId: string, duaId: DuaId, localPath?: string | null): string {
    if (localPath) {
      return localPath.startsWith('file://') ? localPath : `file://${localPath}`;
    }
    return getDuaStreamUrl(duaId, reciterId);
  }

  async download(
    reciterId: string,
    duaId: DuaId,
    onProgress?: (progress: number) => void,
  ): Promise<DuaDownloadRecord> {
    await this.ensureDir(reciterId);
    const dest = this.getLocalPath(reciterId, duaId);

    if (await RNFS.exists(dest)) {
      const stat = await RNFS.stat(dest);
      return {
        duaId,
        reciterId,
        localPath: dest,
        fileSizeBytes: Number(stat.size),
        downloadedAt: stat.mtime?.toISOString() ?? new Date().toISOString(),
      };
    }

    const url = getDuaStreamUrl(duaId, reciterId);
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
      logger.warn('Dua audio download failed', { duaId, reciterId, status: result.statusCode });
      throw new Error(`Download failed: ${result.statusCode}`);
    }

    const stat = await RNFS.stat(dest);
    onProgress?.(1);

    return {
      duaId,
      reciterId,
      localPath: dest,
      fileSizeBytes: Number(stat.size),
      downloadedAt: new Date().toISOString(),
    };
  }

  async remove(reciterId: string, duaId: DuaId): Promise<void> {
    const path = this.getLocalPath(reciterId, duaId);
    if (await RNFS.exists(path)) {
      await RNFS.unlink(path);
    }
  }

  getTrackId(reciterId: string, duaId: DuaId): string {
    return buildDuaTrackId(reciterId, duaId);
  }
}

export const duaDownloadService = new DuaDownloadService();
