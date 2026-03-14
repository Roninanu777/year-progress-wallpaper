'use client';

import DeviceFrame from './DeviceFrame';
import WallpaperCanvas from './WallpaperCanvas';
import { useWallpaper } from '@/lib/wallpaper-context';
import { DEVICE_PRESETS } from '@/lib/constants';

export default function Preview() {
  const { state } = useWallpaper();
  const deviceConfig = DEVICE_PRESETS[state.device];
  const aspectRatio = deviceConfig.height / deviceConfig.width;

  const previewWidth = 400;
  const previewHeight = Math.round(previewWidth * aspectRatio);

  const scaledRadius = Math.round(state.radius * (previewWidth / deviceConfig.width));
  const scaledSpacing = Math.round(state.spacing * (previewWidth / deviceConfig.width));

  return (
    <div className="flex flex-col items-center">
      <DeviceFrame aspectRatio={aspectRatio}>
        <WallpaperCanvas
          width={previewWidth}
          height={previewHeight}
          bgColor={state.bgColor}
          filledColor={state.filledColor}
          emptyColor={state.emptyColor}
          radius={scaledRadius}
          spacing={scaledSpacing}
          textColor={state.textColor}
          accentColor={state.accentColor}
          showCustomText={state.showCustomText}
          customText={state.customText}
          font={state.font}
          mode={state.mode}
          monthStyle={state.monthStyle}
        />
      </DeviceFrame>

      <p className="mt-4 text-sm text-muted-foreground">
        {deviceConfig.name} ({deviceConfig.width} x {deviceConfig.height})
      </p>
    </div>
  );
}
