'use client';

import { useWallpaper } from '@/lib/wallpaper-context';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ModeToggle() {
  const { state, dispatch } = useWallpaper();

  return (
    <Tabs
      value={state.mode}
      onValueChange={(value) => dispatch({ type: 'SET_MODE', payload: value as 'year' | 'month' })}
    >
      <TabsList>
        <TabsTrigger value="year">Year</TabsTrigger>
        <TabsTrigger value="month">Month</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
