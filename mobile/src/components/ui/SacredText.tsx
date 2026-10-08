import { Text as RNText, type TextProps as RNTextProps, StyleSheet } from 'react-native';

import {
  getSacredTextStyle,
  type SacredTextRole,
} from '@/theme/typographySystem';

interface SacredTextProps extends RNTextProps {
  role: SacredTextRole;
  fontScale?: number;
}

export function SacredText({
  role,
  fontScale = 1,
  style,
  children,
  ...rest
}: SacredTextProps) {
  return (
    <RNText style={[getSacredTextStyle(role, fontScale), style]} {...rest}>
      {children}
    </RNText>
  );
}

export const sacredTextStyles = StyleSheet.create({});
