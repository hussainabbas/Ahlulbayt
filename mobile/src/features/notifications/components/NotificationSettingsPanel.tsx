import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { NotificationCategory } from '../types';
import { useNotificationPreferencesStore } from '../stores/notificationPreferencesStore';

const CATEGORIES: NotificationCategory[] = [
  'prayer',
  'events',
  'duas',
  'muharram',
  'amaal',
  'fasting',
];

export function NotificationSettingsPanel() {
  const { t } = useLocale();
  const { theme } = useTheme();

  const masterEnabled = useNotificationPreferencesStore((s) => s.masterEnabled);
  const quietHoursEnabled = useNotificationPreferencesStore((s) => s.quietHoursEnabled);
  const categories = useNotificationPreferencesStore((s) => s.categories);
  const setMasterEnabled = useNotificationPreferencesStore((s) => s.setMasterEnabled);
  const setCategoryEnabled = useNotificationPreferencesStore((s) => s.setCategoryEnabled);
  const setQuietHours = useNotificationPreferencesStore((s) => s.setQuietHours);

  return (
    <View style={styles.wrap}>
      <Text variant="headingSm" style={styles.sectionTitle}>
        {t('notifications.settings.title')}
      </Text>
      <Text variant="bodySm" color="secondary" style={styles.subtitle}>
        {t('notifications.settings.subtitle')}
      </Text>

      <Card padded={false}>
        <ToggleRow
          label={t('notifications.settings.master')}
          active={masterEnabled}
          onPress={() => setMasterEnabled(!masterEnabled)}
        />
        <ToggleRow
          label={t('notifications.settings.quietHours')}
          active={quietHoursEnabled}
          onPress={() => setQuietHours(!quietHoursEnabled)}
          border
        />
      </Card>

      <Text variant="headingSm" style={styles.categoriesTitle}>
        {t('notifications.settings.categories')}
      </Text>

      <Card padded={false}>
        {CATEGORIES.map((cat, index) => (
          <ToggleRow
            key={cat}
            label={t(`notifications.categories.${cat}`)}
            description={t(`notifications.categories.${cat}Desc`)}
            active={categories[cat].enabled && masterEnabled}
            disabled={!masterEnabled}
            onPress={() => setCategoryEnabled(cat, !categories[cat].enabled)}
            border={index < CATEGORIES.length - 1}
          />
        ))}
      </Card>
    </View>
  );
}

function ToggleRow({
  label,
  description,
  active,
  disabled,
  onPress,
  border,
}: {
  label: string;
  description?: string;
  active: boolean;
  disabled?: boolean;
  onPress: () => void;
  border?: boolean;
}) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.row,
        border && { borderBottomWidth: 1, borderBottomColor: theme.colors.borderSubtle },
        pressed && !disabled && { backgroundColor: theme.colors.accentPrimaryMuted },
        disabled && { opacity: 0.5 },
      ]}
    >
      <View style={styles.rowText}>
        <Text variant="bodyMd">{label}</Text>
        {description ? (
          <Text variant="caption" color="tertiary">
            {description}
          </Text>
        ) : null}
      </View>
      <Text variant="bodySm" color={active ? 'accent' : 'tertiary'}>
        {active ? '●' : '○'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 24 },
  sectionTitle: { marginBottom: 4 },
  subtitle: { marginBottom: 12 },
  categoriesTitle: { marginTop: 20, marginBottom: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 52,
  },
  rowText: { flex: 1, paddingRight: 12, gap: 2 },
});
