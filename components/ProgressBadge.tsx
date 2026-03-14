'use client';

import { useWallpaper } from '@/lib/wallpaper-context';
import { getDayOfYear, getDaysRemaining, getYearProgress, getDayOfMonth, getMonthDaysRemaining, getMonthProgress, getMonthName } from '@/lib/utils';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

export default function ProgressBadge() {
  const { state } = useWallpaper();

  const dayOfYear = getDayOfYear();
  const daysRemaining = getDaysRemaining();
  const yearProgress = getYearProgress();
  const dayOfMonth = getDayOfMonth();
  const monthDaysRemaining = getMonthDaysRemaining();
  const monthProgress = getMonthProgress();
  const monthName = getMonthName();

  const progress = state.mode === 'year' ? yearProgress : monthProgress;

  const springValue = useSpring(0, { stiffness: 100, damping: 30 });
  const displayValue = useTransform(springValue, (v) => v.toFixed(1));

  useEffect(() => {
    springValue.set(progress);
  }, [progress, springValue]);

  return (
    <div className="text-right">
      <div className="text-2xl sm:text-3xl font-bold text-foreground flex items-baseline justify-end gap-0.5">
        <motion.span>{displayValue}</motion.span>
        <span>%</span>
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground">
        {state.mode === 'year'
          ? `Day ${dayOfYear} · ${daysRemaining} remaining`
          : `Day ${dayOfMonth} of ${monthName} · ${monthDaysRemaining} remaining`}
      </div>
    </div>
  );
}
