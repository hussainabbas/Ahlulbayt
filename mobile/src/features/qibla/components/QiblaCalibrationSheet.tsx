import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { useQiblaStore } from '../stores/qiblaStore';

interface QiblaCalibrationSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function QiblaCalibrationSheet({ visible, onClose }: QiblaCalibrationSheetProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const headingOffset = useQiblaStore((s) => s.headingOffset);
  const adjustHeadingOffset = useQiblaStore((s) => s.adjustHeadingOffset);
  const resetCalibration = useQiblaStore((s) => s.resetCalibration);
  const markCalibrated = useQiblaStore((s) => s.markCalibrated);

  const finish = () => {
    markCalibrated();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.surfaceElevated,
              borderColor: theme.colors.borderSubtle,
            },
          ]}
        >
          <Text variant="headingSm">{t('qibla.calibration.title')}</Text>
          <Text variant="bodySm" color="secondary">
            {t('qibla.calibration.instructions')}
          </Text>

          <View style={[styles.step, { backgroundColor: theme.colors.surfaceMuted }]}>
            <Text variant="caption" color="accent">
              1
            </Text>
            <Text variant="bodySm" color="secondary">
              {t('qibla.calibration.step1')}
            </Text>
          </View>
          <View style={[styles.step, { backgroundColor: theme.colors.surfaceMuted }]}>
            <Text variant="caption" color="accent">
              2
            </Text>
            <Text variant="bodySm" color="secondary">
              {t('qibla.calibration.step2')}
            </Text>
          </View>
          <View style={[styles.step, { backgroundColor: theme.colors.surfaceMuted }]}>
            <Text variant="caption" color="accent">
              3
            </Text>
            <Text variant="bodySm" color="secondary">
              {t('qibla.calibration.step3')}
            </Text>
          </View>

          <Text variant="overline" color="secondary">
            {t('qibla.calibration.manual')}
          </Text>
          <View style={styles.adjustRow}>
            <Pressable
              onPress={() => adjustHeadingOffset(-1)}
              style={[styles.adjustBtn, { borderColor: theme.colors.borderSubtle }]}
            >
              <Text variant="bodyMd">−1°</Text>
            </Pressable>
            <Text variant="bodyMd" color="accent">
              {headingOffset}°
            </Text>
            <Pressable
              onPress={() => adjustHeadingOffset(1)}
              style={[styles.adjustBtn, { borderColor: theme.colors.borderSubtle }]}
            >
              <Text variant="bodyMd">+1°</Text>
            </Pressable>
          </View>

          <View style={styles.actions}>
            <Pressable onPress={resetCalibration}>
              <Text variant="bodySm" color="tertiary">
                {t('qibla.calibration.reset')}
              </Text>
            </Pressable>
            <Pressable
              onPress={finish}
              style={[styles.doneBtn, { backgroundColor: theme.colors.accentPrimary }]}
            >
              <Text variant="bodyMd" color="inverse">
                {t('qibla.calibration.done')}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    gap: 12,
  },
  step: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  adjustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  adjustBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  doneBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
});
