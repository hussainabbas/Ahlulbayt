import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';

import { DRIZZLE, DrizzleDB } from '../../database/database.module';
import { islamicEvents } from '../../database/schema';

@Injectable()
export class AdminEventsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async list(limit = 50, offset = 0) {
    const rows = await this.db
      .select()
      .from(islamicEvents)
      .orderBy(desc(islamicEvents.priority), desc(islamicEvents.createdAt))
      .limit(limit)
      .offset(offset);

    return { items: rows, total: rows.length, status: rows.length ? 'live' : 'empty' };
  }

  async getById(id: string) {
    const [row] = await this.db.select().from(islamicEvents).where(eq(islamicEvents.id, id));
    if (!row) throw new NotFoundException('Event not found');
    return row;
  }
}
