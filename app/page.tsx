'use client';

import { WallpaperProvider, useWallpaper } from '@/lib/wallpaper-context';
import Preview from '@/components/Preview';
import Controls from '@/components/Controls';
import ShortcutInstructions from '@/components/ShortcutInstructions';
import ModeToggle from '@/components/ModeToggle';
import ProgressBadge from '@/components/ProgressBadge';
import MobileControlsSheet from '@/components/MobileControlsSheet';

function PageContent() {
  const { state, apiUrl } = useWallpaper();

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                {state.mode === 'year' ? 'Year Progress Wallpaper' : 'Month Progress Wallpaper'}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 hidden sm:block">
                {state.mode === 'year'
                  ? 'Visualize your year with a customizable circle grid'
                  : 'Visualize your month with a customizable calendar grid'}
              </p>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <ModeToggle />
              <ProgressBadge />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr,420px] gap-8 lg:gap-12">
          {/* Preview Column */}
          <div>
            <div className="sticky top-24">
              <h2 className="text-lg font-semibold text-foreground mb-6 text-center lg:text-left">
                Live Preview
              </h2>
              <Preview />
            </div>
          </div>

          {/* Controls Column - Desktop */}
          <aside className="hidden lg:block">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Customize Your Wallpaper
            </h2>
            <Controls />
            <div className="mt-8">
              <ShortcutInstructions apiUrl={apiUrl} />
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Controls Sheet */}
      <div className="lg:hidden">
        <MobileControlsSheet />
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Generate beautiful year-progress wallpapers for your iPhone.
              <br className="sm:hidden" />
              <span className="hidden sm:inline"> · </span>
              Updates automatically when used with iOS Shortcuts.
            </p>
          </div>
        </div>
      </footer>
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
