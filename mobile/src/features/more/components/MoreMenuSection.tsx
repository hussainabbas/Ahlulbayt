import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { ListRow } from '@/components/ui/ListRow';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';

import type { MoreMenuItem, MoreMenuSection as MoreMenuSectionConfig } from '../constants/menuConfig';
import { MenuItemIcon } from './MenuItemIcon';

interface MoreMenuSectionProps {
  section: MoreMenuSectionConfig;
  items: MoreMenuItem[];
  onPress: (item: MoreMenuItem) => void;
}

export function MoreMenuSection({ section, items, onPress }: MoreMenuSectionProps) {
  const { t } = useLocale();

  if (items.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <Text variant="overline" color="secondary">
        {t(`more.sections.${section.id}`)}
      </Text>
      <Card padded={false}>
        {items.map((item, index) => (
          <ListRow
            key={item.key}
            title={t(`more.${item.key}`)}
            onPress={() => onPress(item)}
            leading={<MenuItemIcon itemKey={item.key} variant="list" />}
            isLast={index === items.length - 1}
          />
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
  },
});
