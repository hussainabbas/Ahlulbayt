import { Injectable } from '@nestjs/common';

import { ContentManifestService } from '../../content/content-manifest.service';
import { DUAS_CATALOG } from '../../duas/data/duas-catalog';
import { CALENDAR_EVENTS } from '../../calendar/data/calendar-events';
import { ZIYARAT_CATALOG } from '../../ziyarat/data/ziyarat-catalog';
import { AdminAuditService } from '../audit/admin-audit.service';
import { PublishManifestDto } from './dto/admin-content.dto';

type ContentDomain = 'duas' | 'ziyarat' | 'calendar';

@Injectable()
export class AdminContentService {
  constructor(
    private readonly manifest: ContentManifestService,
    private readonly audit: AdminAuditService,
  ) {}

  async getManifest() {
    return this.manifest.getManifest();
  }

  async publishManifest(actorId: string, dto: PublishManifestDto, ip?: string) {
    await this.audit.log({
      actorId,
      action: 'manifest.publish',
      targetType: 'manifest',
      targetId: dto.version,
      payload: { bundleCount: dto.bundles.length },
      ipAddress: ip,
    });

    return {
      published: true,
      version: dto.version,
      publishedAt: new Date().toISOString(),
      note: 'Persist to content_manifests table when migration 0003 applied',
    };
  }

  listDomain(domain: ContentDomain) {
    switch (domain) {
      case 'duas':
        return { total: DUAS_CATALOG.length, items: DUAS_CATALOG };
      case 'ziyarat':
        return { total: ZIYARAT_CATALOG.length, items: ZIYARAT_CATALOG };
      case 'calendar':
        return { total: CALENDAR_EVENTS.length, items: CALENDAR_EVENTS };
      default:
        return { total: 0, items: [] };
    }
  }

  async getDomainEntry(domain: ContentDomain, id: string) {
    const list = this.listDomain(domain);
    const item = list.items.find((i: { id: string }) => i.id === id);
    if (!item) return { found: false };
    return { found: true, item };
  }
}
