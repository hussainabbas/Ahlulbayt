import { Inject, Injectable, Logger } from '@nestjs/common';
import { and, eq, gte, sql } from 'drizzle-orm';

import { DRIZZLE, DrizzleDB } from '../database/database.module';
import { analyticsDailyRollups, analyticsEventLog, prayerCompletions, readingSessions } from '../database/schema';
import { ANALYTICS_EVENTS } from './constants/events';

@Injectable()
export class AnalyticsRollupService {
  private readonly logger = new Logger(AnalyticsRollupService.name);

  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async runDailyRollups() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().slice(0, 10);
    const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
    const dayEnd = new Date(`${dateStr}T23:59:59.999Z`);

    try {
      const [dau] = await this.db
        .select({ c: sql<number>`count(distinct ${analyticsEventLog.userId})` })
        .from(analyticsEventLog)
        .where(
          and(
            gte(analyticsEventLog.createdAt, dayStart),
            sql`${analyticsEventLog.createdAt} <= ${dayEnd}`,
            sql`${analyticsEventLog.userId} IS NOT NULL`,
          ),
        );

      const [prayerCount] = await this.db
        .select({ c: sql<number>`count(*)` })
        .from(prayerCompletions)
        .where(eq(prayerCompletions.completedDate, dateStr));

      const [readingAyahs] = await this.db
        .select({ c: sql<number>`coalesce(sum(${readingSessions.ayahsRead}), 0)` })
        .from(readingSessions)
        .where(
          and(
            gte(readingSessions.createdAt, dayStart),
            sql`${readingSessions.createdAt} <= ${dayEnd}`,
          ),
        );

      const [sessions] = await this.db
        .select({ c: sql<number>`count(*)` })
        .from(analyticsEventLog)
        .where(
          and(
            eq(analyticsEventLog.eventName, ANALYTICS_EVENTS.SESSION_START),
            gte(analyticsEventLog.createdAt, dayStart),
            sql`${analyticsEventLog.createdAt} <= ${dayEnd}`,
          ),
        );

      const metrics = [
        { metric: 'dau', value: Number(dau?.c ?? 0) },
        { metric: 'prayer_completions', value: Number(prayerCount?.c ?? 0) },
        { metric: 'ayahs_read', value: Number(readingAyahs?.c ?? 0) },
        { metric: 'sessions', value: Number(sessions?.c ?? 0) },
      ];

      for (const m of metrics) {
        await this.db
          .insert(analyticsDailyRollups)
          .values({
            rollupDate: dateStr,
            metric: m.metric,
            dimension: '',
            value: m.value,
          })
          .onConflictDoUpdate({
            target: [analyticsDailyRollups.rollupDate, analyticsDailyRollups.metric, analyticsDailyRollups.dimension],
            set: { value: m.value },
          });
      }

      this.logger.log(`Daily rollups completed for ${dateStr}`);
    } catch (err) {
      this.logger.error(`Daily rollup failed: ${err}`);
    }
  }
}
