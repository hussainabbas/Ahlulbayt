import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { HadithExplainDto, HadithSearchQueryDto } from './dto/hadith-search.dto';
import { HadithCorpusService } from './hadith-corpus.service';
import { HadithSearchService } from './hadith-search.service';

@Controller('v1/hadith')
export class HadithController {
  constructor(
    private readonly search: HadithSearchService,
    private readonly corpus: HadithCorpusService,
  ) {}

  @Get('search')
  searchHadith(@Query() query: HadithSearchQueryDto) {
    return this.search.search({
      q: query.q,
      source: query.source,
      topic: query.topic,
      grading: query.grading,
      locale: query.locale,
      page: query.page,
      limit: query.limit,
      mode: query.mode,
    });
  }

  @Get('sources')
  listSources() {
    return this.corpus.listSources();
  }

  @Get('entries/:id')
  getEntry(@Param('id') id: string) {
    return this.corpus.getEntry(id);
  }

  @Get('entries/:id/related')
  getRelated(@Param('id') id: string, @Query('limit') limit?: string) {
    return this.search.getRelated(id, limit ? parseInt(limit, 10) : 6);
  }

  @Get('daily')
  getDaily(@Query('date') date?: string) {
    return this.search.getDaily(date);
  }

  @Post('entries/:id/explain')
  explain(@Param('id') id: string, @Body() dto: HadithExplainDto) {
    return {
      id,
      locale: dto.locale ?? 'en',
      explanation: null,
      status: 'pending_corpus',
      message: 'RAG explain endpoint — activate after corpus ingest',
    };
  }
}
