import { Controller, Get, Param, Query } from '@nestjs/common';

import { ZiyaratService } from './ziyarat.service';

@Controller('v1/ziyarat')
export class ZiyaratController {
  constructor(private readonly ziyarat: ZiyaratService) {}

  @Get()
  list(@Query('locale') locale?: string, @Query('category') category?: string) {
    return this.ziyarat.list(locale ?? 'en', category);
  }

  @Get('recommend')
  recommend(
    @Query('muharramDay') muharramDay?: string,
    @Query('muharram') muharram?: string,
  ) {
    return this.ziyarat.recommend({
      muharramDay: muharramDay ? parseInt(muharramDay, 10) : undefined,
      muharramSeason: muharram === 'true',
    });
  }

  @Get(':id')
  getById(@Param('id') id: string, @Query('locale') locale?: string) {
    return this.ziyarat.getById(id, locale ?? 'en');
  }
}
