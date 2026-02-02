'use client';

import { ReactNode } from 'react';

interface DeviceFrameProps {
  children: ReactNode;
  aspectRatio: number;
}

export default function DeviceFrame({ children, aspectRatio }: DeviceFrameProps) {
  return (
    <div className="relative">
      {/* iPhone frame */}
      <div
        className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl mx-auto"
        style={{
          width: '280px',
          maxWidth: '100%',
        }}
      >
        {/* Notch / Dynamic Island */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-10" />

        {/* Screen */}
        <div
          className="relative bg-black rounded-[2.5rem] overflow-hidden"
          style={{
            aspectRatio: `1 / ${aspectRatio}`,
          }}
        >
          {children}
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full" />
      </div>
    </div>
  );
}
