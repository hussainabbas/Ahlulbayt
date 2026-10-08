import RNFS from 'react-native-fs';

import { logger } from '@/core/logging/logger';

import {
  buildNahjulTrackId,
  getNahjulAudioDir,
  getNahjulAudioFileName,
  getNahjulStreamUrl,
} from '../constants/catalog';
import type { NahjulDownloadRecord, NahjulId } from '../types';

class NahjulDownloadService {
  getLocalPath(reciterId: string, nahjulId: NahjulId): string {
    return `${RNFS.DocumentDirectoryPath}/${getNahjulAudioDir(reciterId)}/${getNahjulAudioFileName(nahjulId)}`;
  }

  async ensureDir(reciterId: string): Promise<string> {
    const dir = `${RNFS.DocumentDirectoryPath}/${getNahjulAudioDir(reciterId)}`;
    if (!(await RNFS.exists(dir))) {
      await RNFS.mkdir(dir);
    }
    return dir;
  }

  resolvePlaybackUrl(reciterId: string, nahjulId: NahjulId, localPath?: string | null): string {
    if (localPath) {
      return localPath.startsWith('file://') ? localPath : `file://${localPath}`;
    }
    return getNahjulStreamUrl(nahjulId, reciterId);
  }

  async download(
    reciterId: string,
    nahjulId: NahjulId,
    onProgress?: (progress: number) => void,
  ): Promise<NahjulDownloadRecord> {
    await this.ensureDir(reciterId);
    const dest = this.getLocalPath(reciterId, nahjulId);
    onProgress?.(0);

    const task = RNFS.downloadFile({
      fromUrl: getNahjulStreamUrl(nahjulId, reciterId),
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
      logger.warn('Nahjul audio download failed', { nahjulId, reciterId, status: result.statusCode });
      throw new Error(`Download failed: ${result.statusCode}`);
    }

    const stat = await RNFS.stat(dest);
    onProgress?.(1);

    return {
      nahjulId,
      reciterId,
      localPath: dest,
      fileSizeBytes: Number(stat.size),
      downloadedAt: new Date().toISOString(),
    };
  }

  async remove(reciterId: string, nahjulId: NahjulId): Promise<void> {
    const path = this.getLocalPath(reciterId, nahjulId);
    if (await RNFS.exists(path)) {
      await RNFS.unlink(path);
    }
  }

  getTrackId(reciterId: string, nahjulId: NahjulId): string {
    return buildNahjulTrackId(reciterId, nahjulId);
  }
}

export const nahjulDownloadService = new NahjulDownloadService();
