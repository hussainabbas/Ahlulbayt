import { Inject, Injectable } from '@nestjs/common';
import { desc } from 'drizzle-orm';

import { DRIZZLE, DrizzleDB } from '../../database/database.module';
import { apiRequestLogs } from '../../database/schema';

@Injectable()
export class AdminLogsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async listRequests(limit = 50, offset = 0) {
    const rows = await this.db
      .select()
      .from(apiRequestLogs)
      .orderBy(desc(apiRequestLogs.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      items: rows.map((r) => ({
        id: r.id,
        requestId: r.requestId,
        method: r.method,
        path: r.path,
        statusCode: r.statusCode,
        durationMs: r.durationMs,
        userId: r.userId,
        ipAddress: r.ipAddress,
        errorCode: r.errorCode,
        createdAt: r.createdAt.toISOString(),
      })),
      total: rows.length,
    };
  }
}
