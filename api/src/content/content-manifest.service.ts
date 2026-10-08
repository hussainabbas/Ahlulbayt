import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { ContentManifest } from '../common/types/content.types';
import { CacheService } from '../redis/cache.service';

import { MANIFEST_BUNDLES, MANIFEST_VERSION } from './data/manifest.bundles';

@Injectable()
export class ContentManifestService {
  constructor(
    private readonly config: ConfigService,
    private readonly cache: CacheService,
  ) {}

  async getManifest(): Promise<ContentManifest> {
    const cached = await this.cache.get<ContentManifest>('content:manifest');
    if (cached) return cached;

    const cdnBase =
      this.config.get<string>('CONTENT_CDN_BASE_URL') ??
      this.config.get<string>('APP_PUBLIC_URL') ??
      (this.config.get<string>('RAILWAY_PUBLIC_DOMAIN')
        ? `https://${this.config.get<string>('RAILWAY_PUBLIC_DOMAIN')}`
        : '');

    const manifest: ContentManifest = {
      version: MANIFEST_VERSION,
      generatedAt: new Date().toISOString(),
      bundles: MANIFEST_BUNDLES.map((b) => ({
        ...b,
        url: cdnBase ? `${cdnBase.replace(/\/$/, '')}${b.url}` : b.url,
      })),
    };

    await this.cache.set('content:manifest', manifest, 3600);
    return manifest;
  }
}
