import { IsObject, IsOptional, IsString } from 'class-validator';

export class PublishManifestDto {
  @IsString()
  version!: string;

  @IsObject()
  bundles!: Record<string, unknown>[];
}

export class UpdateContentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
