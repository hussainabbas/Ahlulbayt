import { IsIn, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class RegisterDeviceDto {
  @IsIn(['ios', 'android'])
  platform!: 'ios' | 'android';

  @IsString()
  @MaxLength(512)
  pushToken!: string;

  @IsOptional()
  @IsString()
  appVersion?: string;

  @IsOptional()
  @IsIn(['en', 'ar', 'ur'])
  locale?: string;

  @IsOptional()
  @IsString()
  timezone?: string;
}

export class UpdateNotificationPrefsDto {
  @IsObject()
  notificationPrefs!: Record<string, unknown>;
}
