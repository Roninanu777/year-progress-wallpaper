'use client';

import { useWallpaper } from '@/lib/wallpaper-context';
import ColorPicker from '@/components/ColorPicker';

export default function ColorSection() {
  const { state, dispatch } = useWallpaper();

  const setColor = (field: 'bgColor' | 'filledColor' | 'emptyColor' | 'textColor' | 'accentColor') =>
    (color: string) => dispatch({ type: 'SET_COLOR', field, payload: color });

  return (
    <div className="space-y-4">
      <ColorPicker label="Background" color={state.bgColor} onChange={setColor('bgColor')} />
      <ColorPicker label="Filled Circles (Days Passed)" color={state.filledColor} onChange={setColor('filledColor')} />
      <ColorPicker label="Empty Circles (Days Remaining)" color={state.emptyColor} onChange={setColor('emptyColor')} />
      <ColorPicker label="Text Color" color={state.textColor} onChange={setColor('textColor')} />
      <ColorPicker label="Accent Color (Days Left)" color={state.accentColor} onChange={setColor('accentColor')} />
    </div>
  );
}
