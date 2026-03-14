'use client';

import { useWallpaper } from '@/lib/wallpaper-context';
import { DEVICE_PRESETS } from '@/lib/constants';
import { generateApiUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Download, Link } from 'lucide-react';

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
    <div className="space-y-2.5">
      <Button
        onClick={handleDownload}
        className="w-full h-11 rounded-xl text-[13px] font-semibold shadow-[0_4px_20px_oklch(0.696_0.17_162.48/30%),0_1px_3px_oklch(0_0_0/0.1)] hover:shadow-[0_4px_30px_oklch(0.696_0.17_162.48/45%),0_2px_6px_oklch(0_0_0/0.12)] dark:shadow-[0_0_20px_oklch(0.696_0.17_162.48/20%)] dark:hover:shadow-[0_0_30px_oklch(0.696_0.17_162.48/30%)] active:scale-[0.98] transition-all duration-200"
        size="lg"
      >
        <Download className="w-4 h-4 mr-2" />
        Download Wallpaper
      </Button>
      <Button
        onClick={handleCopyUrl}
        variant="outline"
        className="w-full h-10 rounded-xl text-[13px] font-medium border-border/80 dark:border-border hover:bg-muted hover:border-primary/30 hover:text-primary transition-all duration-200"
        size="lg"
      >
        <Link className="w-4 h-4 mr-2" />
        Copy Shortcut URL
      </Button>
    </div>
  );
}
