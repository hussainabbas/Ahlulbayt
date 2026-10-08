import { IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  @MaxLength(200)
  title!: string;

  @IsString()
  @MaxLength(2000)
  body!: string;

  @IsOptional()
  @IsObject()
  segment?: Record<string, unknown>;
}

export class PreviewSegmentDto {
  @IsOptional()
  @IsObject()
  segment?: Record<string, unknown>;
}
