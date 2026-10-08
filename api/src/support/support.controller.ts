import { Controller, Get, Query } from '@nestjs/common';

import { SupportService } from './support.service';

@Controller('v1/support')
export class SupportController {
  constructor(private readonly support: SupportService) {}

  @Get('config')
  getConfig(@Query('locale') locale?: string) {
    return this.support.getConfig(locale ?? 'en');
  }
}
