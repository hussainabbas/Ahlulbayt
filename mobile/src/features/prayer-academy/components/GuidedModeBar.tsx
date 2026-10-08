import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

interface GuidedModeBarProps {
  current: number;
  total: number;
  guided: boolean;
  onToggleGuided: () => void;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}

export function GuidedModeBar({
  current,
  total,
  guided,
  onToggleGuided,
  onPrev,
  onNext,
  canPrev,
  canNext,
}: GuidedModeBarProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
        },
      ]}
    >
      <Pressable onPress={onToggleGuided} style={styles.guidedToggle}>
        <Icon name={guided ? 'check' : 'book'} size={16} color={theme.colors.accentPrimary} />
        <Text variant="caption" color="accent">
          {t('prayerAcademy.guided')}
        </Text>
      </Pressable>

      <Text variant="caption" color="secondary">
        {t('prayerAcademy.stepOf', { current, total })}
      </Text>

      <View style={styles.nav}>
        <Pressable onPress={onPrev} disabled={!canPrev} style={styles.navBtn}>
          <View style={{ transform: [{ rotate: '180deg' }] }}>
            <Icon
              name="chevron"
              size={20}
              color={canPrev ? theme.colors.textPrimary : theme.colors.textTertiary}
            />
          </View>
        </Pressable>
        <Pressable onPress={onNext} disabled={!canNext} style={styles.navBtn}>
          <Icon
            name="chevron"
            size={20}
            color={canNext ? theme.colors.textPrimary : theme.colors.textTertiary}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.blockGap,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  guidedToggle: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  nav: { flexDirection: 'row', gap: 4 },
  navBtn: { padding: 6 },
});
