import { analytics } from '@/core/analytics';
import { ANALYTICS_EVENTS } from '@/core/analytics/types';

export function trackSupportHomeCardView(): void {
  analytics.track(ANALYTICS_EVENTS.SUPPORT_HOME_CARD_VIEW);
}

export function trackSupportHomeCardClick(): void {
  analytics.track(ANALYTICS_EVENTS.SUPPORT_HOME_CARD_CLICK);
}

export function trackSupportHomeCardDismiss(): void {
  analytics.track(ANALYTICS_EVENTS.SUPPORT_HOME_CARD_DISMISS);
}

export function trackSupportHubView(): void {
  analytics.track(ANALYTICS_EVENTS.SUPPORT_HUB_VIEW);
}

export function trackSupportOptionClick(optionId: string): void {
  analytics.track(ANALYTICS_EVENTS.SUPPORT_OPTION_CLICK, { optionId });
}

export function trackSupportCryptoView(optionId: string): void {
  analytics.track(ANALYTICS_EVENTS.SUPPORT_CRYPTO_VIEW, { optionId });
}

export function trackSupportWalletCopy(network: string): void {
  analytics.track(ANALYTICS_EVENTS.SUPPORT_WALLET_COPY, { network });
}

export function trackSupportQrView(network: string): void {
  analytics.track(ANALYTICS_EVENTS.SUPPORT_QR_VIEW, { network });
}
