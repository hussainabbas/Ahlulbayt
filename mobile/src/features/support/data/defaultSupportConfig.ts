import type { SupportConfig } from '../types';

export const DEFAULT_SUPPORT_CONFIG: SupportConfig = {
  homeCardEnabled: true,
  campaign: {
    title: 'Support AhlulBayt+',
    body: 'Help keep the app ad-free and community-supported.',
  },
  wallets: [
    {
      id: 'default-btc',
      network: 'btc',
      label: 'Bitcoin (BTC)',
      address: '',
      instructions: 'Send only BTC to this address. Configure wallet in admin.',
    },
    {
      id: 'default-eth',
      network: 'eth',
      label: 'Ethereum (ETH)',
      address: '',
      instructions: 'Send only ETH to this address. Configure wallet in admin.',
    },
    {
      id: 'default-usdt-trc20',
      network: 'usdt_trc20',
      label: 'USDT (TRC20)',
      address: '',
      instructions: 'Send only USDT on TRON (TRC20) network.',
    },
    {
      id: 'default-usdt-erc20',
      network: 'usdt_erc20',
      label: 'USDT (ERC20)',
      address: '',
      instructions: 'Send only USDT on Ethereum (ERC20) network.',
    },
  ],
  transparency: {
    hosting: 'Server hosting and CDN',
    notifications: 'Push notification delivery',
    ai: 'AI assistant infrastructure',
    development: 'App development and maintenance',
  },
  options: [
    {
      id: 'one_time',
      icon: '💚',
      titleKey: 'support.options.oneTime.title',
      descriptionKey: 'support.options.oneTime.description',
    },
    {
      id: 'coffee',
      icon: '☕',
      titleKey: 'support.options.coffee.title',
      descriptionKey: 'support.options.coffee.description',
    },
    {
      id: 'monthly',
      icon: '⭐',
      titleKey: 'support.options.monthly.title',
      descriptionKey: 'support.options.monthly.description',
    },
    {
      id: 'annual',
      icon: '📅',
      titleKey: 'support.options.annual.title',
      descriptionKey: 'support.options.annual.description',
    },
    {
      id: 'founding',
      icon: '🏆',
      titleKey: 'support.options.founding.title',
      descriptionKey: 'support.options.founding.description',
    },
  ],
  preferredNetwork: 'btc',
  reminderCooldownDays: 30,
};
