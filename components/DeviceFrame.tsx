'use client';

import { ReactNode } from 'react';
import Image from 'next/image';

interface DeviceFrameProps {
  children: ReactNode;
  aspectRatio: number;
}

export default function DeviceFrame({ children, aspectRatio }: DeviceFrameProps) {
  // Frame dimensions match the SVG viewBox ratio (320x654)
  const frameWidth = 280;
  const frameHeight = Math.round(frameWidth * (654 / 320));

  // Screen area within the frame (accounting for bezels)
  // SVG screen cutout is at x=12, y=12, width=296, height=630 within 320x654
  const screenLeft = (12 / 320) * frameWidth;
  const screenTop = (12 / 654) * frameHeight;
  const screenWidth = (296 / 320) * frameWidth;
  const screenHeight = (630 / 654) * frameHeight;

  return (
    <div className="relative flex justify-center">
      {/* Container for proper sizing */}
      <div
        className="relative"
        style={{
          width: frameWidth,
          height: frameHeight,
        }}
      >
        {/* Screen content - positioned to match the frame cutout */}
        <div
          className="absolute overflow-hidden bg-black"
          style={{
            left: screenLeft,
            top: screenTop,
            width: screenWidth,
            height: screenHeight,
            aspectRatio: `1 / ${aspectRatio}`,
            borderRadius: '38px',
          }}
        >
          {children}
        </div>

        {/* iPhone frame overlay */}
        <Image
          src="/devices/iphone-frame.svg"
          alt="iPhone frame"
          width={frameWidth}
          height={frameHeight}
          className="pointer-events-none relative z-10"
          priority
        />
      </div>
    </div>
  );
}
