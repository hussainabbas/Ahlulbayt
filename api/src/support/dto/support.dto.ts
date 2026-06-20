import { IsBoolean, IsIn, IsInt, IsObject, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export const SUPPORT_NETWORKS = ['btc', 'eth', 'usdt_trc20', 'usdt_erc20'] as const;
export type SupportNetwork = (typeof SUPPORT_NETWORKS)[number];

export class CreateSupportWalletDto {
  @IsIn(SUPPORT_NETWORKS)
  network!: SupportNetwork;

  @IsString()
  @MaxLength(120)
  label!: string;

  @IsString()
  @MaxLength(256)
  address!: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsObject()
  instructions?: Record<string, string>;
}

export class UpdateSupportWalletDto {
  @IsOptional()
  @IsIn(SUPPORT_NETWORKS)
  network?: SupportNetwork;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  label?: string;

  @IsOptional()
  @IsString()
  @MaxLength(256)
  address?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsObject()
  instructions?: Record<string, string>;
}

export class CreateSupportCampaignDto {
  @IsString()
  @MaxLength(80)
  slug!: string;

  @IsObject()
  title!: Record<string, string>;

  @IsObject()
  body!: Record<string, string>;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  startsAt?: string;

  @IsOptional()
  @IsString()
  endsAt?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class UpdateSupportCampaignDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  slug?: string;

  @IsOptional()
  @IsObject()
  title?: Record<string, string>;

  @IsOptional()
  @IsObject()
  body?: Record<string, string>;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  startsAt?: string | null;

  @IsOptional()
  @IsString()
  endsAt?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class UpdateSupportConfigDto {
  @IsOptional()
  @IsBoolean()
  homeCardEnabled?: boolean;

  @IsOptional()
  @IsObject()
  transparency?: Record<string, string>;

  @IsOptional()
  @IsIn(SUPPORT_NETWORKS)
  preferredNetwork?: SupportNetwork | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  reminderCooldownDays?: number;
}

export interface SupportConfigResponse {
  homeCardEnabled: boolean;
  campaign: { title: string; body: string } | null;
  wallets: Array<{
    id: string;
    network: SupportNetwork;
    label: string;
    address: string;
    instructions?: string;
  }>;
  transparency: Record<string, string>;
  options: Array<{
    id: string;
    icon: string;
    titleKey: string;
    descriptionKey: string;
  }>;
  preferredNetwork?: SupportNetwork | null;
  reminderCooldownDays: number;
}
