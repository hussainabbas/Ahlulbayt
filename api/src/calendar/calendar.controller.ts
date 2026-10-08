import { Controller, Get, Query } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

import { CalendarService } from './calendar.service';

class CalendarQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  month?: number;

  @IsOptional()
  type?: string;

  @IsOptional()
  locale?: string;
}

class CalendarTodayQueryDto {
  @IsInt()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  hijriMonth!: number;

  @IsInt()
  @Min(1)
  @Max(30)
  @Type(() => Number)
  hijriDay!: number;

  @IsOptional()
  locale?: string;
}

@Controller('v1/calendar')
export class CalendarController {
  constructor(private readonly calendar: CalendarService) {}

  @Get('events')
  listEvents(@Query() query: CalendarQueryDto) {
    return this.calendar.listEvents(query.locale ?? 'en', query.month, query.type);
  }

  @Get('today')
  today(@Query() query: CalendarTodayQueryDto) {
    return this.calendar.getToday(query.hijriMonth, query.hijriDay, query.locale ?? 'en');
  }
}
