import { Module } from '@nestjs/common';

import { AiController } from './ai.controller';
import { AiResponseEngine } from './ai-response.engine';
import { AiService } from './ai.service';

@Module({
  controllers: [AiController],
  providers: [AiService, AiResponseEngine],
  exports: [AiService],
})
export class AiModule {}
