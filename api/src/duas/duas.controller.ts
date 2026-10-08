import { Controller, Get, Param, Query } from '@nestjs/common';

import { DuasService } from './duas.service';

@Controller('v1/duas')
export class DuasController {
  constructor(private readonly duas: DuasService) {}

  @Get()
  list(
    @Query('locale') locale?: string,
    @Query('category') category?: string,
    @Query('kind') kind?: string,
  ) {
    return this.duas.list(locale ?? 'en', category, kind);
  }

  @Get('categories')
  categories() {
    return this.duas.listCategories();
  }

  @Get('daily-life')
  dailyLife(@Query('locale') locale?: string, @Query('category') category?: string) {
    return this.duas.listDailyLife(locale ?? 'en', category);
  }

  @Get('daily-life/today')
  dailyLifeToday(@Query('locale') locale?: string) {
    return this.duas.getDailyLifeToday(locale ?? 'en');
  }

  @Get('search')
  search(
    @Query('q') q = '',
    @Query('locale') locale?: string,
    @Query('kind') kind?: string,
  ) {
    return this.duas.search(q, locale ?? 'en', kind);
  }

  @Get('recommend')
  recommend(
    @Query('muharram') muharram?: string,
    @Query('dayOfWeek') dayOfWeek?: string,
  ) {
    return this.duas.recommend({
      muharramSeason: muharram === 'true',
      dayOfWeek,
    });
  }

  @Get(':id/body')
  getBody(@Param('id') id: string) {
    return this.duas.getBody(id);
  }

  @Get(':id')
  getById(@Param('id') id: string, @Query('locale') locale?: string) {
    return this.duas.getById(id, locale ?? 'en');
  }
}
