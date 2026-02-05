'use client';

import { useState, useMemo } from 'react';
import Preview from '@/components/Preview';
import Controls from '@/components/Controls';
import ShortcutInstructions from '@/components/ShortcutInstructions';
import { DEFAULT_SETTINGS, DEVICE_PRESETS, DevicePresetKey, FontKey } from '@/lib/constants';
import { generateApiUrl, getDayOfYear, getDaysRemaining, getYearProgress, getDayOfMonth, getMonthDaysRemaining, getMonthProgress, getMonthName } from '@/lib/utils';

export default function Home() {
  const [device, setDevice] = useState<DevicePresetKey>(DEFAULT_SETTINGS.device);
  const [bgColor, setBgColor] = useState(DEFAULT_SETTINGS.bgColor);
  const [filledColor, setFilledColor] = useState(DEFAULT_SETTINGS.filledColor);
  const [emptyColor, setEmptyColor] = useState(DEFAULT_SETTINGS.emptyColor);
  const [radius, setRadius] = useState(DEFAULT_SETTINGS.radius);
  const [spacing, setSpacing] = useState(DEFAULT_SETTINGS.spacing);
  const [textColor, setTextColor] = useState(DEFAULT_SETTINGS.textColor);
  const [showCustomText, setShowCustomText] = useState(DEFAULT_SETTINGS.showCustomText);
  const [customText, setCustomText] = useState(DEFAULT_SETTINGS.customText);
  const [font, setFont] = useState<FontKey>(DEFAULT_SETTINGS.font);
  const [mode, setMode] = useState<'year' | 'month'>('year');

  const deviceConfig = DEVICE_PRESETS[device];

  const apiUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return generateApiUrl(window.location.origin, {
      width: deviceConfig.width,
      height: deviceConfig.height,
      bgColor,
      filledColor,
      emptyColor,
      radius,
      spacing,
      textColor,
      showCustomText,
      customText,
      font,
    }, mode);
  }, [device, bgColor, filledColor, emptyColor, radius, spacing, textColor, showCustomText, customText, font, deviceConfig, mode]);

  const dayOfYear = getDayOfYear();
  const daysRemaining = getDaysRemaining();
  const yearProgress = getYearProgress();
  const dayOfMonth = getDayOfMonth();
  const monthDaysRemaining = getMonthDaysRemaining();
  const monthProgress = getMonthProgress();
  const monthName = getMonthName();

  const progress = mode === 'year' ? yearProgress : monthProgress;

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-zinc-700/50 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                {mode === 'year' ? 'Year Progress Wallpaper' : 'Month Progress Wallpaper'}
              </h1>
              <p className="text-sm text-zinc-400 mt-1 hidden sm:block">
                {mode === 'year'
                  ? 'Visualize your year with a customizable circle grid'
                  : 'Visualize your month with a customizable calendar grid'}
              </p>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Mode Toggle */}
              <div className="flex bg-zinc-800 rounded-lg p-1">
                <button
                  onClick={() => setMode('year')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    mode === 'year'
                      ? 'bg-emerald-500 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Year
                </button>
                <button
                  onClick={() => setMode('month')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    mode === 'month'
                      ? 'bg-emerald-500 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Month
                </button>
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  {progress.toFixed(1)}%
                </div>
                <div className="text-xs sm:text-sm text-zinc-400">
                  {mode === 'year'
                    ? `Day ${dayOfYear} • ${daysRemaining} remaining`
                    : `Day ${dayOfMonth} of ${monthName} • ${monthDaysRemaining} remaining`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Preview Column */}
          <div className="order-1 lg:order-1">
            <div className="sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-6 text-center lg:text-left">
                Live Preview
              </h2>
              <Preview
                device={device}
                bgColor={bgColor}
                filledColor={filledColor}
                emptyColor={emptyColor}
                radius={radius}
                spacing={spacing}
                textColor={textColor}
                showCustomText={showCustomText}
                customText={customText}
                font={font}
                mode={mode}
              />
            </div>
          </div>

          {/* Controls Column */}
          <div className="order-2 lg:order-2">
            <h2 className="text-lg font-semibold text-white mb-6">
              Customize Your Wallpaper
            </h2>
            <Controls
              device={device}
              setDevice={setDevice}
              bgColor={bgColor}
              setBgColor={setBgColor}
              filledColor={filledColor}
              setFilledColor={setFilledColor}
              emptyColor={emptyColor}
              setEmptyColor={setEmptyColor}
              radius={radius}
              setRadius={setRadius}
              spacing={spacing}
              setSpacing={setSpacing}
              textColor={textColor}
              setTextColor={setTextColor}
              showCustomText={showCustomText}
              setShowCustomText={setShowCustomText}
              customText={customText}
              setCustomText={setCustomText}
              font={font}
              setFont={setFont}
              mode={mode}
            />

            {/* iOS Shortcut Instructions */}
            <div className="mt-8">
              <ShortcutInstructions apiUrl={apiUrl} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-700/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-zinc-500">
            <p>
              Generate beautiful year-progress wallpapers for your iPhone.
              <br className="sm:hidden" />
              <span className="hidden sm:inline"> • </span>
              Updates automatically when used with iOS Shortcuts.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
