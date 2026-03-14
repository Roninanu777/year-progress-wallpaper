'use client';

import { useWallpaper } from '@/lib/wallpaper-context';
import { PRESET_THEMES, ThemeKey } from '@/lib/constants';
import { motion } from 'framer-motion';

export default function ThemeSection() {
  const { state, dispatch } = useWallpaper();

  const isActiveTheme = (themeKey: ThemeKey) => {
    const theme = PRESET_THEMES[themeKey];
    return (
      state.bgColor === theme.bgColor &&
      state.filledColor === theme.filledColor &&
      state.emptyColor === theme.emptyColor
    );
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {Object.entries(PRESET_THEMES).map(([key, theme]) => {
        const active = isActiveTheme(key as ThemeKey);
        return (
          <motion.button
            key={key}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch({ type: 'APPLY_THEME', payload: key as ThemeKey })}
            className={`group flex flex-col items-center p-3 rounded-lg border transition-colors ${
              active
                ? 'bg-primary/10 border-primary'
                : 'bg-secondary/50 border-border hover:bg-secondary hover:border-muted-foreground'
            }`}
            aria-label={`Apply ${theme.name} theme`}
          >
            <div className="flex gap-1 mb-2">
              <div
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: theme.bgColor }}
              />
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: theme.filledColor }}
              />
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: theme.emptyColor }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{theme.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
