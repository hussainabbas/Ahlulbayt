import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class AdminUsersQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsIn(['free', 'premium'])
  tier?: string;

  @IsOptional()
  @IsIn(['user', 'moderator', 'admin', 'super_admin'])
  role?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class AdminUpdateUserDto {
  @IsOptional()
  @IsIn(['free', 'premium'])
  tier?: string;

  @IsOptional()
  @IsIn(['user', 'moderator', 'admin', 'super_admin'])
  role?: string;

  @IsOptional()
  @IsString()
  displayName?: string;
}
