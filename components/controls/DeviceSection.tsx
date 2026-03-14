'use client';

import { useWallpaper } from '@/lib/wallpaper-context';
import { DEVICE_PRESETS, DevicePresetKey, MONTH_STYLES, MonthStyleKey } from '@/lib/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DeviceSection() {
  const { state, dispatch } = useWallpaper();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[13px] font-medium text-muted-foreground mb-2">Device</label>
        <Select
          value={state.device}
          onValueChange={(value) => dispatch({ type: 'SET_DEVICE', payload: value as DevicePresetKey })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DEVICE_PRESETS).map(([key, preset]) => (
              <SelectItem key={key} value={key}>
                {preset.name} ({preset.width} x {preset.height})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {state.mode === 'month' && (
        <div>
          <label className="block text-[13px] font-medium text-muted-foreground mb-2">Calendar Style</label>
          <Select
            value={state.monthStyle}
            onValueChange={(value) => dispatch({ type: 'SET_MONTH_STYLE', payload: value as MonthStyleKey })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(MONTH_STYLES).map(([key, name]) => (
                <SelectItem key={key} value={key}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
