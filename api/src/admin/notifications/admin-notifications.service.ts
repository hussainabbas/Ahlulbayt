import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, count, desc, eq, sql } from 'drizzle-orm';

import { DRIZZLE, DrizzleDB } from '../../database/database.module';
import { devices, notificationCampaigns } from '../../database/schema';
import { AdminAuditService } from '../audit/admin-audit.service';
import { CreateCampaignDto, PreviewSegmentDto } from './dto/admin-notifications.dto';

@Injectable()
export class AdminNotificationsService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly audit: AdminAuditService,
  ) {}

  async listCampaigns() {
    const rows = await this.db
      .select()
      .from(notificationCampaigns)
      .orderBy(desc(notificationCampaigns.createdAt))
      .limit(50);

    return {
      items: rows.map((c) => ({
        id: c.id,
        title: c.title,
        body: c.body,
        segment: c.segment,
        status: c.status,
        scheduledAt: c.scheduledAt?.toISOString() ?? null,
        sentAt: c.sentAt?.toISOString() ?? null,
        recipientCount: c.recipientCount,
        createdAt: c.createdAt.toISOString(),
      })),
    };
  }

  async createCampaign(actorId: string, dto: CreateCampaignDto) {
    const [row] = await this.db
      .insert(notificationCampaigns)
      .values({
        title: dto.title,
        body: dto.body,
        segment: dto.segment ?? {},
        createdBy: actorId,
      })
      .returning();

    return { id: row!.id, status: row!.status };
  }

  async previewSegment(dto: PreviewSegmentDto) {
    const segment = dto.segment ?? {};
    const conditions = [];

    if (segment.platform && typeof segment.platform === 'string') {
      conditions.push(eq(devices.platform, segment.platform));
    }
    if (segment.locale && typeof segment.locale === 'string') {
      conditions.push(eq(devices.locale, segment.locale));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const [row] = await this.db
      .select({ c: count() })
      .from(devices)
      .where(where);

    return { estimatedRecipients: row?.c ?? 0, segment };
  }

  async sendCampaign(actorId: string, campaignId: string, ip?: string) {
    const [campaign] = await this.db
      .select()
      .from(notificationCampaigns)
      .where(eq(notificationCampaigns.id, campaignId))
      .limit(1);

    if (!campaign) throw new NotFoundException('Campaign not found');

    const preview = await this.previewSegment({ segment: campaign.segment as Record<string, unknown> });

    await this.db
      .update(notificationCampaigns)
      .set({
        status: 'sent',
        sentAt: new Date(),
        recipientCount: preview.estimatedRecipients,
        updatedAt: new Date(),
      })
      .where(eq(notificationCampaigns.id, campaignId));

    await this.audit.log({
      actorId,
      action: 'notification.send',
      targetType: 'campaign',
      targetId: campaignId,
      payload: { recipientCount: preview.estimatedRecipients },
      ipAddress: ip,
    });

    // Phase 2: enqueue BullMQ job → FCM/APNs
    return {
      sent: true,
      campaignId,
      recipientCount: preview.estimatedRecipients,
      note: 'Push delivery queued (worker phase 2)',
    };
  }
}
