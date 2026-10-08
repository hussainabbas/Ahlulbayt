import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { TAJWEED_LEGEND, getTajweedColor } from '../constants/tajweed';
import { useQuranReaderStore } from '../stores/quranReaderStore';
import type { ReaderDisplayMode, TranslationLayer } from '../types';

interface ReaderSettingsSheetProps {
  visible: boolean;
  onClose: () => void;
}

const DISPLAY_MODES: { id: ReaderDisplayMode; labelKey: string }[] = [
  { id: 'stacked', labelKey: 'quran.display.stacked' },
  { id: 'arabic_only', labelKey: 'quran.display.arabicOnly' },
  { id: 'translation_only', labelKey: 'quran.display.translationOnly' },
  { id: 'word_by_word', labelKey: 'quran.display.wordByWord' },
];

const LAYERS: TranslationLayer[] = ['en', 'ur', 'roman_ur'];

export function ReaderSettingsSheet({ visible, onClose }: ReaderSettingsSheetProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const {
    displayMode,
    showTajweed,
    translationLayers,
    showTafsir,
    audioSyncEnabled,
    setDisplayMode,
    setShowTajweed,
    toggleTranslationLayer,
    setShowTafsir,
    setAudioSyncEnabled,
  } = useQuranReaderStore();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.borderSubtle },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text variant="headingSm">{t('quran.readerSettings')}</Text>

          <Text variant="overline" color="tertiary" style={styles.section}>
            {t('quran.displayMode')}
          </Text>
          <View style={styles.chips}>
            {DISPLAY_MODES.map((mode) => (
              <Chip
                key={mode.id}
                label={t(mode.labelKey)}
                active={displayMode === mode.id}
                onPress={() => setDisplayMode(mode.id)}
              />
            ))}
          </View>

          <Text variant="overline" color="tertiary" style={styles.section}>
            {t('quran.translations')}
          </Text>
          <View style={styles.chips}>
            {LAYERS.map((layer) => (
              <Chip
                key={layer}
                label={t(`quran.layers.${layer === 'roman_ur' ? 'romanUr' : layer}`)}
                active={translationLayers.includes(layer)}
                onPress={() => toggleTranslationLayer(layer)}
              />
            ))}
          </View>

          <View style={styles.toggles}>
            <ToggleRow
              label={t('quran.tajweedColors')}
              active={showTajweed}
              onPress={() => setShowTajweed(!showTajweed)}
            />
            <ToggleRow
              label={t('quran.showTafsir')}
              active={showTafsir}
              onPress={() => setShowTafsir(!showTafsir)}
            />
            <ToggleRow
              label={t('quran.audioSync')}
              active={audioSyncEnabled}
              onPress={() => setAudioSyncEnabled(!audioSyncEnabled)}
            />
          </View>

          {showTajweed ? (
            <>
              <Text variant="overline" color="tertiary" style={styles.section}>
                {t('quran.tajweedLegend')}
              </Text>
              <View style={styles.legend}>
                {TAJWEED_LEGEND.map((item) => (
                  <View key={item.rule} style={styles.legendRow}>
                    <View
                      style={[
                        styles.dot,
                        { backgroundColor: getTajweedColor(item.rule, theme.scheme) },
                      ]}
                    />
                    <Text variant="caption" color="secondary">
                      {t(item.labelKey)}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          <Pressable
            onPress={onClose}
            style={[styles.doneBtn, { backgroundColor: theme.colors.accentPrimary }]}
          >
            <Text variant="bodySm" style={{ color: theme.colors.textInverse }}>
              {t('common.done')}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? theme.colors.accentPrimaryMuted : theme.colors.surfaceMuted,
          borderColor: active ? theme.colors.accentPrimary : theme.colors.borderSubtle,
        },
      ]}
    >
      <Text variant="caption" color={active ? 'accent' : 'secondary'}>
        {label}
      </Text>
    </Pressable>
  );
}

function ToggleRow({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  return (
    <Pressable onPress={onPress} style={styles.toggleRow}>
      <Text variant="bodySm" color="secondary">
        {label}
      </Text>
      <View
        style={[
          styles.toggle,
          {
            backgroundColor: active ? theme.colors.accentPrimary : theme.colors.surfaceMuted,
          },
        ]}
      >
        <View
          style={[
            styles.knob,
            {
              alignSelf: active ? 'flex-end' : 'flex-start',
              backgroundColor: theme.colors.textInverse,
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 8,
    maxHeight: '85%',
  },
  section: {
    marginTop: 12,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  toggles: {
    marginTop: 8,
    gap: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 3,
  },
  knob: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  legend: {
    gap: 6,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  doneBtn: {
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 999,
    marginTop: 16,
  },
});
