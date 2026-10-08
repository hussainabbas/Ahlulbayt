import { useNotificationEngine } from '../hooks/useNotificationEngine';

/** Mount at app root — orchestrates prayer + smart notifications. */
export function NotificationBootstrap() {
  useNotificationEngine();
  return null;
}
