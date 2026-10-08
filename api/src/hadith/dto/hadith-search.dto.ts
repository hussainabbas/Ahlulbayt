import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class HadithSearchQueryDto {
  @IsString()
  q!: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  topic?: string;

  @IsOptional()
  @IsString()
  grading?: string;

  @IsOptional()
  @IsString()
  locale?: string;

  @IsOptional()
  @IsEnum(['keyword', 'semantic', 'hybrid'])
  mode?: 'keyword' | 'semantic' | 'hybrid';

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}

export class HadithExplainDto {
  @IsOptional()
  @IsString()
  locale?: string;

  @IsOptional()
  @IsString()
  marja?: string;
}
