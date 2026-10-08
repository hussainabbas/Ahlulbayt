import { getHeaderTitle, Header } from '@react-navigation/elements';
import type { NativeStackHeaderProps } from '@react-navigation/native-stack';

import { useEffectiveSafeInsets } from '@/core/native/safeArea';

/** iOS native stack header can miss the status-bar inset; elements Header applies it explicitly. */
export function StackHeader({ route, options, back }: NativeStackHeaderProps) {
  const insets = useEffectiveSafeInsets();

  return (
    <Header
      {...options}
      back={back}
      title={getHeaderTitle(options, route.name)}
      headerStatusBarHeight={insets.top}
    />
  );
}
