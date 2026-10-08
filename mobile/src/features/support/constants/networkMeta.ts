import type { SupportNetwork } from '../types';

export const NETWORK_META: Record<
  SupportNetwork,
  { icon: string; short: string; accent: string }
> = {
  btc: { icon: '₿', short: 'BTC', accent: '#F7931A' },
  eth: { icon: 'Ξ', short: 'ETH', accent: '#627EEA' },
  usdt_trc20: { icon: '₮', short: 'TRC20', accent: '#26A17B' },
  usdt_erc20: { icon: '₮', short: 'ERC20', accent: '#26A17B' },
};
