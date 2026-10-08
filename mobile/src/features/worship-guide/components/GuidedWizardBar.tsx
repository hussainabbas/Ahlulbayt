import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

interface GuidedWizardBarProps {
  current: number;
  total: number;
  guided: boolean;
  onToggleGuided: () => void;
  onPrev: () => void;
  onNext: () => void;
  onRepeatAudio?: () => void;
  canPrev: boolean;
  canNext: boolean;
}

export function GuidedWizardBar({
  current,
  total,
  guided,
  onToggleGuided,
  onPrev,
  onNext,
  onRepeatAudio,
  canPrev,
  canNext,
}: GuidedWizardBarProps) {
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
      <Pressable onPress={onToggleGuided} style={styles.toggle}>
        <Icon name={guided ? 'check' : 'book'} size={16} color={theme.colors.accentPrimary} />
        <Text variant="caption" color="accent">
          {t('worshipGuide.guided')}
        </Text>
      </Pressable>

      <Text variant="caption" color="secondary">
        {t('worshipGuide.stepOf', { current, total })}
      </Text>

      <View style={styles.actions}>
        {onRepeatAudio ? (
          <Pressable onPress={onRepeatAudio} style={styles.iconBtn}>
            <Text variant="caption" color="accent">
              🔊
            </Text>
          </Pressable>
        ) : null}
        <Pressable onPress={onPrev} disabled={!canPrev} style={styles.iconBtn}>
          <View style={{ transform: [{ rotate: '180deg' }] }}>
            <Icon
              name="chevron"
              size={20}
              color={canPrev ? theme.colors.textPrimary : theme.colors.textTertiary}
            />
          </View>
        </Pressable>
        <Pressable onPress={onNext} disabled={!canNext} style={styles.iconBtn}>
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
  },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  iconBtn: { padding: 6 },
});
