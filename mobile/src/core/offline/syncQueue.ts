import { logger } from '@/core/logging/logger';
import { getString, setString } from '@/core/storage/mmkv';
import { StorageKeys } from '@/core/storage/keys';
import { networkManager } from '@/core/offline/network';

export type SyncOperation = {
  id: string;
  type: 'bookmark' | 'qadha' | 'reading_progress' | 'settings';
  payload: Record<string, unknown>;
  createdAt: string;
};

const QUEUE_KEY = 'sync.pending_operations';

function loadQueue(): SyncOperation[] {
  const raw = getString(QUEUE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SyncOperation[];
  } catch {
    return [];
  }
}

function saveQueue(queue: SyncOperation[]): void {
  setString(QUEUE_KEY, JSON.stringify(queue));
}

export const syncQueue = {
  enqueue(operation: Omit<SyncOperation, 'id' | 'createdAt'>): void {
    const queue = loadQueue();
    const entry: SyncOperation = {
      ...operation,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    queue.push(entry);
    saveQueue(queue);
    logger.debug('Sync operation enqueued', { type: entry.type, id: entry.id });
  },

  getAll(): SyncOperation[] {
    return loadQueue();
  },

  remove(id: string): void {
    saveQueue(loadQueue().filter((op) => op.id !== id));
  },

  clear(): void {
    saveQueue([]);
  },

  async flush(processor: (op: SyncOperation) => Promise<void>): Promise<void> {
    if (!networkManager.getIsConnected()) {
      return;
    }

    const queue = loadQueue();
    for (const operation of queue) {
      try {
        await processor(operation);
        this.remove(operation.id);
      } catch (error) {
        logger.error('Sync flush failed for operation', error, { id: operation.id });
        break;
      }
    }
  },

  getLastPulledAt(): string | null {
    return getString(StorageKeys.SYNC_TOKEN) ?? null;
  },

  setLastPulledAt(token: string): void {
    setString(StorageKeys.SYNC_TOKEN, token);
  },
};
