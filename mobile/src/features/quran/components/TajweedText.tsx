import { Text as RNText, StyleSheet } from 'react-native';

import { useTheme } from '@/theme/ThemeContext';
import {
  arabicLineHeight,
  FONT_FAMILIES,
} from '@/theme/typographySystem';

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

const QURAN_LINE_HEIGHT_RATIO = 2.15;

export function TajweedText({
  text,
  words,
  segments,
  fontSize = 26,
  showTajweed = true,
  activeWordIndex,
}: TajweedTextProps) {
  const { theme } = useTheme();
  const lineHeight = arabicLineHeight(fontSize, 'quran');
  const baseStyle = [
    styles.arabic,
    {
      fontFamily: FONT_FAMILIES.scheherazadeRegular,
      fontSize,
      lineHeight,
      color: theme.colors.textPrimary,
    },
  ];

  if (words?.length) {
    return (
      <RNText style={baseStyle}>
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
      <RNText style={baseStyle}>
        {segments.map((seg, i) => (
          <RNText key={i} style={{ color: getTajweedColor(seg.rule, theme.scheme) }}>
            {seg.text}
          </RNText>
        ))}
      </RNText>
    );
  }

  return (
    <RNText style={baseStyle}>
      {text}
    </RNText>
  );
}

const styles = StyleSheet.create({
  arabic: {
    textAlign: 'right',
    writingDirection: 'rtl',
    fontWeight: '400',
  },
});

export { QURAN_LINE_HEIGHT_RATIO };
