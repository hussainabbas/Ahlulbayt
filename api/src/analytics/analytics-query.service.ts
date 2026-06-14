import { Inject, Injectable } from '@nestjs/common';
import { and, count, desc, eq, gte, sql } from 'drizzle-orm';

import { DRIZZLE, DrizzleDB } from '../database/database.module';
import {
  analyticsEventLog,
  prayerCompletions,
  readingSessions,
  users,
} from '../database/schema';
import { ANALYTICS_EVENTS, PRAYER_KEYS } from './constants/events';

@Injectable()
export class AnalyticsQueryService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  /** D1/D7/D30 retention cohorts from session_start events */
  async retention(days = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const cohorts = await this.db.execute<{ cohort: string; d1: number; d7: number; d30: number; size: number }>(sql`
      WITH signups AS (
        SELECT id, date_trunc('week', created_at)::date AS cohort_week
        FROM users
        WHERE created_at >= ${since} AND deleted_at IS NULL
      ),
      sessions AS (
        SELECT user_id, date_trunc('day', created_at)::date AS session_day
        FROM analytics_event_log
        WHERE event_name = ${ANALYTICS_EVENTS.SESSION_START}
          AND user_id IS NOT NULL
          AND created_at >= ${since}
        GROUP BY user_id, date_trunc('day', created_at)
      ),
      cohort_activity AS (
        SELECT
          s.cohort_week,
          s.id AS user_id,
          u.created_at::date AS signup_day,
          sess.session_day
        FROM signups s
        JOIN users u ON u.id = s.id
        LEFT JOIN sessions sess ON sess.user_id = s.id
      )
      SELECT
        cohort_week::text AS cohort,
        COUNT(DISTINCT user_id)::int AS size,
        COUNT(DISTINCT user_id) FILTER (
          WHERE session_day = signup_day + 1
        )::int AS d1,
        COUNT(DISTINCT user_id) FILTER (
          WHERE session_day BETWEEN signup_day + 1 AND signup_day + 7
        )::int AS d7,
        COUNT(DISTINCT user_id) FILTER (
          WHERE session_day BETWEEN signup_day + 1 AND signup_day + 30
        )::int AS d30
      FROM cohort_activity
      GROUP BY cohort_week
      ORDER BY cohort_week DESC
      LIMIT 12
    `);

    const rows = cohorts.rows ?? cohorts;

    return {
      days,
      cohorts: (rows as Array<{ cohort: string; d1: number; d7: number; d30: number; size: number }>).map(
        (r) => ({
          cohortWeek: r.cohort,
          cohortSize: r.size,
          d1Rate: r.size > 0 ? Math.round((r.d1 / r.size) * 1000) / 10 : 0,
          d7Rate: r.size > 0 ? Math.round((r.d7 / r.size) * 1000) / 10 : 0,
          d30Rate: r.size > 0 ? Math.round((r.d30 / r.size) * 1000) / 10 : 0,
        }),
      ),
    };
  }

  /** DAU, WAU, MAU and top events */
  async engagement(days = 30) {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const activeUsers = async (since: Date) => {
      const [row] = await this.db
        .select({ c: sql<number>`count(distinct ${analyticsEventLog.userId})` })
        .from(analyticsEventLog)
        .where(
          and(
            gte(analyticsEventLog.createdAt, since),
            sql`${analyticsEventLog.userId} IS NOT NULL`,
          ),
        );
      return Number(row?.c ?? 0);
    };

    const [dau, wau, mau] = await Promise.all([
      activeUsers(dayAgo),
      activeUsers(weekAgo),
      activeUsers(monthAgo),
    ]);

    const topEvents = await this.db
      .select({
        name: analyticsEventLog.eventName,
        count: count(),
      })
      .from(analyticsEventLog)
      .where(gte(analyticsEventLog.createdAt, monthAgo))
      .groupBy(analyticsEventLog.eventName)
      .orderBy(desc(count()))
      .limit(15);

    const dailyActive = await this.db
      .select({
        date: sql<string>`date_trunc('day', ${analyticsEventLog.createdAt})::date`.as('date'),
        activeUsers: sql<number>`count(distinct ${analyticsEventLog.userId})`,
      })
      .from(analyticsEventLog)
      .where(
        and(
          gte(analyticsEventLog.createdAt, monthAgo),
          sql`${analyticsEventLog.userId} IS NOT NULL`,
        ),
      )
      .groupBy(sql`date_trunc('day', ${analyticsEventLog.createdAt})`)
      .orderBy(sql`date_trunc('day', ${analyticsEventLog.createdAt})`);

    return {
      dau,
      wau,
      mau,
      stickiness: mau > 0 ? Math.round((dau / mau) * 1000) / 10 : 0,
      topEvents: topEvents.map((e) => ({ name: e.name, count: e.count })),
      dailyActive: dailyActive.map((d) => ({
        date: String(d.date),
        activeUsers: Number(d.activeUsers),
      })),
    };
  }

  /** Prayer completion rates across user base */
  async prayerCompletion(days = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const sinceDate = since.toISOString().slice(0, 10);

    const byPrayer = await this.db
      .select({
        prayer: prayerCompletions.prayer,
        count: count(),
        users: sql<number>`count(distinct ${prayerCompletions.userId})`,
      })
      .from(prayerCompletions)
      .where(gte(prayerCompletions.completedDate, sinceDate))
      .groupBy(prayerCompletions.prayer);

    const daily = await this.db
      .select({
        date: prayerCompletions.completedDate,
        count: count(),
        users: sql<number>`count(distinct ${prayerCompletions.userId})`,
      })
      .from(prayerCompletions)
      .where(gte(prayerCompletions.completedDate, sinceDate))
      .groupBy(prayerCompletions.completedDate)
      .orderBy(prayerCompletions.completedDate);

    const [activePrayerUsers] = await this.db
      .select({ c: sql<number>`count(distinct ${prayerCompletions.userId})` })
      .from(prayerCompletions)
      .where(gte(prayerCompletions.completedDate, sinceDate));

    const [totalUsers] = await this.db
      .select({ c: count() })
      .from(users)
      .where(sql`${users.deletedAt} IS NULL`);

    const total = Number(totalUsers?.c ?? 0);
    const active = Number(activePrayerUsers?.c ?? 0);

    return {
      days,
      adoptionRate: total > 0 ? Math.round((active / total) * 1000) / 10 : 0,
      activeUsers: active,
      byPrayer: PRAYER_KEYS.map((p) => {
        const row = byPrayer.find((b) => b.prayer === p);
        return { prayer: p, completions: row?.count ?? 0, uniqueUsers: Number(row?.users ?? 0) };
      }),
      daily: daily.map((d) => ({
        date: String(d.date),
        completions: d.count,
        uniqueUsers: Number(d.users),
      })),
    };
  }

  /** Reading habit metrics */
  async readingHabits(days = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const byContent = await this.db
      .select({
        contentType: readingSessions.contentType,
        sessions: count(),
        users: sql<number>`count(distinct ${readingSessions.userId})`,
        totalAyahs: sql<number>`coalesce(sum(${readingSessions.ayahsRead}), 0)`,
        totalMinutes: sql<number>`coalesce(sum(${readingSessions.durationSeconds}), 0) / 60.0`,
      })
      .from(readingSessions)
      .where(gte(readingSessions.createdAt, since))
      .groupBy(readingSessions.contentType);

    const topSurahs = await this.db
      .select({
        surah: readingSessions.surah,
        sessions: count(),
        ayahsRead: sql<number>`coalesce(sum(${readingSessions.ayahsRead}), 0)`,
      })
      .from(readingSessions)
      .where(and(gte(readingSessions.createdAt, since), eq(readingSessions.contentType, 'quran')))
      .groupBy(readingSessions.surah)
      .orderBy(desc(sql`coalesce(sum(${readingSessions.ayahsRead}), 0)`))
      .limit(10);

    const daily = await this.db
      .select({
        date: sql<string>`date_trunc('day', ${readingSessions.createdAt})::date`.as('date'),
        sessions: count(),
        ayahsRead: sql<number>`coalesce(sum(${readingSessions.ayahsRead}), 0)`,
      })
      .from(readingSessions)
      .where(gte(readingSessions.createdAt, since))
      .groupBy(sql`date_trunc('day', ${readingSessions.createdAt})`)
      .orderBy(sql`date_trunc('day', ${readingSessions.createdAt})`);

    return {
      days,
      byContent: byContent.map((c) => ({
        contentType: c.contentType,
        sessions: c.sessions,
        uniqueUsers: Number(c.users),
        totalAyahs: Number(c.totalAyahs),
        totalMinutes: Math.round(Number(c.totalMinutes)),
      })),
      topSurahs: topSurahs
        .filter((s) => s.surah != null)
        .map((s) => ({
          surah: s.surah!,
          sessions: s.sessions,
          ayahsRead: Number(s.ayahsRead),
        })),
      daily: daily.map((d) => ({
        date: String(d.date),
        sessions: d.sessions,
        ayahsRead: Number(d.ayahsRead),
      })),
    };
  }

  /** Personal insights for authenticated user */
  async userInsights(userId: string, days = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const sinceDate = since.toISOString().slice(0, 10);

    const prayerRows = await this.db
      .select({
        prayer: prayerCompletions.prayer,
        count: count(),
      })
      .from(prayerCompletions)
      .where(
        and(eq(prayerCompletions.userId, userId), gte(prayerCompletions.completedDate, sinceDate)),
      )
      .groupBy(prayerCompletions.prayer);

    const [readingStats] = await this.db
      .select({
        sessions: count(),
        ayahsRead: sql<number>`coalesce(sum(${readingSessions.ayahsRead}), 0)`,
        minutes: sql<number>`coalesce(sum(${readingSessions.durationSeconds}), 0) / 60.0`,
      })
      .from(readingSessions)
      .where(and(eq(readingSessions.userId, userId), gte(readingSessions.createdAt, since)));

    const [sessionCount] = await this.db
      .select({ c: count() })
      .from(analyticsEventLog)
      .where(
        and(
          eq(analyticsEventLog.userId, userId),
          eq(analyticsEventLog.eventName, ANALYTICS_EVENTS.SESSION_START),
          gte(analyticsEventLog.createdAt, since),
        ),
      );

    const prayerTotal = prayerRows.reduce((sum, r) => sum + r.count, 0);
    const possiblePrayers = days * 5;

    return {
      days,
      retention: {
        sessions: sessionCount?.c ?? 0,
        activeDaysEstimate: Math.min(sessionCount?.c ?? 0, days),
      },
      engagement: {
        sessionCount: sessionCount?.c ?? 0,
      },
      prayer: {
        totalCompleted: prayerTotal,
        completionRate: Math.round((prayerTotal / possiblePrayers) * 1000) / 10,
        byPrayer: PRAYER_KEYS.map((p) => ({
          prayer: p,
          count: prayerRows.find((r) => r.prayer === p)?.count ?? 0,
        })),
      },
      reading: {
        sessions: readingStats?.sessions ?? 0,
        ayahsRead: Number(readingStats?.ayahsRead ?? 0),
        minutes: Math.round(Number(readingStats?.minutes ?? 0)),
      },
    };
  }
}
