import { Inject, Injectable } from '@nestjs/common';

import { desc } from 'drizzle-orm';

import { DRIZZLE, DrizzleDB } from '../../database/database.module';
import { adminAuditLog } from '../../database/schema';

@Injectable()
export class AdminAuditService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async log(params: {
    actorId: string;
    action: string;
    targetType?: string;
    targetId?: string;
    payload?: Record<string, unknown> | object;
    ipAddress?: string;
  }) {
    await this.db.insert(adminAuditLog).values({
      actorId: params.actorId,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      payload: (params.payload ?? {}) as Record<string, unknown>,
      ipAddress: params.ipAddress,
    });
  }

  async list(limit = 50, offset = 0) {
    const rows = await this.db
      .select()
      .from(adminAuditLog)
      .orderBy(desc(adminAuditLog.createdAt))
      .limit(limit)
      .offset(offset);

    return rows.map((r) => ({
      id: r.id,
      actorId: r.actorId,
      action: r.action,
      targetType: r.targetType,
      targetId: r.targetId,
      payload: r.payload,
      ipAddress: r.ipAddress,
      createdAt: r.createdAt.toISOString(),
    }));
  }
}
