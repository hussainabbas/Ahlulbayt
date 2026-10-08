import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { useTheme } from '@/theme/ThemeContext';

import type { IslamicCitation } from '@/core/citations';
import { hasVerifiedCitation, requireCitationsOrUnverified } from '@/core/citations';
import { layout } from '@/theme/layout';

import { CitationList } from './CitationList';
import { UnverifiedDisclaimer } from './UnverifiedDisclaimer';

interface CitableSectionProps extends ViewProps {
  citations?: IslamicCitation[];
  children: ReactNode;
  titleKey?: string;
  compact?: boolean;
  devContext?: string;
  showDisclaimerWhenEmpty?: boolean;
}

export function CitableSection({
  citations = [],
  children,
  titleKey,
  compact,
  devContext,
  showDisclaimerWhenEmpty = true,
  style,
  ...rest
}: CitableSectionProps) {
  const { theme } = useTheme();

  if (__DEV__ && devContext) {
    requireCitationsOrUnverified({ citations }, devContext);
  }

  const showFooter = citations.length > 0 || (showDisclaimerWhenEmpty && !hasVerifiedCitation(citations));

  return (
    <View style={[styles.root, style]} {...rest}>
      {children}
      {showFooter ? (
        <View style={[styles.footer, { borderTopColor: theme.colors.borderSubtle }]}>
          {citations.length > 0 ? (
            <CitationList
              citations={citations}
              titleKey={titleKey}
              compact={compact}
              showDisclaimer={showDisclaimerWhenEmpty}
            />
          ) : showDisclaimerWhenEmpty ? (
            <UnverifiedDisclaimer />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: layout.blockGap,
  },
  footer: {
    marginTop: layout.blockGap,
    paddingTop: layout.blockGap,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'transparent',
  },
});
