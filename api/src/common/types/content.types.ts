export type ContentDomain = 'quran' | 'duas' | 'ziyarat' | 'prayer';

export interface ContentBundle {
  domain: ContentDomain;
  id: string;
  version: number;
  sha256: string;
  url: string;
  sizeBytes: number;
  compression: 'gzip' | 'none';
  optional: boolean;
}

export interface ContentManifest {
  version: string;
  generatedAt: string;
  bundles: ContentBundle[];
}

export interface SyncChange {
  entityType: string;
  entityId: string;
  operation: 'create' | 'update' | 'delete';
  payload: Record<string, unknown>;
  clientUpdatedAt?: string;
}

export interface SyncPullResponse {
  cursor: number;
  changes: Array<{
    id: number;
    entityType: string;
    entityId: string;
    operation: string;
    payload: Record<string, unknown>;
    createdAt: string;
  }>;
  hasMore: boolean;
}
