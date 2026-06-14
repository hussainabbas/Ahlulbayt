import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class PrayerTimesDto {
  @IsString()
  fajr!: string;

  @IsString()
  sunrise!: string;

  @IsString()
  dhuhr!: string;

  @IsString()
  asr!: string;

  @IsString()
  maghrib!: string;

  @IsString()
  isha!: string;
}

export class ValidatePrayerDto {
  @IsDateString()
  date!: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;

  @ValidateNested()
  @Type(() => PrayerTimesDto)
  times!: PrayerTimesDto;

  @IsOptional()
  @IsIn(['leva', 'jafari'])
  method?: string;
}

export class CreateQadhaDto {
  @IsIn(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'])
  prayer!: string;

  @IsDateString()
  missedDate!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CompleteQadhaDto {
  @IsOptional()
  @IsDateString()
  completedAt?: string;
}
