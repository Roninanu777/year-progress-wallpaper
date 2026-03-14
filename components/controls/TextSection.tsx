'use client';

import { useWallpaper } from '@/lib/wallpaper-context';
import { FONT_OPTIONS, FontKey } from '@/lib/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { AnimatePresence, motion } from 'framer-motion';

export default function TextSection() {
  const { state, dispatch } = useWallpaper();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[13px] font-medium text-muted-foreground mb-2">Font</label>
        <Select
          value={state.font}
          onValueChange={(value) => dispatch({ type: 'SET_FONT', payload: value as FontKey })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(FONT_OPTIONS).map(([key, name]) => (
              <SelectItem key={key} value={key}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="custom-text-toggle" className="text-[13px] font-medium text-muted-foreground cursor-pointer">
          Custom text
        </label>
        <Switch
          id="custom-text-toggle"
          checked={state.showCustomText}
          onCheckedChange={(checked) => dispatch({ type: 'SET_SHOW_CUSTOM_TEXT', payload: checked })}
        />
      </div>

      <AnimatePresence>
        {state.showCustomText && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Input
              type="text"
              value={state.customText}
              onChange={(e) => dispatch({ type: 'SET_CUSTOM_TEXT', payload: e.target.value })}
              placeholder="Text below the grid"
              className="text-[13px]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
