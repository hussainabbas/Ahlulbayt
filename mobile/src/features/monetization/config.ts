/**
 * Subscription / paywall UI is off until launch.
 * Core app features stay free; premium-only surfaces (e.g. Hadith AI summary tab) stay hidden.
 *
 * Set to true when subscriptions go live.
 */
export const SUBSCRIPTIONS_ENABLED = false;

/** Paywall, upgrade cards, More menu premium row, etc. */
export function shouldShowSubscriptionUi(): boolean {
  return SUBSCRIPTIONS_ENABLED;
}

/** Premium-only feature UI (not paywall gates). Hidden while subscriptions are off. */
export function shouldShowPremiumFeatureSurfaces(): boolean {
  return SUBSCRIPTIONS_ENABLED;
}

/** When subscriptions are off, treat all entitlements as granted so nothing is paywall-blocked. */
export function areSubscriptionsEnforced(): boolean {
  return SUBSCRIPTIONS_ENABLED;
}
