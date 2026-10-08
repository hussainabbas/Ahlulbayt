import { Module } from '@nestjs/common';

import { PrayerController } from './prayer.controller';
import { PrayerService } from './prayer.service';
import { PrayerValidationService } from './prayer-validation.service';

@Module({
  controllers: [PrayerController],
  providers: [PrayerService, PrayerValidationService],
  exports: [PrayerService, PrayerValidationService],
})
export class PrayerModule {}
