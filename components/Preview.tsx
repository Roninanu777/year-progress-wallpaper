'use client';

import DeviceFrame from './DeviceFrame';
import WallpaperCanvas from './WallpaperCanvas';
import { useWallpaper } from '@/lib/wallpaper-context';
import { DEVICE_PRESETS } from '@/lib/constants';
import { motion } from 'framer-motion';

export default function Preview() {
  const { state } = useWallpaper();
  const deviceConfig = DEVICE_PRESETS[state.device];
  const aspectRatio = deviceConfig.height / deviceConfig.width;

  const previewWidth = 400;
  const previewHeight = Math.round(previewWidth * aspectRatio);

  const scaledRadius = Math.round(state.radius * (previewWidth / deviceConfig.width));
  const scaledSpacing = Math.round(state.spacing * (previewWidth / deviceConfig.width));

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        {/* Ambient glow behind device */}
        <div
          className="absolute inset-0 -inset-x-12 -inset-y-8 rounded-[60px] blur-[80px] opacity-[0.12] transition-opacity duration-700 group-hover:opacity-[0.18]"
          style={{ backgroundColor: state.filledColor }}
        />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
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
        </motion.div>
      </div>

      <p className="text-[11px] text-muted-foreground/60 font-mono tracking-wide">
        {deviceConfig.name} — {deviceConfig.width} x {deviceConfig.height}
      </p>
    </div>
  );
}
