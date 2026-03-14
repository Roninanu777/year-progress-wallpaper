'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Controls from './Controls';
import ShortcutInstructions from './ShortcutInstructions';
import { useWallpaper } from '@/lib/wallpaper-context';

export default function MobileControlsSheet() {
  const [open, setOpen] = useState(false);
  const { apiUrl } = useWallpaper();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="fixed bottom-6 right-6 z-30 rounded-full shadow-lg px-6 h-10 bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/80 transition-colors"
      >
        Customize
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Customize Your Wallpaper</SheetTitle>
        </SheetHeader>
        <div className="py-4 px-4 space-y-6">
          <Controls />
          <ShortcutInstructions apiUrl={apiUrl} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
