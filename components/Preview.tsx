'use client';

import { useState, useEffect } from 'react';
import DeviceFrame from './DeviceFrame';
import { generateApiUrl } from '@/lib/utils';
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
}: PreviewProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const deviceConfig = DEVICE_PRESETS[device];
  const aspectRatio = deviceConfig.height / deviceConfig.width;

  useEffect(() => {
    const timer = setTimeout(() => {
      // Use smaller dimensions for preview to improve performance
      const previewWidth = 400;
      const previewHeight = Math.round(previewWidth * aspectRatio);

      const url = generateApiUrl('', {
        width: previewWidth,
        height: previewHeight,
        bgColor,
        filledColor,
        emptyColor,
        radius: Math.round(radius * (previewWidth / deviceConfig.width)),
        spacing: Math.round(spacing * (previewWidth / deviceConfig.width)),
        textColor,
        showCustomText,
        customText,
        font,
      });

      setImageUrl(url);
      setIsLoading(true);
      setError(null);
    }, 300); // Debounce

    return () => clearTimeout(timer);
  }, [device, bgColor, filledColor, emptyColor, radius, spacing, textColor, showCustomText, customText, font, aspectRatio, deviceConfig.width]);

  return (
    <div className="flex flex-col items-center">
      <DeviceFrame aspectRatio={aspectRatio}>
        <div className="relative w-full h-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-red-400 text-sm p-4 text-center">
              {error}
            </div>
          )}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Wallpaper preview"
              className="w-full h-full object-cover"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setError('Failed to generate preview');
              }}
              style={{ opacity: isLoading ? 0 : 1 }}
            />
          )}
        </div>
      </DeviceFrame>

      <p className="mt-4 text-sm text-gray-400">
        {deviceConfig.name} ({deviceConfig.width} × {deviceConfig.height})
      </p>
    </div>
  );
}
