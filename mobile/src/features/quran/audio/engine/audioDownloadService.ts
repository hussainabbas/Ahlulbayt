import RNFS from 'react-native-fs';

import { logger } from '@/core/logging/logger';

import {
  buildTrackId,
  getAudioStorageDir,
  getSurahFileName,
  getSurahStreamUrl,
} from '../constants/audioSources';
import type { DownloadJob, DownloadRecord } from '../types';

type ProgressCallback = (job: DownloadJob) => void;

class AudioDownloadService {
  private activeJobIds = new Map<string, number>();

  getLocalPath(reciterId: string, surah: number): string {
    return `${RNFS.DocumentDirectoryPath}/${getAudioStorageDir(reciterId)}/${getSurahFileName(surah)}`;
  }

  async ensureDir(reciterId: string): Promise<string> {
    const dir = `${RNFS.DocumentDirectoryPath}/${getAudioStorageDir(reciterId)}`;
    const exists = await RNFS.exists(dir);
    if (!exists) {
      await RNFS.mkdir(dir);
    }
    return dir;
  }

  async isDownloaded(reciterId: string, surah: number): Promise<boolean> {
    const path = this.getLocalPath(reciterId, surah);
    return RNFS.exists(path);
  }

  async getDownloadRecord(reciterId: string, surah: number): Promise<DownloadRecord | null> {
    const path = this.getLocalPath(reciterId, surah);
    const exists = await RNFS.exists(path);
    if (!exists) return null;

    const stat = await RNFS.stat(path);
    return {
      id: buildTrackId(reciterId, surah),
      reciterId,
      surah,
      localPath: path,
      fileSizeBytes: Number(stat.size),
      downloadedAt: stat.mtime?.toISOString() ?? new Date().toISOString(),
    };
  }

  resolvePlaybackUrl(reciterId: string, surah: number, localPath?: string | null): string {
    if (localPath) {
      return localPath.startsWith('file://') ? localPath : `file://${localPath}`;
    }
    return getSurahStreamUrl(reciterId, surah);
  }

  async downloadSurah(
    reciterId: string,
    surah: number,
    onProgress?: ProgressCallback,
  ): Promise<DownloadRecord> {
    const id = buildTrackId(reciterId, surah);
    await this.ensureDir(reciterId);

    const dest = this.getLocalPath(reciterId, surah);
    const already = await RNFS.exists(dest);
    if (already) {
      const record = await this.getDownloadRecord(reciterId, surah);
      if (record) return record;
    }

    const url = getSurahStreamUrl(reciterId, surah);
    onProgress?.({ id, reciterId, surah, progress: 0, status: 'downloading' });

    const task = RNFS.downloadFile({
      fromUrl: url,
      toFile: dest,
      background: true,
      discretionary: true,
      progressInterval: 250,
      progress: (res) => {
        const progress = res.contentLength > 0 ? res.bytesWritten / res.contentLength : 0;
        onProgress?.({
          id,
          reciterId,
          surah,
          progress: Math.min(progress, 0.99),
          status: 'downloading',
        });
      },
    });

    this.activeJobIds.set(id, task.jobId);

    try {
      const result = await task.promise;
      if (result.statusCode >= 400) {
        throw new Error(`Download failed (${result.statusCode})`);
      }

      const record = await this.getDownloadRecord(reciterId, surah);
      if (!record) throw new Error('Download completed but file missing');

      onProgress?.({ id, reciterId, surah, progress: 1, status: 'completed' });
      logger.info('Surah audio downloaded', { reciterId, surah });
      return record;
    } catch (error) {
      await RNFS.unlink(dest).catch(() => undefined);
      onProgress?.({
        id,
        reciterId,
        surah,
        progress: 0,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Download failed',
      });
      throw error;
    } finally {
      this.activeJobIds.delete(id);
    }
  }

  async deleteDownload(reciterId: string, surah: number): Promise<void> {
    const path = this.getLocalPath(reciterId, surah);
    const exists = await RNFS.exists(path);
    if (exists) {
      await RNFS.unlink(path);
    }
  }

  async getTotalOfflineSize(reciterId?: string): Promise<number> {
    const base = `${RNFS.DocumentDirectoryPath}/quran-audio`;
    const exists = await RNFS.exists(base);
    if (!exists) return 0;

    const reciters = reciterId ? [reciterId] : await RNFS.readDir(base).then((d) => d.map((x) => x.name));
    let total = 0;

    for (const rid of reciters) {
      const dir = `${base}/${rid}`;
      if (!(await RNFS.exists(dir))) continue;
      const files = await RNFS.readDir(dir);
      for (const file of files) {
        if (file.isFile()) total += Number(file.size);
      }
    }

    return total;
  }

  cancelDownload(reciterId: string, surah: number): void {
    const id = buildTrackId(reciterId, surah);
    const jobId = this.activeJobIds.get(id);
    if (jobId != null) {
      RNFS.stopDownload(jobId);
      this.activeJobIds.delete(id);
    }
  }
}

export const audioDownloadService = new AudioDownloadService();
