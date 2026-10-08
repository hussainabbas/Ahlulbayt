import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';

import { QuranSearchQueryDto } from './dto/quran-search.dto';
import { QuranCatalogService } from './quran-catalog.service';
import { QuranSearchService } from './quran-search.service';

@Controller('v1/quran')
export class QuranController {
  constructor(
    private readonly quranSearch: QuranSearchService,
    private readonly catalog: QuranCatalogService,
  ) {}

  @Get('search')
  search(@Query() dto: QuranSearchQueryDto) {
    return this.quranSearch.search(dto.q, dto.limit ?? 25);
  }

  @Get('surahs')
  listSurahs() {
    return this.catalog.listSurahs();
  }

  @Get('surahs/:number')
  getSurah(@Param('number', ParseIntPipe) number: number) {
    return this.catalog.getSurah(number);
  }
}
