'use client';

import { useWallpaper } from '@/lib/wallpaper-context';
import { DEVICE_PRESETS } from '@/lib/constants';
import { generateApiUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ActionButtons() {
  const { state, apiUrl } = useWallpaper();
  const deviceConfig = DEVICE_PRESETS[state.device];

  const handleDownload = async () => {
    const url = generateApiUrl('', {
      width: deviceConfig.width,
      height: deviceConfig.height,
      bgColor: state.bgColor,
      filledColor: state.filledColor,
      emptyColor: state.emptyColor,
      radius: state.radius,
      spacing: state.spacing,
      textColor: state.textColor,
      accentColor: state.accentColor,
      showCustomText: state.showCustomText,
      customText: state.customText,
      font: state.font,
      monthStyle: state.monthStyle,
    }, state.mode);

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${state.mode}-progress-wallpaper-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      toast.success('Wallpaper downloaded!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed. Please try again.');
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(apiUrl);
    toast.success('URL copied to clipboard!');
  };

  return (
    <div className="space-y-3 pt-2">
      <Button
        onClick={handleDownload}
        className="w-full"
        size="lg"
      >
        Download Wallpaper
      </Button>
      <Button
        onClick={handleCopyUrl}
        variant="secondary"
        className="w-full"
        size="lg"
      >
        Copy API URL for iOS Shortcut
      </Button>
    </div>
  );
}
