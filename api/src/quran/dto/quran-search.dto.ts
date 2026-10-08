import { IsIn, IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class QuranSearchQueryDto {
  @IsString()
  @MinLength(2)
  q!: string;

  @IsOptional()
  @IsIn(['semantic', 'keyword'])
  mode?: 'semantic' | 'keyword';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
