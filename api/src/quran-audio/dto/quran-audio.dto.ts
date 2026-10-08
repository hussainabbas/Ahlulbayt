import { IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class QuranAudioProgressDto {
  @IsString()
  trackId!: string;

  @IsNumber()
  @Min(0)
  positionSec!: number;

  @IsOptional()
  @IsString()
  updatedAt?: string;
}

export class QuranAudioUrlQueryDto {
  @IsOptional()
  @IsInt()
  @Min(32)
  @Max(320)
  bitrate?: number = 128;
}

export class RegisterDownloadDto {
  @IsString()
  reciterId!: string;

  @IsInt()
  @Min(1)
  @Max(114)
  surah!: number;

  @IsOptional()
  @IsString()
  deviceId?: string;
}
