'use client';

import DeviceFrame from './DeviceFrame';
import WallpaperCanvas from './WallpaperCanvas';
import { DEVICE_PRESETS, DevicePresetKey } from '@/lib/constants';

interface PreviewProps {
  device: DevicePresetKey;
  bgColor: string;
  filledColor: string;
  emptyColor: string;
  radius: number;
  spacing: number;
  textColor: string;
  showCustomText: boolean;
  customText: string;
  font: string;
  mode?: 'year' | 'month';
}

export default function Preview({
  device,
  bgColor,
  filledColor,
  emptyColor,
  radius,
  spacing,
  textColor,
  showCustomText,
  customText,
  font,
  mode = 'year',
}: PreviewProps) {
  const deviceConfig = DEVICE_PRESETS[device];
  const aspectRatio = deviceConfig.height / deviceConfig.width;

  // Use smaller dimensions for preview to improve performance
  const previewWidth = 400;
  const previewHeight = Math.round(previewWidth * aspectRatio);

  // Scale radius and spacing proportionally
  const scaledRadius = Math.round(radius * (previewWidth / deviceConfig.width));
  const scaledSpacing = Math.round(spacing * (previewWidth / deviceConfig.width));

  return (
    <div className="flex flex-col items-center">
      <DeviceFrame aspectRatio={aspectRatio}>
        <WallpaperCanvas
          width={previewWidth}
          height={previewHeight}
          bgColor={bgColor}
          filledColor={filledColor}
          emptyColor={emptyColor}
          radius={scaledRadius}
          spacing={scaledSpacing}
          textColor={textColor}
          showCustomText={showCustomText}
          customText={customText}
          font={font}
          mode={mode}
        />
      </DeviceFrame>

      <p className="mt-4 text-sm text-zinc-400">
        {deviceConfig.name} ({deviceConfig.width} × {deviceConfig.height})
      </p>
    </div>
  );
}
