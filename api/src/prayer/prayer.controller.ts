import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthTokenPayload } from '../auth/token.service';
import { CompleteQadhaDto, CreateQadhaDto, ValidatePrayerDto } from './dto/prayer.dto';
import { PrayerService } from './prayer.service';
import { PrayerValidationService } from './prayer-validation.service';

@Controller('v1/prayer')
export class PrayerController {
  constructor(
    private readonly prayer: PrayerService,
    private readonly validation: PrayerValidationService,
  ) {}

  @Post('validate')
  validate(@Body() dto: ValidatePrayerDto) {
    return this.validation.validate(dto);
  }

  @Get('qadha')
  @UseGuards(JwtAuthGuard)
  listQadha(
    @CurrentUser() user: AuthTokenPayload,
    @Query('pending') pending?: string,
  ) {
    return this.prayer.listQadha(user.sub, pending !== 'false');
  }

  @Post('qadha')
  @UseGuards(JwtAuthGuard)
  createQadha(@CurrentUser() user: AuthTokenPayload, @Body() dto: CreateQadhaDto) {
    return this.prayer.createQadha(user.sub, dto);
  }

  @Put('qadha/:id/complete')
  @UseGuards(JwtAuthGuard)
  completeQadha(
    @CurrentUser() user: AuthTokenPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CompleteQadhaDto,
  ) {
    return this.prayer.completeQadha(user.sub, id, dto);
  }

  @Delete('qadha/:id')
  @UseGuards(JwtAuthGuard)
  deleteQadha(
    @CurrentUser() user: AuthTokenPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.prayer.deleteQadha(user.sub, id);
  }
}
