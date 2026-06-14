import { Controller, Get, Param, Query } from '@nestjs/common';

import { DuasService } from './duas.service';

@Controller('v1/duas')
export class DuasController {
  constructor(private readonly duas: DuasService) {}

  @Get()
  list(@Query('locale') locale?: string, @Query('category') category?: string) {
    return this.duas.list(locale ?? 'en', category);
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

  @Get(':id')
  getById(@Param('id') id: string, @Query('locale') locale?: string) {
    return this.duas.getById(id, locale ?? 'en');
  }
}
