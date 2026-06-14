/** Offline-first content and synchronization types. */

export type ContentDomain = 'quran' | 'duas' | 'ziyarat' | 'prayer';

export type SyncDirection = 'pull' | 'push' | 'local';

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

export interface LocalBundleVersion {
  domain: ContentDomain;
  id: string;
  version: number;
  localPath?: string;
  sha256?: string;
  updatedAt: string;
}

export interface SyncPlanItem {
  domain: ContentDomain;
  bundleId: string;
  fromVersion: number;
  toVersion: number;
  url: string;
  sha256: string;
  sizeBytes: number;
  priority: number;
}

export interface DomainSyncResult {
  domain: ContentDomain;
  direction: SyncDirection;
  planned: number;
  downloaded: number;
  skipped: number;
  errors: string[];
}

export interface SyncReport {
  startedAt: string;
  completedAt: string;
  skipped: boolean;
  skipReason?: string;
  manifestVersion: string | null;
  domains: DomainSyncResult[];
  userDataFlushed: number;
}

export interface SyncOptions {
  /** Only sync on WiFi (cellular blocked for large pulls). */
  wifiOnly?: boolean;
  /** Force manifest fetch even if recently checked. */
  force?: boolean;
  /** Domains to sync; defaults to all. */
  domains?: ContentDomain[];
}

export interface ContentManifestLocalState {
  manifestVersion: string | null;
  lastCheckedAt: string | null;
  bundleVersions: Record<string, LocalBundleVersion>;
}
