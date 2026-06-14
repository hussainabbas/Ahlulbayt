/** AhlulBayt+ worship illustration palette — light/dark, minimal Islamic modern style. */

export type IllustrationTheme = 'light' | 'dark';

export interface IllustrationPalette {
  background: string;
  figurePrimary: string;
  figureSecondary: string;
  figureStroke: string;
  accent: string;
  accentMuted: string;
  water: string;
  waterHighlight: string;
  ground: string;
  label: string;
}

export const ILLUSTRATION_PALETTES: Record<IllustrationTheme, IllustrationPalette> = {
  light: {
    background: '#F4F1EA',
    figurePrimary: '#1B4332',
    figureSecondary: '#95B8A8',
    figureStroke: '#2D6A4F',
    accent: '#1B4332',
    accentMuted: '#D8E8DF',
    water: '#5B9BD5',
    waterHighlight: '#A8D4F5',
    ground: '#E8E2D6',
    label: '#1B4332',
  },
  dark: {
    background: '#1A1F1C',
    figurePrimary: '#95D5B2',
    figureSecondary: '#40916C',
    figureStroke: '#52B788',
    accent: '#95D5B2',
    accentMuted: '#2D3B34',
    water: '#64B5F6',
    waterHighlight: '#90CAF9',
    ground: '#252B27',
    label: '#B7E4C7',
  },
};

export const ILLUSTRATION_VIEWBOX = { width: 200, height: 220 } as const;
