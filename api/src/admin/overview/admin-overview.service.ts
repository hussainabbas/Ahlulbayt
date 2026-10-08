import { Inject, Injectable } from '@nestjs/common';
import { count, eq, gte, isNotNull } from 'drizzle-orm';

import { AdminAnalyticsService } from '../analytics/admin-analytics.service';
import { DRIZZLE, DrizzleDB } from '../../database/database.module';
import {
  featureFlags,
  islamicEvents,
  notificationCampaigns,
  securityEvents,
  users,
} from '../../database/schema';

@Injectable()
export class AdminOverviewService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly analytics: AdminAnalyticsService,
  ) {}

  async getExecutiveOverview() {
    const analyticsOverview = await this.analytics.overview();
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      [activeFlags],
      [draftCampaigns],
      [publishedEvents],
      [openSecurityEvents],
      [bannedUsers],
    ] = await Promise.all([
      this.db.select({ c: count() }).from(featureFlags).where(eq(featureFlags.enabled, true)),
      this.db
        .select({ c: count() })
        .from(notificationCampaigns)
        .where(eq(notificationCampaigns.status, 'draft')),
      this.db
        .select({ c: count() })
        .from(islamicEvents)
        .where(eq(islamicEvents.status, 'published')),
      this.db
        .select({ c: count() })
        .from(securityEvents)
        .where(gte(securityEvents.createdAt, monthAgo)),
      this.db
        .select({ c: count() })
        .from(users)
        .where(isNotNull(users.deletedAt)),
    ]);

    return {
      ...analyticsOverview,
      platform: {
        activeFeatureFlags: activeFlags?.c ?? 0,
        draftNotificationCampaigns: draftCampaigns?.c ?? 0,
        publishedIslamicEvents: publishedEvents?.c ?? 0,
        securityEvents30d: openSecurityEvents?.c ?? 0,
        recentBans: bannedUsers?.c ?? 0,
      },
      charts: {
        signups30d: await this.analytics.signupTrend(30),
        engagement30d: await this.analytics.engagement(30),
      },
      status: 'stub_charts',
    };
  }
}
