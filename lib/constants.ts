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
  'sans-serif': 'Sans Serif',
  'serif': 'Serif',
  'monospace': 'Monospace',
} as const;

export type FontKey = keyof typeof FONT_OPTIONS;

export const DEFAULT_SETTINGS = {
  device: 'iphone-17' as DevicePresetKey,
  bgColor: '#000000',
  filledColor: '#FFFFFF',
  emptyColor: '#333333',
  radius: 12,
  spacing: 6,
  textColor: '#FFFFFF',
  showCustomText: false,
  customText: '',
  font: 'sans-serif' as FontKey,
};

export const PRESET_THEMES = {
  minimal: {
    name: 'Minimal',
    bgColor: '#000000',
    filledColor: '#FFFFFF',
    emptyColor: '#333333',
    textColor: '#FFFFFF',
  },
  neon: {
    name: 'Neon',
    bgColor: '#0a0a0a',
    filledColor: '#22c55e',
    emptyColor: '#1a1a1a',
    textColor: '#22c55e',
  },
  pastel: {
    name: 'Pastel',
    bgColor: '#fef3c7',
    filledColor: '#f87171',
    emptyColor: '#fde68a',
    textColor: '#78350f',
  },
  ocean: {
    name: 'Ocean',
    bgColor: '#0c4a6e',
    filledColor: '#38bdf8',
    emptyColor: '#0369a1',
    textColor: '#bae6fd',
  },
  sunset: {
    name: 'Sunset',
    bgColor: '#1c1917',
    filledColor: '#f97316',
    emptyColor: '#292524',
    textColor: '#fed7aa',
  },
  lavender: {
    name: 'Lavender',
    bgColor: '#1e1b4b',
    filledColor: '#a78bfa',
    emptyColor: '#312e81',
    textColor: '#c4b5fd',
  },
} as const;

export type ThemeKey = keyof typeof PRESET_THEMES;

// Grid configuration for 365/366 days
export const GRID_CONFIG = {
  columns: 20,
  rows: 19, // 20 * 19 = 380, we'll use 365/366
};
