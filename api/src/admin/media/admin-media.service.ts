import { Inject, Injectable } from '@nestjs/common';
import { desc, isNull } from 'drizzle-orm';

import { DRIZZLE, DrizzleDB } from '../../database/database.module';
import { mediaAssets } from '../../database/schema';

@Injectable()
export class AdminMediaService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async list(limit = 50, offset = 0) {
    const rows = await this.db
      .select()
      .from(mediaAssets)
      .where(isNull(mediaAssets.deletedAt))
      .orderBy(desc(mediaAssets.createdAt))
      .limit(limit)
      .offset(offset);

    return { items: rows, total: rows.length, uploadUrl: null, status: 'stub_upload' };
  }
}
