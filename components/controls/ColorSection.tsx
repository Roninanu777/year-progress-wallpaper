'use client';

import { useWallpaper } from '@/lib/wallpaper-context';
import ColorPicker from '@/components/ColorPicker';

export default function ColorSection() {
  const { state, dispatch } = useWallpaper();

  const setColor = (field: 'bgColor' | 'filledColor' | 'emptyColor' | 'textColor' | 'accentColor') =>
    (color: string) => dispatch({ type: 'SET_COLOR', field, payload: color });

  return (
    <div className="flex items-start justify-between">
      <ColorPicker label="BG" color={state.bgColor} onChange={setColor('bgColor')} />
      <ColorPicker label="Fill" color={state.filledColor} onChange={setColor('filledColor')} />
      <ColorPicker label="Empty" color={state.emptyColor} onChange={setColor('emptyColor')} />
      <ColorPicker label="Text" color={state.textColor} onChange={setColor('textColor')} />
      <ColorPicker label="Accent" color={state.accentColor} onChange={setColor('accentColor')} />
    </div>
  );
}
