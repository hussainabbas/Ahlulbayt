import { Inject, Injectable } from '@nestjs/common';
import { desc } from 'drizzle-orm';

import { DRIZZLE, DrizzleDB } from '../../database/database.module';
import { securityEvents } from '../../database/schema';

@Injectable()
export class AdminSecurityService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async listEvents(limit = 50, offset = 0) {
    const rows = await this.db
      .select()
      .from(securityEvents)
      .orderBy(desc(securityEvents.createdAt))
      .limit(limit)
      .offset(offset);

    return { items: rows, total: rows.length };
  }

  overview() {
    return {
      openIncidents: 0,
      blockedIps: 0,
      failedLogins24h: 0,
      status: 'stub',
    };
  }
}
