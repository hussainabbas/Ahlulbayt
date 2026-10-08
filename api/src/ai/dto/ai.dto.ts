import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class AssistantContextDto {
  @IsString()
  locale!: string;

  @IsString()
  marja!: string;

  @IsInt()
  hijriDay!: number;

  @IsInt()
  hijriMonth!: number;

  @IsInt()
  hijriYear!: number;

  @IsString()
  hijriFormatted!: string;

  @IsString()
  nextPrayerName!: string;

  @IsString()
  nextPrayerTime!: string;

  @IsString()
  prayerCountdown!: string;

  @IsString()
  cityName!: string;

  @IsArray()
  @IsString({ each: true })
  todayCalendarEvents!: string[];

  @IsArray()
  @IsString({ each: true })
  upcomingCalendarEvents!: string[];

  @IsBoolean()
  muharramSeason!: boolean;

  @IsOptional()
  @IsNumber()
  muharramDay!: number | null;
}

export class AiChatDto {
  @IsString()
  @MaxLength(2000)
  message!: string;

  @ValidateNested()
  @Type(() => AssistantContextDto)
  context!: AssistantContextDto;

  @IsOptional()
  @IsIn(['islamic_qa', 'prayer_guidance', 'dua_recommendation', 'ziyarat_recommendation', 'calendar_awareness'])
  intentHint?: string;
}

export interface AiResponsePayload {
  intent: string;
  bodyKey: string;
  bodyParams?: Record<string, string | number>;
  citations?: Array<{ id: string; title: string; source?: string }>;
  actions?: Array<{
    type: string;
    labelKey: string;
    payload?: Record<string, unknown>;
  }>;
  blocked?: boolean;
  blockReasonKey?: string;
}
