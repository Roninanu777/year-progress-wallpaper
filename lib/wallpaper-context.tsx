'use client';

import { createContext, useContext, useReducer, useMemo, type ReactNode } from 'react';
import { DEVICE_PRESETS } from './constants';
import { generateApiUrl } from './utils';
import { wallpaperReducer, initialState, type WallpaperState, type WallpaperAction } from './wallpaper-reducer';

interface WallpaperContextValue {
  state: WallpaperState;
  dispatch: React.Dispatch<WallpaperAction>;
  apiUrl: string;
}

const WallpaperContext = createContext<WallpaperContextValue | null>(null);

export function WallpaperProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wallpaperReducer, initialState);
  const deviceConfig = DEVICE_PRESETS[state.device];

  const apiUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return generateApiUrl(window.location.origin, {
      width: deviceConfig.width,
      height: deviceConfig.height,
      bgColor: state.bgColor,
      filledColor: state.filledColor,
      emptyColor: state.emptyColor,
      radius: state.radius,
      spacing: state.spacing,
      textColor: state.textColor,
      accentColor: state.accentColor,
      showCustomText: state.showCustomText,
      customText: state.customText,
      font: state.font,
      monthStyle: state.monthStyle,
    }, state.mode);
  }, [state, deviceConfig]);

  return (
    <WallpaperContext.Provider value={{ state, dispatch, apiUrl }}>
      {children}
    </WallpaperContext.Provider>
  );
}

export function useWallpaper() {
  const context = useContext(WallpaperContext);
  if (!context) {
    throw new Error('useWallpaper must be used within a WallpaperProvider');
  }
  return context;
}
