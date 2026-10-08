import { IsObject, IsOptional } from 'class-validator';

export class UpdateAiConfigDto {
  @IsObject()
  value!: Record<string, unknown>;
}

export class UpdateGuardrailsDto {
  @IsOptional()
  blockedPatterns?: string[];
}
