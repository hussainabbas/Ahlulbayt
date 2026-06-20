import { Inject, Injectable } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';

import { DRIZZLE, DrizzleDB } from '../database/database.module';
import { supportCampaigns, supportConfig, supportWallets } from '../database/schema';
import { CacheService } from '../redis/cache.service';
import type { SupportConfigResponse } from './dto/support.dto';

const CACHE_KEY = 'support:config:v1';
const CACHE_TTL = 60;

const DEFAULT_OPTIONS: SupportConfigResponse['options'] = [
  { id: 'one_time', icon: '💚', titleKey: 'support.options.oneTime.title', descriptionKey: 'support.options.oneTime.description' },
  { id: 'coffee', icon: '☕', titleKey: 'support.options.coffee.title', descriptionKey: 'support.options.coffee.description' },
  { id: 'monthly', icon: '⭐', titleKey: 'support.options.monthly.title', descriptionKey: 'support.options.monthly.description' },
  { id: 'annual', icon: '📅', titleKey: 'support.options.annual.title', descriptionKey: 'support.options.annual.description' },
  { id: 'founding', icon: '🏆', titleKey: 'support.options.founding.title', descriptionKey: 'support.options.founding.description' },
];

const DEFAULT_TRANSPARENCY: Record<string, string> = {
  hosting: 'Server hosting and CDN',
  notifications: 'Push notification delivery',
  ai: 'AI assistant infrastructure',
  development: 'App development and maintenance',
};

@Injectable()
export class SupportService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly cache: CacheService,
  ) {}

  async getConfig(locale = 'en'): Promise<SupportConfigResponse> {
    const cacheKey = `${CACHE_KEY}:${locale}`;
    const cached = await this.cache.get<SupportConfigResponse>(cacheKey);
    if (cached) return cached;

    const config = await this.loadConfig(locale);
    await this.cache.set(cacheKey, config, CACHE_TTL);
    return config;
  }

  async invalidateCache(): Promise<void> {
    await this.cache.del(`${CACHE_KEY}:en`);
    await this.cache.del(`${CACHE_KEY}:ur`);
    await this.cache.del(`${CACHE_KEY}:ar`);
  }

  private async loadConfig(locale: string): Promise<SupportConfigResponse> {
    const [cfgRows, walletRows, campaignRows] = await Promise.all([
      this.db.select().from(supportConfig).limit(1),
      this.db
        .select()
        .from(supportWallets)
        .where(eq(supportWallets.enabled, true))
        .orderBy(asc(supportWallets.sortOrder)),
      this.db
        .select()
        .from(supportCampaigns)
        .where(eq(supportCampaigns.active, true))
        .orderBy(asc(supportCampaigns.sortOrder))
        .limit(1),
    ]);

    const cfg = cfgRows[0];
    const campaign = campaignRows[0];
    const now = new Date();

    const campaignActive =
      campaign &&
      (!campaign.startsAt || campaign.startsAt <= now) &&
      (!campaign.endsAt || campaign.endsAt >= now);

    return {
      homeCardEnabled: cfg?.homeCardEnabled ?? true,
      campaign: campaignActive
        ? {
            title: pickLocale(campaign.title as Record<string, string>, locale),
            body: pickLocale(campaign.body as Record<string, string>, locale),
          }
        : null,
      wallets: walletRows.map((w) => ({
        id: w.id,
        network: w.network as SupportConfigResponse['wallets'][0]['network'],
        label: w.label,
        address: w.address,
        instructions: pickLocale(w.instructions as Record<string, string>, locale) || undefined,
      })),
      transparency: {
        ...DEFAULT_TRANSPARENCY,
        ...((cfg?.transparency as Record<string, string>) ?? {}),
      },
      options: DEFAULT_OPTIONS,
      preferredNetwork: (cfg?.preferredNetwork as SupportConfigResponse['preferredNetwork']) ?? null,
      reminderCooldownDays: cfg?.reminderCooldownDays ?? 30,
    };
  }
}

function pickLocale(map: Record<string, string> | null | undefined, locale: string): string {
  if (!map) return '';
  return map[locale] ?? map.en ?? Object.values(map)[0] ?? '';
}
