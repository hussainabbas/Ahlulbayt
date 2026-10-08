import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class WorshipGuideProgressDto {
  @IsString()
  guideId!: string;

  @IsArray()
  completedStepIds!: string[];

  @IsOptional()
  @IsString()
  lastStepId?: string;

  @IsOptional()
  @IsString()
  mode?: string;

  @IsOptional()
  @IsBoolean()
  guidedModeEnabled?: boolean;
}
