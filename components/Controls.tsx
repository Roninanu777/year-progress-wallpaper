'use client';

import ColorPicker from './ColorPicker';
import { DEVICE_PRESETS, DevicePresetKey, PRESET_THEMES, ThemeKey, FONT_OPTIONS, FontKey } from '@/lib/constants';
import { generateApiUrl } from '@/lib/utils';

interface ControlsProps {
  device: DevicePresetKey;
  setDevice: (device: DevicePresetKey) => void;
  bgColor: string;
  setBgColor: (color: string) => void;
  filledColor: string;
  setFilledColor: (color: string) => void;
  emptyColor: string;
  setEmptyColor: (color: string) => void;
  radius: number;
  setRadius: (radius: number) => void;
  spacing: number;
  setSpacing: (spacing: number) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  showCustomText: boolean;
  setShowCustomText: (show: boolean) => void;
  customText: string;
  setCustomText: (text: string) => void;
  font: FontKey;
  setFont: (font: FontKey) => void;
  mode?: 'year' | 'month';
}

export default function Controls({
  device,
  setDevice,
  bgColor,
  setBgColor,
  filledColor,
  setFilledColor,
  emptyColor,
  setEmptyColor,
  radius,
  setRadius,
  spacing,
  setSpacing,
  textColor,
  setTextColor,
  showCustomText,
  setShowCustomText,
  customText,
  setCustomText,
  font,
  setFont,
  mode = 'year',
}: ControlsProps) {
  const deviceConfig = DEVICE_PRESETS[device];

  const handleDownload = async () => {
    const url = generateApiUrl('', {
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

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${mode}-progress-wallpaper-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleCopyUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const url = generateApiUrl(baseUrl, {
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

    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  const applyTheme = (themeKey: ThemeKey) => {
    const theme = PRESET_THEMES[themeKey];
    setBgColor(theme.bgColor);
    setFilledColor(theme.filledColor);
    setEmptyColor(theme.emptyColor);
    setTextColor(theme.textColor);
  };

  return (
    <div className="space-y-8">
      {/* Device Selection */}
      <section>
        <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400 mb-4">Device</h3>
        <select
          value={device}
          onChange={(e) => setDevice(e.target.value as DevicePresetKey)}
          className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200"
        >
          {Object.entries(DEVICE_PRESETS).map(([key, preset]) => (
            <option key={key} value={key}>
              {preset.name} ({preset.width} × {preset.height})
            </option>
          ))}
        </select>
      </section>

      {/* Theme Presets */}
      <section>
        <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400 mb-4">Theme Presets</h3>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(PRESET_THEMES).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => applyTheme(key as ThemeKey)}
              className="group flex flex-col items-center p-3 bg-zinc-800/80 rounded-xl border border-zinc-700 hover:bg-zinc-700/50 hover:border-zinc-600 transition-all duration-200"
            >
              <div className="flex gap-1 mb-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.bgColor, border: '1px solid #555' }}
                />
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.filledColor }}
                />
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.emptyColor }}
                />
              </div>
              <span className="text-xs text-zinc-300">{theme.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Colors */}
      <section>
        <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400 mb-4">Colors</h3>
        <div className="space-y-4">
          <ColorPicker label="Background" color={bgColor} onChange={setBgColor} />
          <ColorPicker label="Filled Circles (Days Passed)" color={filledColor} onChange={setFilledColor} />
          <ColorPicker label="Empty Circles (Days Remaining)" color={emptyColor} onChange={setEmptyColor} />
          <ColorPicker label="Text Color" color={textColor} onChange={setTextColor} />
        </div>
      </section>

      {/* Size Controls */}
      <section>
        <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400 mb-4">Size</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Circle Radius: {radius}px
            </label>
            <input
              type="range"
              min="4"
              max="24"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Spacing: {spacing}px
            </label>
            <input
              type="range"
              min="2"
              max="16"
              value={spacing}
              onChange={(e) => setSpacing(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Text Options */}
      <section>
        <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400 mb-4">Options</h3>
        <div className="space-y-4">
          {/* Font Selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Font
            </label>
            <select
              value={font}
              onChange={(e) => setFont(e.target.value as FontKey)}
              className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200"
            >
              {Object.entries(FONT_OPTIONS).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Text Toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showCustomText}
              onChange={(e) => setShowCustomText(e.target.checked)}
              className="w-5 h-5 rounded"
            />
            <span className="text-zinc-300">Add custom text</span>
          </label>

          {/* Custom Text Input */}
          {showCustomText && (
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Custom Text
              </label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Enter text to display below the grid"
                className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 placeholder-zinc-500 transition-all duration-200"
              />
            </div>
          )}
        </div>
      </section>

      {/* Action Buttons */}
      <section className="space-y-3 pt-4">
        <button
          onClick={handleDownload}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-emerald-900/30 transition-all duration-200"
        >
          Download Wallpaper
        </button>
        <button
          onClick={handleCopyUrl}
          className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-3 px-6 rounded-xl border border-zinc-600 transition-all duration-200"
        >
          Copy API URL for iOS Shortcut
        </button>
      </section>
    </div>
  );
}
