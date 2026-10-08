import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

interface GuidedNavigationBarProps {
  current: number;
  total: number;
  guided: boolean;
  guidedLabel: string;
  stepOfLabel: string;
  onToggleGuided: () => void;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  isLastStep?: boolean;
}

export function GuidedNavigationBar({
  current,
  total,
  guided,
  guidedLabel,
  stepOfLabel,
  onToggleGuided,
  onPrev,
  onNext,
  canPrev,
  canNext,
  isLastStep = false,
}: GuidedNavigationBarProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const nextLabel = isLastStep ? t('guidedSession.finish') : t('guidedSession.next');

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderTopColor: theme.colors.borderSubtle,
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <View style={styles.metaRow}>
        <Pressable
          onPress={onToggleGuided}
          style={({ pressed }) => [
            styles.guidedPill,
            {
              backgroundColor: guided ? theme.colors.accentPrimaryMuted : theme.colors.surfaceMuted,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Icon name={guided ? 'check' : 'book'} size={14} color={theme.colors.accentPrimary} />
          <Text variant="caption" color="accent" weight="600">
            {guidedLabel}
          </Text>
        </Pressable>
        <Text variant="bodySm" color="secondary" weight="500">
          {stepOfLabel}
        </Text>
      </View>

      {guided ? (
        <Text variant="caption" color="tertiary" style={styles.swipeHint}>
          {t('guidedSession.swipeHint')}
        </Text>
      ) : null}

      <View style={styles.actions}>
        <Pressable
          onPress={onPrev}
          disabled={!canPrev}
          style={({ pressed }) => [
            styles.navBtn,
            styles.backBtn,
            {
              borderColor: theme.colors.borderSubtle,
              backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surfaceElevated,
              opacity: canPrev ? 1 : 0.45,
            },
          ]}
        >
          <View style={styles.chevronLeft}>
            <Icon
              name="chevron"
              size={18}
              color={canPrev ? theme.colors.textPrimary : theme.colors.textTertiary}
            />
          </View>
          <Text variant="bodySm" weight="600" color={canPrev ? 'primary' : 'tertiary'}>
            {t('guidedSession.back')}
          </Text>
        </Pressable>

        <Pressable
          onPress={onNext}
          disabled={!canNext}
          style={({ pressed }) => [
            styles.navBtn,
            styles.nextBtn,
            {
              backgroundColor: canNext
                ? pressed
                  ? theme.colors.accentPrimary
                  : theme.colors.accentPrimary
                : theme.colors.surfaceMuted,
              opacity: canNext ? (pressed ? 0.92 : 1) : 0.45,
            },
          ]}
        >
          <Text
            variant="bodySm"
            weight="600"
            style={{ color: canNext ? theme.colors.textInverse : theme.colors.textTertiary }}
          >
            {nextLabel}
          </Text>
          <Icon
            name="chevron"
            size={18}
            color={canNext ? theme.colors.textInverse : theme.colors.textTertiary}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: 12,
    gap: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  guidedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  swipeHint: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  backBtn: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  nextBtn: {},
  chevronLeft: {
    transform: [{ rotate: '180deg' }],
  },
});
