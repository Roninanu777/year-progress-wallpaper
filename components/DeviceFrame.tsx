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
  // SVG screen is at x=12, y=12, width=296, height=630 within 320x654
  const screenPaddingX = (12 / 320) * frameWidth;
  const screenPaddingTop = (12 / 654) * frameHeight;
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
        {/* Screen content - positioned behind the frame */}
        <div
          className="absolute overflow-hidden"
          style={{
            left: screenPaddingX,
            top: screenPaddingTop,
            width: screenWidth,
            height: screenHeight,
            borderRadius: '38px',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              aspectRatio: `1 / ${aspectRatio}`,
            }}
          >
            {children}
          </div>
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
