import { Inject, Injectable } from '@nestjs/common';

import { DRIZZLE, DrizzleDB } from '../database/database.module';
import {
  analyticsEventLog,
  prayerCompletions,
  readingSessions,
} from '../database/schema';
import { ANALYTICS_EVENTS } from './constants/events';
import {
  AnalyticsEventDto,
  IngestEventsDto,
  RecordPrayerCompletionDto,
  RecordReadingSessionDto,
} from './dto/analytics.dto';

@Injectable()
export class AnalyticsIngestService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async ingest(userId: string | null, dto: IngestEventsDto) {
    if (dto.events.length === 0) return { accepted: 0 };

    const rows = dto.events.map((e) => ({
      userId,
      eventName: e.name,
      properties: e.properties ?? {},
      platform: dto.platform,
      appVersion: dto.appVersion,
      sessionId: e.sessionId,
    }));

    await this.db.insert(analyticsEventLog).values(rows);

    for (const event of dto.events) {
      await this.processDomainEvent(userId, event);
    }

    return { accepted: dto.events.length };
  }

  async recordPrayer(userId: string, dto: RecordPrayerCompletionDto) {
    const completedDate = dto.completedDate ?? new Date().toISOString().slice(0, 10);

    await this.upsertPrayerCompletion(userId, dto.prayer, completedDate, dto.source ?? 'manual');

    await this.db.insert(analyticsEventLog).values({
      userId,
      eventName: ANALYTICS_EVENTS.PRAYER_COMPLETED,
      properties: { prayer: dto.prayer, date: completedDate },
    });

    return { recorded: true, prayer: dto.prayer, date: completedDate };
  }

  async recordReading(userId: string, dto: RecordReadingSessionDto) {
    const id = await this.insertReadingSession(userId, dto);

    await this.db.insert(analyticsEventLog).values({
      userId,
      eventName:
        dto.contentType === 'quran'
          ? ANALYTICS_EVENTS.QURAN_SESSION
          : ANALYTICS_EVENTS.FEATURE_USED,
      properties: {
        contentType: dto.contentType,
        surah: dto.surah,
        ayahsRead: dto.ayahsRead,
        durationSeconds: dto.durationSeconds,
      },
    });

    return { id };
  }

  private async upsertPrayerCompletion(
    userId: string,
    prayer: string,
    completedDate: string,
    source: string,
  ) {
    await this.db
      .insert(prayerCompletions)
      .values({ userId, prayer, completedDate, source })
      .onConflictDoNothing({
        target: [prayerCompletions.userId, prayerCompletions.prayer, prayerCompletions.completedDate],
      });
  }

  private async insertReadingSession(userId: string, dto: RecordReadingSessionDto) {
    const [row] = await this.db
      .insert(readingSessions)
      .values({
        userId,
        contentType: dto.contentType,
        surah: dto.surah,
        ayahFrom: dto.ayahFrom,
        ayahTo: dto.ayahTo,
        durationSeconds: dto.durationSeconds ?? 0,
        ayahsRead: dto.ayahsRead ?? 0,
        progressPct: dto.progressPct,
      })
      .returning({ id: readingSessions.id });

    return row!.id;
  }

  private async processDomainEvent(userId: string | null, event: AnalyticsEventDto) {
    if (!userId) return;

    if (event.name === ANALYTICS_EVENTS.PRAYER_COMPLETED && event.properties?.prayer) {
      await this.upsertPrayerCompletion(
        userId,
        String(event.properties.prayer),
        event.properties.date ? String(event.properties.date) : new Date().toISOString().slice(0, 10),
        event.properties.source ? String(event.properties.source) : 'manual',
      );
    }

    if (
      event.name === ANALYTICS_EVENTS.QURAN_AYAH_READ ||
      event.name === ANALYTICS_EVENTS.QURAN_SESSION
    ) {
      const props = event.properties ?? {};
      if (props.surah) {
        await this.insertReadingSession(userId, {
          contentType: 'quran',
          surah: Number(props.surah),
          ayahFrom: props.ayah ? Number(props.ayah) : undefined,
          ayahTo: props.ayah ? Number(props.ayah) : undefined,
          durationSeconds: props.durationMs ? Math.round(Number(props.durationMs) / 1000) : 0,
          ayahsRead: props.ayahsRead ? Number(props.ayahsRead) : 1,
        });
      }
    }
  }
}
