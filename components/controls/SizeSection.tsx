'use client';

import { useWallpaper } from '@/lib/wallpaper-context';
import { Slider } from '@/components/ui/slider';

export default function SizeSection() {
  const { state, dispatch } = useWallpaper();

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-[13px] font-medium text-muted-foreground">Radius</label>
          <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
            {state.radius}px
          </span>
        </div>
        <Slider
          value={[state.radius]}
          min={4}
          max={24}
          step={1}
          onValueChange={(value) => {
            const v = Array.isArray(value) ? value[0] : value;
            dispatch({ type: 'SET_RADIUS', payload: v });
          }}
          aria-label="Circle radius"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-[13px] font-medium text-muted-foreground">Spacing</label>
          <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
            {state.spacing}px
          </span>
        </div>
        <Slider
          value={[state.spacing]}
          min={2}
          max={16}
          step={1}
          onValueChange={(value) => {
            const v = Array.isArray(value) ? value[0] : value;
            dispatch({ type: 'SET_SPACING', payload: v });
          }}
          aria-label="Spacing"
        />
      </div>
    </div>
  );
}
