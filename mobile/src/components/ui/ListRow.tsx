import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

interface ListRowProps {
  title: string;
  subtitle?: string;
  meta?: string;
  onPress?: () => void;
  showChevron?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  accentColor?: string;
  isLast?: boolean;
  style?: ViewStyle;
}

export function ListRow({
  title,
  subtitle,
  meta,
  onPress,
  showChevron = true,
  leading,
  trailing,
  accentColor,
  isLast = false,
  style,
}: ListRowProps) {
  const { theme } = useTheme();

  const content = (
    <>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      {accentColor ? (
        <View style={[styles.accent, { backgroundColor: accentColor }]} />
      ) : null}
      <View style={styles.body}>
        <Text variant="bodyMd" weight="500">
          {title}
        </Text>
        {subtitle ? (
          <Text variant="bodySm" color="secondary" numberOfLines={2} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
        {meta ? (
          <Text variant="caption" color="tertiary" style={styles.meta}>
            {meta}
          </Text>
        ) : null}
      </View>
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
      {showChevron && onPress ? <Icon name="chevron" size={16} /> : null}
    </>
  );

  const rowStyle = [
    styles.row,
    {
      borderBottomColor: theme.colors.borderSubtle,
      borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
    },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          ...rowStyle,
          pressed && { backgroundColor: theme.colors.surfaceMuted },
        ]}
        accessibilityRole="button"
      >
        {content}
      </Pressable>
    );
  }

  return <View style={rowStyle}>{content}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.blockGap,
    paddingHorizontal: layout.listRowPaddingX,
    paddingVertical: layout.listRowPaddingY,
    minHeight: layout.listRowMinHeight,
  },
  accent: {
    width: 3,
    alignSelf: 'stretch',
    borderRadius: 2,
    marginVertical: 2,
  },
  leading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  subtitle: {
    marginTop: 2,
  },
  meta: {
    marginTop: 4,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
