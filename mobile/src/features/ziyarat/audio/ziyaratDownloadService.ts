import RNFS from 'react-native-fs';

import { logger } from '@/core/logging/logger';

import {
  buildZiyaratTrackId,
  getZiyaratAudioDir,
  getZiyaratAudioFileName,
  getZiyaratStreamUrl,
} from '../constants/catalog';
import type { ZiyaratDownloadRecord, ZiyaratId } from '../types';

class ZiyaratDownloadService {
  getLocalPath(reciterId: string, id: ZiyaratId): string {
    return `${RNFS.DocumentDirectoryPath}/${getZiyaratAudioDir(reciterId)}/${getZiyaratAudioFileName(id)}`;
  }

  async ensureDir(reciterId: string): Promise<void> {
    const dir = `${RNFS.DocumentDirectoryPath}/${getZiyaratAudioDir(reciterId)}`;
    if (!(await RNFS.exists(dir))) await RNFS.mkdir(dir);
  }

  resolvePlaybackUrl(reciterId: string, id: ZiyaratId, localPath?: string | null): string {
    if (localPath) {
      return localPath.startsWith('file://') ? localPath : `file://${localPath}`;
    }
    return getZiyaratStreamUrl(id, reciterId);
  }

  async download(
    reciterId: string,
    id: ZiyaratId,
    onProgress?: (progress: number) => void,
  ): Promise<ZiyaratDownloadRecord> {
    await this.ensureDir(reciterId);
    const dest = this.getLocalPath(reciterId, id);

    if (await RNFS.exists(dest)) {
      const stat = await RNFS.stat(dest);
      return {
        ziyaratId: id,
        reciterId,
        localPath: dest,
        fileSizeBytes: Number(stat.size),
        downloadedAt: stat.mtime?.toISOString() ?? new Date().toISOString(),
      };
    }

    const task = RNFS.downloadFile({
      fromUrl: getZiyaratStreamUrl(id, reciterId),
      toFile: dest,
      background: true,
      discretionary: true,
      progress: (res) => {
        if (res.contentLength > 0) onProgress?.(res.bytesWritten / res.contentLength);
      },
    });

    const result = await task.promise;
    if (result.statusCode !== 200) {
      await RNFS.unlink(dest).catch(() => undefined);
      logger.warn('Ziyarat audio download failed', { id, status: result.statusCode });
      throw new Error(`Download failed: ${result.statusCode}`);
    }

    const stat = await RNFS.stat(dest);
    onProgress?.(1);
    return {
      ziyaratId: id,
      reciterId,
      localPath: dest,
      fileSizeBytes: Number(stat.size),
      downloadedAt: new Date().toISOString(),
    };
  }

  async remove(reciterId: string, id: ZiyaratId): Promise<void> {
    const path = this.getLocalPath(reciterId, id);
    if (await RNFS.exists(path)) await RNFS.unlink(path);
  }

  getTrackId(reciterId: string, id: ZiyaratId): string {
    return buildZiyaratTrackId(reciterId, id);
  }
}

export const ziyaratDownloadService = new ZiyaratDownloadService();
