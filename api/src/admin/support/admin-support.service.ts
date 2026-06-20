import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';

import { SupportService } from '../../support/support.service';
import { DRIZZLE, DrizzleDB } from '../../database/database.module';
import { supportCampaigns, supportConfig, supportWallets } from '../../database/schema';
import { AdminAuditService } from '../audit/admin-audit.service';
import type {
  CreateSupportCampaignDto,
  CreateSupportWalletDto,
  UpdateSupportCampaignDto,
  UpdateSupportConfigDto,
  UpdateSupportWalletDto,
} from '../../support/dto/support.dto';

@Injectable()
export class AdminSupportService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly audit: AdminAuditService,
    private readonly support: SupportService,
  ) {}

  async getAdminConfig() {
    const [cfgRows, wallets, campaigns] = await Promise.all([
      this.db.select().from(supportConfig).limit(1),
      this.db.select().from(supportWallets).orderBy(asc(supportWallets.sortOrder)),
      this.db.select().from(supportCampaigns).orderBy(asc(supportCampaigns.sortOrder)),
    ]);

    return {
      config: cfgRows[0] ?? null,
      wallets: { items: wallets, total: wallets.length },
      campaigns: { items: campaigns, total: campaigns.length },
    };
  }

  async updateConfig(actorId: string, dto: UpdateSupportConfigDto, ip?: string) {
    const [existing] = await this.db.select().from(supportConfig).limit(1);
    const now = new Date();

    if (!existing) {
      const [row] = await this.db
        .insert(supportConfig)
        .values({
          homeCardEnabled: dto.homeCardEnabled ?? true,
          transparency: dto.transparency ?? {},
          bankDetails: dto.bankDetails ?? {},
          preferredNetwork: dto.preferredNetwork ?? null,
          reminderCooldownDays: dto.reminderCooldownDays ?? 30,
          updatedAt: now,
        })
        .returning();
      await this.support.invalidateCache();
      await this.audit.log({
        actorId,
        action: 'support.config.update',
        targetType: 'support_config',
        targetId: row!.id,
        payload: dto as Record<string, unknown>,
        ipAddress: ip,
      });
      return row;
    }

    const mergedBankDetails =
      dto.bankDetails !== undefined
        ? {
            ...((existing.bankDetails as Record<string, unknown> | null) ?? {}),
            ...dto.bankDetails,
          }
        : undefined;

    const [row] = await this.db
      .update(supportConfig)
      .set({
        ...(dto.homeCardEnabled !== undefined ? { homeCardEnabled: dto.homeCardEnabled } : {}),
        ...(dto.transparency !== undefined ? { transparency: dto.transparency } : {}),
        ...(mergedBankDetails !== undefined ? { bankDetails: mergedBankDetails } : {}),
        ...(dto.preferredNetwork !== undefined ? { preferredNetwork: dto.preferredNetwork } : {}),
        ...(dto.reminderCooldownDays !== undefined
          ? { reminderCooldownDays: dto.reminderCooldownDays }
          : {}),
        updatedAt: now,
      })
      .where(eq(supportConfig.id, existing.id))
      .returning();

    await this.support.invalidateCache();
    await this.audit.log({
      actorId,
      action: 'support.config.update',
      targetType: 'support_config',
      targetId: row!.id,
      payload: dto as Record<string, unknown>,
      ipAddress: ip,
    });
    return row;
  }

  async listWallets() {
    const rows = await this.db.select().from(supportWallets).orderBy(asc(supportWallets.sortOrder));
    return { items: rows, total: rows.length };
  }

  async createWallet(actorId: string, dto: CreateSupportWalletDto, ip?: string) {
    const [row] = await this.db
      .insert(supportWallets)
      .values({
        network: dto.network,
        label: dto.label,
        address: dto.address,
        enabled: dto.enabled ?? true,
        sortOrder: dto.sortOrder ?? 0,
        instructions: dto.instructions ?? {},
      })
      .returning();

    await this.support.invalidateCache();
    await this.audit.log({
      actorId,
      action: 'support.wallet.create',
      targetType: 'support_wallet',
      targetId: row!.id,
      payload: dto as Record<string, unknown>,
      ipAddress: ip,
    });
    return row;
  }

  async updateWallet(actorId: string, id: string, dto: UpdateSupportWalletDto, ip?: string) {
    const [row] = await this.db
      .update(supportWallets)
      .set({
        ...(dto.network !== undefined ? { network: dto.network } : {}),
        ...(dto.label !== undefined ? { label: dto.label } : {}),
        ...(dto.address !== undefined ? { address: dto.address } : {}),
        ...(dto.enabled !== undefined ? { enabled: dto.enabled } : {}),
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
        ...(dto.instructions !== undefined ? { instructions: dto.instructions } : {}),
        updatedAt: new Date(),
      })
      .where(eq(supportWallets.id, id))
      .returning();

    if (!row) throw new NotFoundException('Support wallet not found');

    await this.support.invalidateCache();
    await this.audit.log({
      actorId,
      action: 'support.wallet.update',
      targetType: 'support_wallet',
      targetId: id,
      payload: dto as Record<string, unknown>,
      ipAddress: ip,
    });
    return row;
  }

  async deleteWallet(actorId: string, id: string, ip?: string) {
    const [row] = await this.db.delete(supportWallets).where(eq(supportWallets.id, id)).returning();
    if (!row) throw new NotFoundException('Support wallet not found');

    await this.support.invalidateCache();
    await this.audit.log({
      actorId,
      action: 'support.wallet.delete',
      targetType: 'support_wallet',
      targetId: id,
      payload: {},
      ipAddress: ip,
    });
    return { deleted: true };
  }

  async listCampaigns() {
    const rows = await this.db
      .select()
      .from(supportCampaigns)
      .orderBy(asc(supportCampaigns.sortOrder));
    return { items: rows, total: rows.length };
  }

  async createCampaign(actorId: string, dto: CreateSupportCampaignDto, ip?: string) {
    const [row] = await this.db
      .insert(supportCampaigns)
      .values({
        slug: dto.slug,
        title: dto.title,
        body: dto.body,
        active: dto.active ?? false,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
        sortOrder: dto.sortOrder ?? 0,
      })
      .returning();

    await this.support.invalidateCache();
    await this.audit.log({
      actorId,
      action: 'support.campaign.create',
      targetType: 'support_campaign',
      targetId: row!.id,
      payload: dto as Record<string, unknown>,
      ipAddress: ip,
    });
    return row;
  }

  async updateCampaign(actorId: string, id: string, dto: UpdateSupportCampaignDto, ip?: string) {
    const [row] = await this.db
      .update(supportCampaigns)
      .set({
        ...(dto.slug !== undefined ? { slug: dto.slug } : {}),
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.body !== undefined ? { body: dto.body } : {}),
        ...(dto.active !== undefined ? { active: dto.active } : {}),
        ...(dto.startsAt !== undefined
          ? { startsAt: dto.startsAt ? new Date(dto.startsAt) : null }
          : {}),
        ...(dto.endsAt !== undefined ? { endsAt: dto.endsAt ? new Date(dto.endsAt) : null } : {}),
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
        updatedAt: new Date(),
      })
      .where(eq(supportCampaigns.id, id))
      .returning();

    if (!row) throw new NotFoundException('Support campaign not found');

    await this.support.invalidateCache();
    await this.audit.log({
      actorId,
      action: 'support.campaign.update',
      targetType: 'support_campaign',
      targetId: id,
      payload: dto as Record<string, unknown>,
      ipAddress: ip,
    });
    return row;
  }

  async deleteCampaign(actorId: string, id: string, ip?: string) {
    const [row] = await this.db
      .delete(supportCampaigns)
      .where(eq(supportCampaigns.id, id))
      .returning();
    if (!row) throw new NotFoundException('Support campaign not found');

    await this.support.invalidateCache();
    await this.audit.log({
      actorId,
      action: 'support.campaign.delete',
      targetType: 'support_campaign',
      targetId: id,
      payload: {},
      ipAddress: ip,
    });
    return { deleted: true };
  }
}
