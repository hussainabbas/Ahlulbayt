import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

interface NoteEditorSheetProps {
  visible: boolean;
  initialText: string;
  ayahRef: string;
  onSave: (text: string) => void;
  onDelete?: () => void;
  onClose: () => void;
}

export function NoteEditorSheet({
  visible,
  initialText,
  ayahRef,
  onSave,
  onDelete,
  onClose,
}: NoteEditorSheetProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const [text, setText] = useState(initialText);

  useEffect(() => {
    if (visible) setText(initialText);
  }, [visible, initialText]);

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
          <Text variant="headingSm">{t('quran.notes')}</Text>
          <Text variant="caption" color="tertiary">
            {ayahRef}
          </Text>
          <TextInput
            value={text}
            onChangeText={setText}
            multiline
            placeholder={t('quran.notePlaceholder')}
            placeholderTextColor={theme.colors.textTertiary}
            style={[
              styles.input,
              {
                color: theme.colors.textPrimary,
                borderColor: theme.colors.borderSubtle,
                backgroundColor: theme.colors.surfaceMuted,
              },
            ]}
          />
          <View style={styles.actions}>
            {onDelete && initialText ? (
              <Pressable onPress={onDelete}>
                <Text variant="bodySm" color="secondary">
                  {t('common.delete')}
                </Text>
              </Pressable>
            ) : (
              <View />
            )}
            <Pressable
              onPress={() => {
                onSave(text.trim());
                onClose();
              }}
              style={[styles.saveBtn, { backgroundColor: theme.colors.accentPrimary }]}
            >
              <Text variant="bodySm" style={{ color: theme.colors.textInverse }}>
                {t('common.save')}
              </Text>
            </Pressable>
          </View>
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 10,
  },
  input: {
    minHeight: 120,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 999,
  },
});
