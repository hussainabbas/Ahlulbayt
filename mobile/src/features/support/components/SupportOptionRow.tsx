import { ListRow } from '@/components/ui/ListRow';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { SupportOption } from '../types';

interface SupportOptionRowProps {
  option: SupportOption;
  onPress: () => void;
  isLast?: boolean;
}

export function SupportOptionRow({ option, onPress, isLast }: SupportOptionRowProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <ListRow
      title={t(option.titleKey)}
      subtitle={t(option.descriptionKey)}
      onPress={onPress}
      isLast={isLast}
      leading={
        <Text variant="headingMd" style={{ width: 28, textAlign: 'center' }}>
          {option.icon}
        </Text>
      }
      accentColor={theme.colors.accentPrimary}
    />
  );
}
