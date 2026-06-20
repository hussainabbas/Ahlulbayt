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
}

function DetailRow({
  label,
  value,
  onCopy,
  copyLabel,
  highlight,
}: {
  label: string;
  value?: string;
  onCopy?: () => void;
  copyLabel: string;
  highlight?: boolean;
}) {
  const { theme } = useTheme();
  if (!value) return null;

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: highlight
            ? theme.colors.accentPrimaryMuted
            : theme.colors.backgroundSecondary,
          borderRadius: theme.radius.md,
          borderColor: highlight ? theme.colors.accentPrimary : theme.colors.borderSubtle,
          borderWidth: highlight ? 1 : StyleSheet.hairlineWidth,
        },
      ]}
    >
      <View style={styles.rowText}>
        <Text variant="caption" color="tertiary" style={styles.rowLabel}>
          {label}
        </Text>
        <Text variant="bodySm" selectable style={highlight ? styles.highlightValue : undefined}>
          {value}
        </Text>
      </View>
      {onCopy ? (
        <Pressable
          onPress={onCopy}
          style={[
            styles.copyBtn,
            {
              backgroundColor: theme.colors.surfaceElevated,
              borderRadius: theme.radius.sm,
            },
          ]}
        >
          <Text variant="caption" color="accent">
            {copyLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function BankDetailsCard({ details }: BankDetailsCardProps) {
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

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View
          style={[
            styles.bankIcon,
            { backgroundColor: theme.colors.accentPrimaryMuted, borderRadius: theme.radius.full },
          ]}
        >
          <Text variant="headingMd">🏦</Text>
        </View>
        <View style={styles.headerText}>
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

      <View style={styles.fields}>
        <DetailRow
          label={t('support.bank.accountName')}
          value={details.accountName}
          copyLabel={t('support.bank.copy')}
          onCopy={() => copyValue(t('support.bank.accountName'), details.accountName)}
        />
        <DetailRow
          label={t('support.bank.bankName')}
          value={details.bankName}
          copyLabel={t('support.bank.copy')}
          onCopy={() => copyValue(t('support.bank.bankName'), details.bankName)}
        />
        <DetailRow
          label={t('support.bank.iban')}
          value={details.iban}
          copyLabel={t('support.bank.copy')}
          highlight
          onCopy={() => copyValue(t('support.bank.iban'), details.iban)}
        />
        <DetailRow
          label={t('support.bank.swift')}
          value={details.swift}
          copyLabel={t('support.bank.copy')}
          onCopy={() => copyValue(t('support.bank.swift'), details.swift)}
        />
        <DetailRow
          label={t('support.bank.accountNumber')}
          value={details.accountNumber}
          copyLabel={t('support.bank.copy')}
          onCopy={() => copyValue(t('support.bank.accountNumber'), details.accountNumber)}
        />
        <DetailRow
          label={t('support.bank.referenceNote')}
          value={details.referenceNote}
          copyLabel={t('support.bank.copy')}
          onCopy={() => copyValue(t('support.bank.referenceNote'), details.referenceNote)}
        />
      </View>

      {details.iban ? (
        <Button
          label={t('support.bank.copyIban')}
          onPress={() => copyValue(t('support.bank.iban'), details.iban)}
          size="md"
          variant="primary"
        />
      ) : null}

      <Text variant="caption" color="tertiary" style={styles.disclaimer}>
        {t('support.bank.disclaimer')}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: layout.blockGap,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bankIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  instructions: {
    lineHeight: 20,
  },
  fields: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 14,
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  rowLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  highlightValue: {
    fontFamily: 'monospace',
    lineHeight: 22,
  },
  copyBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  disclaimer: {
    lineHeight: 18,
  },
});
