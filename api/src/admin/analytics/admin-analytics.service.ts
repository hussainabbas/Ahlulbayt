import { Inject, Injectable } from '@nestjs/common';
import { count, desc, eq, gte, sql } from 'drizzle-orm';

import { AnalyticsQueryService } from '../../analytics/analytics-query.service';
import { DRIZZLE, DrizzleDB } from '../../database/database.module';
import {
  aiConversations,
  aiMessages,
  devices,
  subscriptions,
  syncChangelog,
  users,
} from '../../database/schema';

@Injectable()
export class AdminAnalyticsService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly platformAnalytics: AnalyticsQueryService,
  ) {}

  async overview() {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      [totalUsers],
      [newUsers30d],
      [premiumActive],
      [devicesTotal],
      [aiConversations30d],
      [syncEvents30d],
    ] = await Promise.all([
      this.db.select({ c: count() }).from(users),
      this.db
        .select({ c: count() })
        .from(users)
        .where(gte(users.createdAt, monthAgo)),
      this.db
        .select({ c: count() })
        .from(subscriptions)
        .where(eq(subscriptions.status, 'active')),
      this.db.select({ c: count() }).from(devices),
      this.db
        .select({ c: count() })
        .from(aiConversations)
        .where(gte(aiConversations.createdAt, monthAgo)),
      this.db
        .select({ c: count() })
        .from(syncChangelog)
        .where(gte(syncChangelog.createdAt, monthAgo)),
    ]);

    const [recentSignups] = await this.db
      .select({ c: count() })
      .from(users)
      .where(gte(users.createdAt, dayAgo));

    return {
      generatedAt: now.toISOString(),
      kpis: {
        totalUsers: totalUsers?.c ?? 0,
        newUsers30d: newUsers30d?.c ?? 0,
        signups24h: recentSignups?.c ?? 0,
        premiumSubscriptions: premiumActive?.c ?? 0,
        registeredDevices: devicesTotal?.c ?? 0,
        aiConversations30d: aiConversations30d?.c ?? 0,
        syncEvents30d: syncEvents30d?.c ?? 0,
      },
    };
  }

  async featureUsage() {
    const rows = await this.db
      .select({
        intent: aiMessages.intent,
        count: count(),
      })
      .from(aiMessages)
      .where(eq(aiMessages.role, 'assistant'))
      .groupBy(aiMessages.intent)
      .orderBy(desc(count()));

    return {
      features: rows.map((r) => ({
        name: r.intent ?? 'unknown',
        count: r.count,
      })),
    };
  }

  async signupTrend(days = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const rows = await this.db
      .select({
        day: sql<string>`date_trunc('day', ${users.createdAt})::date`.as('day'),
        count: count(),
      })
      .from(users)
      .where(gte(users.createdAt, since))
      .groupBy(sql`date_trunc('day', ${users.createdAt})`)
      .orderBy(sql`date_trunc('day', ${users.createdAt})`);

    return {
      days,
      series: rows.map((r) => ({ date: String(r.day), count: r.count })),
    };
  }

  retention(days = 30) {
    return this.platformAnalytics.retention(days);
  }

  engagement(days = 30) {
    return this.platformAnalytics.engagement(days);
  }

  prayerCompletion(days = 30) {
    return this.platformAnalytics.prayerCompletion(days);
  }

  readingHabits(days = 30) {
    return this.platformAnalytics.readingHabits(days);
  }
}
