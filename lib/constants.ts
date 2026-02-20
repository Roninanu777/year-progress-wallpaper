export const DEVICE_PRESETS = {
  'iphone-17': { width: 1284, height: 2778, name: 'iPhone 17' },
  'iphone-17-pro': { width: 1206, height: 2622, name: 'iPhone 17 Pro' },
  'iphone-17-pro-max': { width: 1320, height: 2868, name: 'iPhone 17 Pro Max' },
  'iphone-16-pro-max': { width: 1320, height: 2868, name: 'iPhone 16 Pro Max' },
  'iphone-15-pro': { width: 1179, height: 2556, name: 'iPhone 15 Pro' },
  'iphone-15': { width: 1179, height: 2556, name: 'iPhone 15' },
  'iphone-14-pro-max': { width: 1290, height: 2796, name: 'iPhone 14 Pro Max' },
  'iphone-14': { width: 1170, height: 2532, name: 'iPhone 14' },
} as const;

export type DevicePresetKey = keyof typeof DEVICE_PRESETS;

export const FONT_OPTIONS = {
  'Inter': 'Inter',
  'Playfair Display': 'Playfair',
  'Roboto Mono': 'Roboto Mono',
  'Lora': 'Lora',
  'Oswald': 'Oswald',
  'sans-serif': 'Sans Serif',
  'serif': 'Serif',
  'monospace': 'Monospace',
} as const;

export type FontKey = keyof typeof FONT_OPTIONS;

export const MONTH_STYLES = {
  glass: 'Glass Card',
  classic: 'Classic Grid',
  bold: 'Bold Blocks',
} as const;

export type MonthStyleKey = keyof typeof MONTH_STYLES;

export const DEFAULT_SETTINGS = {
  device: 'iphone-17' as DevicePresetKey,
  bgColor: '#000000',
  filledColor: '#FFFFFF',
  emptyColor: '#333333',
  radius: 12,
  spacing: 6,
  textColor: '#FFFFFF',
  accentColor: '#FFA500',
  showCustomText: false,
  customText: '',
  font: 'Lora' as FontKey,
  monthStyle: 'glass' as MonthStyleKey,
};

export const PRESET_THEMES = {
  minimal: {
    name: 'Minimal',
    bgColor: '#000000',
    filledColor: '#FFFFFF',
    emptyColor: '#333333',
    textColor: '#FFFFFF',
    accentColor: '#FFA500',
  },
  neon: {
    name: 'Neon',
    bgColor: '#0a0a0a',
    filledColor: '#22c55e',
    emptyColor: '#1a1a1a',
    textColor: '#22c55e',
    accentColor: '#4ade80',
  },
  ocean: {
    name: 'Ocean',
    bgColor: '#0c4a6e',
    filledColor: '#38bdf8',
    emptyColor: '#0369a1',
    textColor: '#bae6fd',
    accentColor: '#38bdf8',
  },
  sunset: {
    name: 'Sunset',
    bgColor: '#1c1917',
    filledColor: '#f97316',
    emptyColor: '#292524',
    textColor: '#fed7aa',
    accentColor: '#f97316',
  },
  lavender: {
    name: 'Lavender',
    bgColor: '#1e1b4b',
    filledColor: '#a78bfa',
    emptyColor: '#312e81',
    textColor: '#c4b5fd',
    accentColor: '#a78bfa',
  },
  midnight: {
    name: 'Midnight',
    bgColor: '#0f172a',
    filledColor: '#7dd3fc',
    emptyColor: '#1e293b',
    textColor: '#e0f2fe',
    accentColor: '#38bdf8',
  },
  rose: {
    name: 'Rose',
    bgColor: '#1a0a0e',
    filledColor: '#fb7185',
    emptyColor: '#2d1520',
    textColor: '#fda4af',
    accentColor: '#fb7185',
  },
  teal: {
    name: 'Teal',
    bgColor: '#042f2e',
    filledColor: '#2dd4bf',
    emptyColor: '#134e4a',
    textColor: '#99f6e4',
    accentColor: '#2dd4bf',
  },
  mocha: {
    name: 'Mocha',
    bgColor: '#1c1210',
    filledColor: '#d4a574',
    emptyColor: '#2e211c',
    textColor: '#e8c9a8',
    accentColor: '#d4a574',
  },
  crimson: {
    name: 'Crimson',
    bgColor: '#180a0a',
    filledColor: '#ef4444',
    emptyColor: '#2d1515',
    textColor: '#fca5a5',
    accentColor: '#ef4444',
  },
  arctic: {
    name: 'Arctic',
    bgColor: '#0f1729',
    filledColor: '#e2e8f0',
    emptyColor: '#1e2a45',
    textColor: '#f1f5f9',
    accentColor: '#94a3b8',
  },
  amber: {
    name: 'Amber',
    bgColor: '#1a1000',
    filledColor: '#fbbf24',
    emptyColor: '#2e2308',
    textColor: '#fde68a',
    accentColor: '#f59e0b',
  },
} as const;

export type ThemeKey = keyof typeof PRESET_THEMES;

// Grid configuration for 365/366 days
export const GRID_CONFIG = {
  columns: 20,
  rows: 19, // 20 * 19 = 380, we'll use 365/366
};
