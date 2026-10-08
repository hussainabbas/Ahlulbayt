import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, count, desc, eq, ilike, isNull, or, sql } from 'drizzle-orm';

import { DRIZZLE, DrizzleDB } from '../../database/database.module';
import { subscriptions, users } from '../../database/schema';
import { AdminAuditService } from '../audit/admin-audit.service';
import { AdminUpdateUserDto, AdminUsersQueryDto } from './dto/admin-users.dto';

@Injectable()
export class AdminUsersService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly audit: AdminAuditService,
  ) {}

  async list(query: AdminUsersQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 25;
    const offset = (page - 1) * limit;

    const conditions = [isNull(users.deletedAt)];
    if (query.tier) conditions.push(eq(users.tier, query.tier));
    if (query.role) conditions.push(eq(users.role, query.role));
    if (query.q) {
      conditions.push(
        or(
          ilike(users.email, `%${query.q}%`),
          ilike(users.displayName, `%${query.q}%`),
        )!,
      );
    }

    const where = and(...conditions);

    const [rows, [totalRow]] = await Promise.all([
      this.db
        .select({
          id: users.id,
          email: users.email,
          displayName: users.displayName,
          tier: users.tier,
          role: users.role,
          locale: users.locale,
          isAnonymous: users.isAnonymous,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(where)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset),
      this.db.select({ count: count() }).from(users).where(where),
    ]);

    return {
      page,
      limit,
      total: totalRow?.count ?? 0,
      items: rows.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
      })),
    };
  }

  async getById(id: string) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!user) throw new NotFoundException('User not found');

    const subs = await this.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, id))
      .orderBy(desc(subscriptions.createdAt))
      .limit(5);

    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      tier: user.tier,
      role: user.role,
      locale: user.locale,
      marja: user.marja,
      isAnonymous: user.isAnonymous,
      deletedAt: user.deletedAt?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
      subscriptions: subs.map((s) => ({
        id: s.id,
        productId: s.productId,
        planType: s.planType,
        status: s.status,
        expiresAt: s.expiresAt?.toISOString() ?? null,
      })),
    };
  }

  async update(actorId: string, id: string, dto: AdminUpdateUserDto, ip?: string) {
    const [existing] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!existing) throw new NotFoundException('User not found');

    const patch: Partial<typeof users.$inferInsert> = { updatedAt: new Date() };
    if (dto.tier !== undefined) patch.tier = dto.tier;
    if (dto.role !== undefined) patch.role = dto.role;
    if (dto.displayName !== undefined) patch.displayName = dto.displayName;

    await this.db.update(users).set(patch).where(eq(users.id, id));

    await this.audit.log({
      actorId,
      action: 'user.update',
      targetType: 'user',
      targetId: id,
      payload: dto as Record<string, unknown>,
      ipAddress: ip,
    });

    return this.getById(id);
  }

  async softDelete(actorId: string, id: string, ip?: string) {
    const [existing] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!existing) throw new NotFoundException('User not found');

    await this.db
      .update(users)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, id));

    await this.audit.log({
      actorId,
      action: 'user.soft_delete',
      targetType: 'user',
      targetId: id,
      ipAddress: ip,
    });

    return { deleted: true };
  }

  async stats() {
    const [[total], [premium], [guests], [admins]] = await Promise.all([
      this.db.select({ c: count() }).from(users).where(isNull(users.deletedAt)),
      this.db
        .select({ c: count() })
        .from(users)
        .where(and(isNull(users.deletedAt), eq(users.tier, 'premium'))),
      this.db
        .select({ c: count() })
        .from(users)
        .where(and(isNull(users.deletedAt), eq(users.isAnonymous, true))),
      this.db
        .select({ c: count() })
        .from(users)
        .where(
          and(
            isNull(users.deletedAt),
            sql`${users.role} IN ('admin', 'super_admin', 'moderator')`,
          ),
        ),
    ]);

    return {
      totalUsers: total?.c ?? 0,
      premiumUsers: premium?.c ?? 0,
      guestUsers: guests?.c ?? 0,
      staffUsers: admins?.c ?? 0,
    };
  }
}
