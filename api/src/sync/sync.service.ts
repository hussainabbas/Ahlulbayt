import { Inject, Injectable } from '@nestjs/common';
import { and, eq, gt } from 'drizzle-orm';

import { DRIZZLE, DrizzleDB } from '../database/database.module';
import { syncChangelog, userPreferences } from '../database/schema';
import type { SyncPullResponse } from '../common/types/content.types';
import { SyncChangeDto } from './dto/sync.dto';

@Injectable()
export class SyncService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async push(userId: string, changes: SyncChangeDto[]): Promise<{ accepted: number; cursor: number }> {
    if (changes.length === 0) {
      const cursor = await this.getLatestCursor(userId);
      return { accepted: 0, cursor };
    }

    const rows = await this.db
      .insert(syncChangelog)
      .values(
        changes.map((c) => ({
          userId,
          entityType: c.entityType,
          entityId: c.entityId,
          operation: c.operation,
          payload: c.payload,
        })),
      )
      .returning({ id: syncChangelog.id });

    const cursor = rows[rows.length - 1]?.id ?? (await this.getLatestCursor(userId));

    await this.db
      .insert(userPreferences)
      .values({ userId, syncToken: String(cursor) })
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: { syncToken: String(cursor), updatedAt: new Date() },
      });

    return { accepted: changes.length, cursor };
  }

  async pull(userId: string, cursor = 0, limit = 50): Promise<SyncPullResponse> {
    const rows = await this.db
      .select()
      .from(syncChangelog)
      .where(and(eq(syncChangelog.userId, userId), gt(syncChangelog.id, cursor)))
      .orderBy(syncChangelog.id)
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;

    return {
      cursor: page.length > 0 ? page[page.length - 1]!.id : cursor,
      changes: page.map((r) => ({
        id: r.id,
        entityType: r.entityType,
        entityId: r.entityId,
        operation: r.operation,
        payload: r.payload as Record<string, unknown>,
        createdAt: r.createdAt.toISOString(),
      })),
      hasMore,
    };
  }

  private async getLatestCursor(userId: string): Promise<number> {
    const [pref] = await this.db
      .select({ syncToken: userPreferences.syncToken })
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);
    return pref?.syncToken ? parseInt(pref.syncToken, 10) : 0;
  }
}
