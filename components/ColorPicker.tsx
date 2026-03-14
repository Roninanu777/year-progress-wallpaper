'use client';

import { HexColorPicker, HexColorInput } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ label, color, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <Popover>
        <PopoverTrigger
          className="w-8 h-8 rounded-xl border-2 border-black/10 dark:border-white/15 ring-1 ring-black/[0.04] dark:ring-white/[0.06] cursor-pointer transition-all duration-200 hover:scale-110 hover:border-black/25 dark:hover:border-white/30 hover:shadow-md"
          style={{ backgroundColor: color }}
          aria-label={`Change ${label} color`}
        />
        <PopoverContent className="w-auto p-3" align="center" sideOffset={8}>
          <HexColorPicker color={color} onChange={onChange} />
          <div className="flex items-center gap-2 mt-3 bg-muted rounded-lg px-3 py-1.5">
            <span className="text-muted-foreground text-xs">#</span>
            <HexColorInput
              color={color}
              onChange={onChange}
              className="w-full bg-transparent text-foreground uppercase font-mono text-xs focus:outline-none"
              prefixed={false}
            />
          </div>
        </PopoverContent>
      </Popover>
      <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
    </div>
  );
}
