export interface Counter {
  id: string;
  name: string;
  value: number;
  colorKey: PinkColor;
}

export type PinkColor = 'rose' | 'coral' | 'peach' | 'lavender' | 'baby' | 'magenta';

export const PINK_PALETTE: Record<PinkColor, { main: string; light: string; dark: string }> = {
  rose:     { main: '#FF69B4', light: '#FFB6D9', dark: '#D4458E' },
  coral:    { main: '#FF7F8E', light: '#FFBCC3', dark: '#D4606C' },
  peach:    { main: '#FFAAA5', light: '#FFD5D2', dark: '#D48580' },
  lavender: { main: '#D4A5FF', light: '#EADAFF', dark: '#A87AD4' },
  baby:     { main: '#FFB6D9', light: '#FFDDED', dark: '#D490B0' },
  magenta:  { main: '#E040A0', light: '#F0A0D0', dark: '#B03080' },
};

export const PINK_COLOR_KEYS: PinkColor[] = ['rose', 'coral', 'peach', 'lavender', 'baby', 'magenta'];
