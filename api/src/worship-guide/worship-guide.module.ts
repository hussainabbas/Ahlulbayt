import { Module } from '@nestjs/common';

import { WorshipGuideController } from './worship-guide.controller';
import { WorshipGuideService } from './worship-guide.service';

@Module({
  controllers: [WorshipGuideController],
  providers: [WorshipGuideService],
  exports: [WorshipGuideService],
})
export class WorshipGuideModule {}
