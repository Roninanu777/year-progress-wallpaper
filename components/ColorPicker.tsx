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
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <Popover>
          <PopoverTrigger
            className="w-10 h-10 rounded-lg border-2 border-border cursor-pointer transition-transform hover:scale-105 hover:border-muted-foreground"
            style={{ backgroundColor: color }}
            aria-label={`Select ${label.toLowerCase()}`}
          />
          <PopoverContent className="w-auto p-3" align="start">
            <HexColorPicker color={color} onChange={onChange} />
          </PopoverContent>
        </Popover>
        <div className="flex items-center bg-secondary rounded-lg px-3 py-2">
          <span className="text-muted-foreground mr-1">#</span>
          <HexColorInput
            color={color}
            onChange={onChange}
            className="w-20 bg-transparent text-foreground uppercase font-mono text-sm focus:outline-none"
            prefixed={false}
          />
        </div>
      </div>
    </div>
  );
}
