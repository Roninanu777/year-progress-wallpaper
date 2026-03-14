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
      <div className="flex items-baseline justify-end gap-0.5">
        <motion.span className="text-xl sm:text-2xl font-display font-semibold tracking-tight text-foreground tabular-nums">
          {displayValue}
        </motion.span>
        <span className="text-sm font-semibold text-primary">%</span>
      </div>
      <div className="text-[11px] text-muted-foreground mt-0.5">
        {state.mode === 'year'
          ? `Day ${dayOfYear} · ${daysRemaining} left`
          : `${monthName} · Day ${dayOfMonth}`}
      </div>
    </div>
  );
}
