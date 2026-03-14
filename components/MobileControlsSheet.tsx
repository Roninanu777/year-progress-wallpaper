'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Controls from './Controls';
import ShortcutInstructions from './ShortcutInstructions';
import ActionButtons from './controls/ActionButtons';
import { useWallpaper } from '@/lib/wallpaper-context';
import { SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileControlsSheet() {
  const [open, setOpen] = useState(false);
  const { apiUrl } = useWallpaper();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30"
      >
        <SheetTrigger
          className="rounded-full px-6 py-3 flex items-center gap-2
            bg-primary text-primary-foreground font-semibold text-[13px]
            shadow-[0_4px_24px_oklch(0.696_0.17_162.48/30%)]
            hover:shadow-[0_4px_32px_oklch(0.696_0.17_162.48/40%)]
            active:scale-[0.96] transition-all duration-200"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Customize
        </SheetTrigger>
      </motion.div>

      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto bg-white/95 dark:bg-card/95 backdrop-blur-xl rounded-t-2xl shadow-[0_-4px_40px_oklch(0_0_0/0.08)] dark:shadow-[0_-4px_40px_oklch(0_0_0/0.3)]">
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mt-2 mb-4" />
        <SheetHeader className="px-4">
          <SheetTitle className="text-[15px] font-display font-semibold">Customize</SheetTitle>
        </SheetHeader>
        <div className="py-4 px-4 space-y-6">
          <Controls />
          <ActionButtons />
          <ShortcutInstructions apiUrl={apiUrl} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
