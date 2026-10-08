import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';

import { DRIZZLE, DrizzleDB } from '../../database/database.module';
import { featureFlags } from '../../database/schema';

@Injectable()
export class AdminFlagsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async list() {
    const rows = await this.db
      .select()
      .from(featureFlags)
      .orderBy(desc(featureFlags.updatedAt));

    return { items: rows, total: rows.length };
  }

  async getByKey(key: string) {
    const [row] = await this.db.select().from(featureFlags).where(eq(featureFlags.key, key));
    if (!row) throw new NotFoundException('Feature flag not found');
    return row;
  }
}
