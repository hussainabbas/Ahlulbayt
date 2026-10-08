import { useCallback } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { SupportBankDetails } from '../types';

interface BankDetailsCardProps {
  details: SupportBankDetails;
  featured?: boolean;
}

type Field = { key: string; label: string; value?: string };

function CopyChip({ label, onPress }: { label: string; onPress: () => void }) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.copyChip,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.full,
        },
      ]}
    >
      <Text variant="caption" color="accent">
        {label}
      </Text>
    </Pressable>
  );
}

export function BankDetailsCard({ details, featured = false }: BankDetailsCardProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  const copyValue = useCallback(
    (label: string, value?: string) => {
      if (!value) return;
      Clipboard.setString(value);
      Alert.alert(t('support.bank.copiedTitle'), t('support.bank.copiedBody', { label }));
    },
    [t],
  );

  const fields: Field[] = [
    { key: 'accountName', label: t('support.bank.accountName'), value: details.accountName },
    { key: 'bankName', label: t('support.bank.bankName'), value: details.bankName },
    { key: 'swift', label: t('support.bank.swift'), value: details.swift },
    { key: 'accountNumber', label: t('support.bank.accountNumber'), value: details.accountNumber },
    { key: 'referenceNote', label: t('support.bank.referenceNote'), value: details.referenceNote },
  ].filter((f) => Boolean(f.value?.trim()));

  return (
    <Card
      style={[
        styles.card,
        featured
          ? {
              borderColor: theme.colors.accentPrimary,
              borderWidth: 1.5,
            }
          : null,
      ]}
    >
      <View style={styles.titleRow}>
        <View
          style={[
            styles.icon,
            { backgroundColor: theme.colors.accentPrimaryMuted, borderRadius: theme.radius.full },
          ]}
        >
          <Text variant="headingMd">🏦</Text>
        </View>
        <View style={styles.titleText}>
          <Text variant="headingSm">{t('support.bank.title')}</Text>
          <Text variant="caption" color="tertiary">
            {t('support.bank.cardSubtitle')}
          </Text>
        </View>
      </View>

      {details.instructions ? (
        <Text variant="bodySm" color="secondary" style={styles.instructions}>
          {details.instructions}
        </Text>
      ) : null}

      {details.iban ? (
        <View
          style={[
            styles.ibanBlock,
            {
              backgroundColor: theme.colors.accentPrimaryMuted,
              borderRadius: theme.radius.lg,
            },
          ]}
        >
          <Text variant="caption" color="tertiary" style={styles.fieldLabel}>
            {t('support.bank.iban')}
          </Text>
          <Text variant="bodyMd" selectable style={styles.ibanValue}>
            {details.iban}
          </Text>
          <Button
            label={t('support.bank.copyIban')}
            onPress={() => copyValue(t('support.bank.iban'), details.iban)}
            size="md"
            variant="primary"
            style={styles.ibanButton}
          />
        </View>
      ) : null}

      {fields.length > 0 ? (
        <View style={styles.fieldList}>
          {fields.map((field) => (
            <View
              key={field.key}
              style={[
                styles.fieldRow,
                {
                  borderBottomColor: theme.colors.borderSubtle,
                },
              ]}
            >
              <View style={styles.fieldContent}>
                <Text variant="caption" color="tertiary" style={styles.fieldLabel}>
                  {field.label}
                </Text>
                <Text variant="bodySm" selectable>
                  {field.value}
                </Text>
              </View>
              <CopyChip
                label={t('support.bank.copy')}
                onPress={() => copyValue(field.label, field.value)}
              />
            </View>
          ))}
        </View>
      ) : null}

      <Text variant="caption" color="tertiary" style={styles.disclaimer}>
        {t('support.bank.disclaimer')}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    flex: 1,
    gap: 2,
  },
  instructions: {
    lineHeight: 20,
  },
  ibanBlock: {
    padding: 16,
    gap: 8,
  },
  ibanValue: {
    fontFamily: 'monospace',
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  ibanButton: {
    marginTop: 4,
  },
  fieldList: {
    gap: 0,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  fieldContent: {
    flex: 1,
    gap: 4,
  },
  fieldLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  copyChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: StyleSheet.hairlineWidth,
  },
  disclaimer: {
    lineHeight: 18,
    marginTop: 4,
  },
});
