export type SupportNetwork = 'btc' | 'eth' | 'usdt_trc20' | 'usdt_erc20';

export interface SupportWallet {
  id: string;
  network: SupportNetwork;
  label: string;
  address: string;
  instructions?: string;
}

export interface SupportTransparency {
  hosting: string;
  notifications: string;
  ai: string;
  development: string;
}

export interface SupportOption {
  id: string;
  icon: string;
  titleKey: string;
  descriptionKey: string;
}

export interface SupportCampaign {
  title: string;
  body: string;
}

export interface SupportConfig {
  homeCardEnabled: boolean;
  campaign: SupportCampaign | null;
  wallets: SupportWallet[];
  transparency: SupportTransparency;
  options: SupportOption[];
  preferredNetwork?: SupportNetwork | null;
  reminderCooldownDays: number;
}

export type SupporterTier = 'supporter' | 'gold' | 'founding';
