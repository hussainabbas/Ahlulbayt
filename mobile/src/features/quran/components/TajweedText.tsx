import { Text as RNText, StyleSheet } from 'react-native';

import { useTheme } from '@/theme/ThemeContext';

import { getTajweedColor } from '../constants/tajweed';
import type { QuranWord, TajweedRule, TajweedSegment } from '../types';

interface TajweedTextProps {
  text?: string;
  words?: QuranWord[];
  segments?: TajweedSegment[];
  fontSize?: number;
  showTajweed?: boolean;
  activeWordIndex?: number | null;
  onWordPress?: (index: number) => void;
}

export function TajweedText({
  text,
  words,
  segments,
  fontSize = 28,
  showTajweed = true,
  activeWordIndex,
}: TajweedTextProps) {
  const { theme } = useTheme();

  if (words?.length) {
    return (
      <RNText style={[styles.arabic, { fontSize, lineHeight: fontSize * 1.65 }]}>
        {words.map((word, i) => {
          const rule: TajweedRule = showTajweed ? (word.tajweed ?? 'default') : 'default';
          const color =
            activeWordIndex === word.index
              ? theme.colors.accentGold
              : getTajweedColor(rule, theme.scheme);
          const isActive = activeWordIndex === word.index;
          return (
            <RNText
              key={`${word.index}-${i}`}
              style={{
                color,
                backgroundColor: isActive ? theme.colors.accentPrimaryMuted : 'transparent',
              }}
            >
              {word.arabic}
              {i < words.length - 1 ? ' ' : ''}
            </RNText>
          );
        })}
      </RNText>
    );
  }

  if (segments?.length && showTajweed) {
    return (
      <RNText style={[styles.arabic, { fontSize, lineHeight: fontSize * 1.65 }]}>
        {segments.map((seg, i) => (
          <RNText key={i} style={{ color: getTajweedColor(seg.rule, theme.scheme) }}>
            {seg.text}
          </RNText>
        ))}
      </RNText>
    );
  }

  return (
    <RNText
      style={[
        styles.arabic,
        { fontSize, lineHeight: fontSize * 1.65, color: theme.colors.textPrimary },
      ]}
    >
      {text}
    </RNText>
  );
}

const styles = StyleSheet.create({
  arabic: {
    textAlign: 'right',
    writingDirection: 'rtl',
    fontWeight: '500',
  },
});
