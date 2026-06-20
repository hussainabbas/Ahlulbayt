import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';

interface SupportSectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
}

export function SupportSectionHeader({ title, subtitle, icon }: SupportSectionHeaderProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.wrap}>
      {icon ? (
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: theme.colors.accentPrimaryMuted, borderRadius: theme.radius.md },
          ]}
        >
          <Text variant="headingMd">{icon}</Text>
        </View>
      ) : null}
      <View style={styles.text}>
        <Text variant="label" color="secondary" style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" color="tertiary">
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  iconWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
