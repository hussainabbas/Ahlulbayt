import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import { PRAYER_KEYS, READING_CONTENT_TYPES } from '../constants/events';

export class AnalyticsEventDto {
  @IsString()
  @MaxLength(50)
  name!: string;

  @IsOptional()
  @IsObject()
  properties?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  sessionId?: string;

  @IsOptional()
  @IsString()
  clientTimestamp?: string;
}

export class IngestEventsDto {
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => AnalyticsEventDto)
  events!: AnalyticsEventDto[];

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsString()
  appVersion?: string;
}

export class RecordPrayerCompletionDto {
  @IsIn([...PRAYER_KEYS])
  prayer!: string;

  @IsOptional()
  @IsString()
  completedDate?: string;

  @IsOptional()
  @IsIn(['manual', 'auto', 'notification'])
  source?: string;
}

export class RecordReadingSessionDto {
  @IsIn([...READING_CONTENT_TYPES])
  contentType!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(114)
  surah?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  ayahFrom?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  ayahTo?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  durationSeconds?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  ayahsRead?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  progressPct?: number;
}

export class RetentionQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(7)
  @Max(90)
  days?: number;
}
