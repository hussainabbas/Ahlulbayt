import { Module } from '@nestjs/common';

import { QuranController } from './quran.controller';
import { QuranCatalogService } from './quran-catalog.service';
import { QuranSearchService } from './quran-search.service';

@Module({
  controllers: [QuranController],
  providers: [QuranSearchService, QuranCatalogService],
  exports: [QuranSearchService, QuranCatalogService],
})
export class QuranModule {}
