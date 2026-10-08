import { Module } from '@nestjs/common';

import { ZiyaratController } from './ziyarat.controller';
import { ZiyaratService } from './ziyarat.service';

@Module({
  controllers: [ZiyaratController],
  providers: [ZiyaratService],
  exports: [ZiyaratService],
})
export class ZiyaratModule {}
