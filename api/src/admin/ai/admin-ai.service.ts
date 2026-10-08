import { Inject, Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';

import { DRIZZLE, DrizzleDB } from '../../database/database.module';
import { aiAdminConfig, aiConversations, aiMessages } from '../../database/schema';
import { AdminAuditService } from '../audit/admin-audit.service';
import { UpdateAiConfigDto, UpdateGuardrailsDto } from './dto/admin-ai.dto';

@Injectable()
export class AdminAiService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly audit: AdminAuditService,
  ) {}

  async getConfig() {
    const rows = await this.db.select().from(aiAdminConfig);
    const config: Record<string, unknown> = {};
    for (const row of rows) {
      config[row.key] = row.value;
    }
    return { config };
  }

  async updateConfig(actorId: string, key: string, dto: UpdateAiConfigDto, ip?: string) {
    await this.db
      .insert(aiAdminConfig)
      .values({ key, value: dto.value, updatedBy: actorId, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: aiAdminConfig.key,
        set: { value: dto.value, updatedBy: actorId, updatedAt: new Date() },
      });

    await this.audit.log({
      actorId,
      action: 'ai.config.update',
      targetType: 'ai_config',
      targetId: key,
      payload: dto.value,
      ipAddress: ip,
    });

    return this.getConfig();
  }

  async getGuardrails() {
    const [row] = await this.db
      .select()
      .from(aiAdminConfig)
      .where(eq(aiAdminConfig.key, 'guardrails'))
      .limit(1);

    return (row?.value as Record<string, unknown>) ?? { blockedPatterns: [] };
  }

  async updateGuardrails(actorId: string, dto: UpdateGuardrailsDto, ip?: string) {
    const value = { blockedPatterns: dto.blockedPatterns ?? [] };
    return this.updateConfig(actorId, 'guardrails', { value }, ip);
  }

  async listConversations(limit = 25) {
    const rows = await this.db
      .select()
      .from(aiConversations)
      .orderBy(desc(aiConversations.updatedAt))
      .limit(limit);

    return {
      items: rows.map((c) => ({
        id: c.id,
        userId: c.userId,
        title: c.title,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
    };
  }

  async getConversationMessages(conversationId: string) {
    const rows = await this.db
      .select()
      .from(aiMessages)
      .where(eq(aiMessages.conversationId, conversationId))
      .orderBy(aiMessages.createdAt)
      .limit(100);

    return {
      items: rows.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content.slice(0, 500),
        intent: m.intent,
        createdAt: m.createdAt.toISOString(),
      })),
    };
  }
}
