import { Modal, Pressable, StyleSheet } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { SLEEP_TIMER_MINUTES } from '../types';

interface SleepTimerSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelectMinutes: (minutes: number) => void;
  onSelectEndOfSurah: () => void;
  onClear: () => void;
}

export function SleepTimerSheet({
  visible,
  onClose,
  onSelectMinutes,
  onSelectEndOfSurah,
  onClear,
}: SleepTimerSheetProps) {
  const { theme } = useTheme();
  const { t } = useLocale();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: theme.colors.surfaceElevated }]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text variant="headingSm">{t('quran.player.sleep')}</Text>
          <Text variant="bodySm" color="secondary">
            {t('quran.player.sleepHint')}
          </Text>

          {SLEEP_TIMER_MINUTES.map((minutes) => (
            <Pressable key={minutes} onPress={() => onSelectMinutes(minutes)} style={styles.row}>
              <Text variant="bodyMd">
                {t('quran.player.sleepMinutes', { minutes })}
              </Text>
            </Pressable>
          ))}

          <Pressable onPress={onSelectEndOfSurah} style={styles.row}>
            <Text variant="bodyMd">{t('quran.player.sleepEndSurah')}</Text>
          </Pressable>

          <Pressable onPress={onClear} style={styles.row}>
            <Text variant="bodySm" color="secondary">
              {t('quran.player.sleepClear')}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 4,
  },
  row: {
    paddingVertical: 14,
  },
});
