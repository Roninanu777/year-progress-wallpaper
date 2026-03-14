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
    <div className="grid grid-cols-3 gap-2">
      {Object.entries(PRESET_THEMES).map(([key, theme]) => {
        const active = isActiveTheme(key as ThemeKey);
        return (
          <motion.button
            key={key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => dispatch({ type: 'APPLY_THEME', payload: key as ThemeKey })}
            className={`relative flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200 group ${
              active
                ? 'bg-primary/10 ring-1 ring-primary'
                : 'bg-muted/50 ring-1 ring-border hover:ring-border/80 hover:bg-muted'
            }`}
            aria-label={`Apply ${theme.name} theme`}
          >
            {/* Mini wallpaper preview */}
            <div
              className="w-full aspect-[9/16] rounded-lg overflow-hidden flex items-center justify-center"
              style={{ backgroundColor: theme.bgColor }}
            >
              <div className="grid grid-cols-3 gap-[3px]">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[5px] h-[5px] rounded-full"
                    style={{
                      backgroundColor: i < 8 ? theme.filledColor : theme.emptyColor,
                    }}
                  />
                ))}
              </div>
            </div>

            <span className={`text-[10px] font-medium transition-colors ${
              active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
            }`}>
              {theme.name}
            </span>

            {active && (
              <motion.div
                layoutId="activeTheme"
                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
