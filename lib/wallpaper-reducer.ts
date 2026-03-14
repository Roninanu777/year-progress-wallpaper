import { DEFAULT_SETTINGS, DevicePresetKey, FontKey, MonthStyleKey, PRESET_THEMES, ThemeKey } from './constants';

export interface WallpaperState {
  device: DevicePresetKey;
  bgColor: string;
  filledColor: string;
  emptyColor: string;
  radius: number;
  spacing: number;
  textColor: string;
  accentColor: string;
  showCustomText: boolean;
  customText: string;
  font: FontKey;
  monthStyle: MonthStyleKey;
  mode: 'year' | 'month';
}

export type WallpaperAction =
  | { type: 'SET_DEVICE'; payload: DevicePresetKey }
  | { type: 'SET_COLOR'; field: 'bgColor' | 'filledColor' | 'emptyColor' | 'textColor' | 'accentColor'; payload: string }
  | { type: 'SET_RADIUS'; payload: number }
  | { type: 'SET_SPACING'; payload: number }
  | { type: 'SET_CUSTOM_TEXT'; payload: string }
  | { type: 'SET_SHOW_CUSTOM_TEXT'; payload: boolean }
  | { type: 'SET_FONT'; payload: FontKey }
  | { type: 'SET_MONTH_STYLE'; payload: MonthStyleKey }
  | { type: 'SET_MODE'; payload: 'year' | 'month' }
  | { type: 'APPLY_THEME'; payload: ThemeKey };

export const initialState: WallpaperState = {
  ...DEFAULT_SETTINGS,
  mode: 'year',
};

export function wallpaperReducer(state: WallpaperState, action: WallpaperAction): WallpaperState {
  switch (action.type) {
    case 'SET_DEVICE':
      return { ...state, device: action.payload };
    case 'SET_COLOR':
      return { ...state, [action.field]: action.payload };
    case 'SET_RADIUS':
      return { ...state, radius: action.payload };
    case 'SET_SPACING':
      return { ...state, spacing: action.payload };
    case 'SET_CUSTOM_TEXT':
      return { ...state, customText: action.payload };
    case 'SET_SHOW_CUSTOM_TEXT':
      return { ...state, showCustomText: action.payload };
    case 'SET_FONT':
      return { ...state, font: action.payload };
    case 'SET_MONTH_STYLE':
      return { ...state, monthStyle: action.payload };
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'APPLY_THEME': {
      const theme = PRESET_THEMES[action.payload];
      return {
        ...state,
        bgColor: theme.bgColor,
        filledColor: theme.filledColor,
        emptyColor: theme.emptyColor,
        textColor: theme.textColor,
        accentColor: theme.accentColor,
      };
    }
    default:
      return state;
  }
}
