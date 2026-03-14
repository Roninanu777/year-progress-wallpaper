'use client';

import { useWallpaper } from '@/lib/wallpaper-context';
import { motion } from 'framer-motion';

export default function ModeToggle() {
  const { state, dispatch } = useWallpaper();

  return (
    <div className="relative flex items-center rounded-full bg-muted p-0.5">
      <motion.div
        className="absolute h-[calc(100%-4px)] rounded-full bg-background shadow-sm"
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        style={{
          width: 'calc(50% - 2px)',
          left: state.mode === 'year' ? '2px' : 'calc(50%)',
        }}
      />
      <button
        onClick={() => dispatch({ type: 'SET_MODE', payload: 'year' })}
        className={`relative z-10 px-4 py-1.5 text-[13px] font-medium rounded-full transition-colors duration-200 ${
          state.mode === 'year' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/70'
        }`}
      >
        Year
      </button>
      <button
        onClick={() => dispatch({ type: 'SET_MODE', payload: 'month' })}
        className={`relative z-10 px-4 py-1.5 text-[13px] font-medium rounded-full transition-colors duration-200 ${
          state.mode === 'month' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/70'
        }`}
      >
        Month
      </button>
    </div>
  );
}
