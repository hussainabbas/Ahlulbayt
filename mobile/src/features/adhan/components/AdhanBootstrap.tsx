import { useAdhanNotifications } from '../hooks/useAdhanNotifications';

/** Mount once at app root to keep adhan alarms synced. */
export function AdhanBootstrap() {
  useAdhanNotifications();
  return null;
}
