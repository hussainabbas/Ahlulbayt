import { Module } from '@nestjs/common';

import { HadithController } from './hadith.controller';
import { HadithCorpusService } from './hadith-corpus.service';
import { HadithSearchService } from './hadith-search.service';

@Module({
  controllers: [HadithController],
  providers: [HadithSearchService, HadithCorpusService],
  exports: [HadithSearchService, HadithCorpusService],
})
export class HadithModule {}
