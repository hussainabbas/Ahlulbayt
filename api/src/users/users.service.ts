import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { DRIZZLE, DrizzleDB } from '../database/database.module';
import { userPreferences, users } from '../database/schema';
import { UpdatePreferencesDto, UpdateProfileDto } from './dto/users.dto';

const DEFAULT_PREFS = {
  prayerMethod: 'leva',
  prayerOffsets: {},
  highLatitudeRule: 'angle_based',
  theme: 'dark',
  muharramMode: 'auto',
  quranFontSize: 28,
  quranDisplayMode: 'stacked',
  notificationPrefs: {},
  analyticsEnabled: true,
  locationSharing: false,
};

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async getProfile(userId: string) {
    const [user] = await this.db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) throw new NotFoundException('User not found');

    const [prefs] = await this.db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      locale: user.locale,
      role: user.role,
      tier: user.tier,
      marja: user.marja,
      isAnonymous: user.isAnonymous,
      preferences: prefs ?? { userId, ...DEFAULT_PREFS },
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const patch: Partial<typeof users.$inferInsert> = { updatedAt: new Date() };
    if (dto.displayName !== undefined) patch.displayName = dto.displayName;
    if (dto.avatarUrl !== undefined) patch.avatarUrl = dto.avatarUrl;
    if (dto.locale !== undefined) patch.locale = dto.locale;
    if (dto.marja !== undefined) patch.marja = dto.marja;

    await this.db.update(users).set(patch).where(eq(users.id, userId));
    return this.getProfile(userId);
  }

  async updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    await this.db
      .insert(userPreferences)
      .values({
        userId,
        prayerMethod: dto.prayerMethod ?? DEFAULT_PREFS.prayerMethod,
        prayerOffsets: dto.prayerOffsets ?? DEFAULT_PREFS.prayerOffsets,
        theme: dto.theme ?? DEFAULT_PREFS.theme,
        muharramMode: dto.muharramMode ?? DEFAULT_PREFS.muharramMode,
        quranFontSize: dto.quranFontSize ?? DEFAULT_PREFS.quranFontSize,
        quranDisplayMode: dto.quranDisplayMode ?? DEFAULT_PREFS.quranDisplayMode,
        notificationPrefs: dto.notificationPrefs ?? DEFAULT_PREFS.notificationPrefs,
        analyticsEnabled: dto.analyticsEnabled ?? DEFAULT_PREFS.analyticsEnabled,
        locationSharing: dto.locationSharing ?? DEFAULT_PREFS.locationSharing,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: {
          ...(dto.prayerMethod !== undefined && { prayerMethod: dto.prayerMethod }),
          ...(dto.prayerOffsets !== undefined && { prayerOffsets: dto.prayerOffsets }),
          ...(dto.theme !== undefined && { theme: dto.theme }),
          ...(dto.muharramMode !== undefined && { muharramMode: dto.muharramMode }),
          ...(dto.quranFontSize !== undefined && { quranFontSize: dto.quranFontSize }),
          ...(dto.quranDisplayMode !== undefined && { quranDisplayMode: dto.quranDisplayMode }),
          ...(dto.notificationPrefs !== undefined && { notificationPrefs: dto.notificationPrefs }),
          ...(dto.analyticsEnabled !== undefined && { analyticsEnabled: dto.analyticsEnabled }),
          ...(dto.locationSharing !== undefined && { locationSharing: dto.locationSharing }),
          updatedAt: new Date(),
        },
      });

    return this.getProfile(userId);
  }
}
