'use client';

import { WallpaperProvider, useWallpaper } from '@/lib/wallpaper-context';
import Preview from '@/components/Preview';
import Controls from '@/components/Controls';
import ShortcutInstructions from '@/components/ShortcutInstructions';
import ModeToggle from '@/components/ModeToggle';
import ProgressBadge from '@/components/ProgressBadge';
import MobileControlsSheet from '@/components/MobileControlsSheet';
import ThemeToggle from '@/components/ThemeToggle';
import ActionButtons from '@/components/controls/ActionButtons';

function PageContent() {
  const { apiUrl } = useWallpaper();

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] rounded-full bg-primary/[0.02] blur-[100px]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Preview Column */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 sm:px-8 pt-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_oklch(0.696_0.17_162.48/40%)] animate-pulse" />
              <span className="text-[13px] font-display font-semibold text-muted-foreground tracking-wide hidden sm:block">
                Live Calendar
              </span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <ThemeToggle />
              <ModeToggle />
              <ProgressBadge />
            </div>
          </div>

          {/* Preview Area — centered hero */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-8 pb-8">
            <Preview />
          </div>
        </div>

        {/* Controls Sidebar — Desktop */}
        <aside className="hidden lg:flex w-[380px] shrink-0 flex-col border-l border-border bg-card/60 backdrop-blur-2xl">
          {/* Sidebar header */}
          <div className="px-5 pt-6 pb-4 border-b border-border">
            <h2 className="text-[15px] font-display font-semibold text-foreground tracking-tight">Customize</h2>
            <p className="text-[12px] text-muted-foreground mt-1">Configure your wallpaper</p>
          </div>

          {/* Scrollable controls */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
            <Controls />
            <ShortcutInstructions apiUrl={apiUrl} />
          </div>

          {/* Sticky action buttons */}
          <div className="px-5 py-4 border-t border-border bg-card/80 backdrop-blur-xl">
            <ActionButtons />
          </div>
        </aside>
      </div>

      {/* Mobile Controls Sheet */}
      <div className="lg:hidden">
        <MobileControlsSheet />
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <WallpaperProvider>
      <PageContent />
    </WallpaperProvider>
  );
}
