import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { DRIZZLE, DrizzleDB } from '../database/database.module';
import { devices, userPreferences } from '../database/schema';
import { RegisterDeviceDto, UpdateNotificationPrefsDto } from './dto/notifications.dto';

const DEFAULT_NOTIFICATION_PREFS = {
  prayer: { enabled: true, advanceMinutes: 15 },
  events: { enabled: true },
  duas: { enabled: true },
  muharram: { enabled: true },
  amaal: { enabled: true },
  fasting: { enabled: true },
};

@Injectable()
export class NotificationsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async registerDevice(userId: string, dto: RegisterDeviceDto) {
    const [existing] = await this.db
      .select({ id: devices.id })
      .from(devices)
      .where(eq(devices.pushToken, dto.pushToken))
      .limit(1);

    if (existing) {
      const [updated] = await this.db
        .update(devices)
        .set({
          userId,
          platform: dto.platform,
          appVersion: dto.appVersion,
          locale: dto.locale,
          timezone: dto.timezone,
          lastSeenAt: new Date(),
        })
        .where(eq(devices.id, existing.id))
        .returning();
      return { id: updated!.id, updated: true };
    }

    const [created] = await this.db
      .insert(devices)
      .values({
        userId,
        platform: dto.platform,
        pushToken: dto.pushToken,
        appVersion: dto.appVersion,
        locale: dto.locale,
        timezone: dto.timezone,
      })
      .returning({ id: devices.id });

    return { id: created!.id, updated: false };
  }

  async getPreferences(userId: string) {
    const [prefs] = await this.db
      .select({ notificationPrefs: userPreferences.notificationPrefs })
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    return {
      notificationPrefs: prefs?.notificationPrefs ?? DEFAULT_NOTIFICATION_PREFS,
    };
  }

  async updatePreferences(userId: string, dto: UpdateNotificationPrefsDto) {
    await this.db
      .insert(userPreferences)
      .values({
        userId,
        notificationPrefs: dto.notificationPrefs,
      })
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: { notificationPrefs: dto.notificationPrefs, updatedAt: new Date() },
      });

    return this.getPreferences(userId);
  }

  async listDevices(userId: string) {
    const rows = await this.db
      .select({
        id: devices.id,
        platform: devices.platform,
        appVersion: devices.appVersion,
        locale: devices.locale,
        timezone: devices.timezone,
        lastSeenAt: devices.lastSeenAt,
      })
      .from(devices)
      .where(eq(devices.userId, userId));

    return {
      total: rows.length,
      items: rows.map((d) => ({
        ...d,
        lastSeenAt: d.lastSeenAt.toISOString(),
      })),
    };
  }
}
