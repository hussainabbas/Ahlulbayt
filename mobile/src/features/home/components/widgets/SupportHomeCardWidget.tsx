import { useEffect } from 'react';

import { SupportHomeCard } from '@/features/support/components/SupportHomeCard';
import { useSupportConfig, useSupportHomeCard } from '@/features/support/hooks/useSupportConfig';

export function SupportHomeCardWidget() {
  const { config } = useSupportConfig();
  const { visible, markReminderShown } = useSupportHomeCard(config);

  useEffect(() => {
    if (visible) markReminderShown();
  }, [visible, markReminderShown]);

  if (!visible) return null;

  return <SupportHomeCard config={config} />;
}
