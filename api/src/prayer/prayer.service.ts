import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';

import { DRIZZLE, DrizzleDB } from '../database/database.module';
import { qadhaRecords } from '../database/schema';
import { CompleteQadhaDto, CreateQadhaDto } from './dto/prayer.dto';

@Injectable()
export class PrayerService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async listQadha(userId: string, pendingOnly = true) {
    const conditions = [eq(qadhaRecords.userId, userId), isNull(qadhaRecords.deletedAt)];
    if (pendingOnly) {
      conditions.push(isNull(qadhaRecords.completedAt));
    }

    const rows = await this.db
      .select()
      .from(qadhaRecords)
      .where(and(...conditions));

    return rows.map((r) => ({
      id: r.id,
      prayer: r.prayer,
      missedDate: r.missedDate,
      completedAt: r.completedAt?.toISOString() ?? null,
      notes: r.notes,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async createQadha(userId: string, dto: CreateQadhaDto) {
    const [row] = await this.db
      .insert(qadhaRecords)
      .values({
        userId,
        prayer: dto.prayer,
        missedDate: dto.missedDate,
        notes: dto.notes,
      })
      .returning();

    return {
      id: row!.id,
      prayer: row!.prayer,
      missedDate: row!.missedDate,
      notes: row!.notes,
      createdAt: row!.createdAt.toISOString(),
    };
  }

  async completeQadha(userId: string, id: string, dto: CompleteQadhaDto) {
    const completedAt = dto.completedAt ? new Date(dto.completedAt) : new Date();
    const [row] = await this.db
      .update(qadhaRecords)
      .set({ completedAt, updatedAt: new Date() })
      .where(and(eq(qadhaRecords.id, id), eq(qadhaRecords.userId, userId)))
      .returning();

    if (!row) throw new NotFoundException('Qadha record not found');
    return {
      id: row.id,
      completedAt: row.completedAt!.toISOString(),
    };
  }

  async deleteQadha(userId: string, id: string) {
    const [row] = await this.db
      .update(qadhaRecords)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(qadhaRecords.id, id), eq(qadhaRecords.userId, userId)))
      .returning({ id: qadhaRecords.id });

    if (!row) throw new NotFoundException('Qadha record not found');
    return { deleted: true };
  }
}
