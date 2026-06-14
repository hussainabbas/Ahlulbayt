import { IsBoolean, IsIn, IsInt, IsObject, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsIn(['en', 'ar', 'ur'])
  locale?: string;

  @IsOptional()
  @IsIn(['sistani', 'khamenei', 'naqvi'])
  marja?: string;
}

export class UpdatePreferencesDto {
  @IsOptional()
  @IsIn(['leva', 'jafari'])
  prayerMethod?: string;

  @IsOptional()
  @IsObject()
  prayerOffsets?: Record<string, number>;

  @IsOptional()
  @IsIn(['dark', 'light', 'muharram'])
  theme?: string;

  @IsOptional()
  @IsIn(['auto', 'on', 'off'])
  muharramMode?: string;

  @IsOptional()
  @IsInt()
  @Min(16)
  @Max(48)
  quranFontSize?: number;

  @IsOptional()
  @IsIn(['stacked', 'arabic_only'])
  quranDisplayMode?: string;

  @IsOptional()
  @IsObject()
  notificationPrefs?: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  analyticsEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  locationSharing?: boolean;
}
