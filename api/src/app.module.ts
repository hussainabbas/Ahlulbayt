import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AdminModule } from './admin/admin.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { CalendarModule } from './calendar/calendar.module';
import { ContentModule } from './content/content.module';
import { DatabaseModule } from './database/database.module';
import { DuasModule } from './duas/duas.module';
import { HealthController } from './health.controller';
import { NotificationsModule } from './notifications/notifications.module';
import { HadithModule } from './hadith/hadith.module';
import { QuranAudioModule } from './quran-audio/quran-audio.module';
import { PrayerModule } from './prayer/prayer.module';
import { QuranModule } from './quran/quran.module';
import { RedisModule } from './redis/redis.module';
import { SyncModule } from './sync/sync.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { WorshipGuideModule } from './worship-guide/worship-guide.module';
import { ZiyaratModule } from './ziyarat/ziyarat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    DatabaseModule,
    RedisModule,
    AuthModule,
    UsersModule,
    PrayerModule,
    QuranModule,
    QuranAudioModule,
    HadithModule,
    WorshipGuideModule,
    DuasModule,
    ZiyaratModule,
    CalendarModule,
    NotificationsModule,
    AiModule,
    ContentModule,
    SyncModule,
    SubscriptionsModule,
    AnalyticsModule,
    AdminModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true, transform: true }),
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
