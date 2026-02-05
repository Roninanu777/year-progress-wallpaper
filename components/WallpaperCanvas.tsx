'use client';

import { useRef, useEffect } from 'react';
import { getDayOfYear, getDaysInYear, getDayOfMonth, getDaysInMonth, getFirstDayOfMonth } from '@/lib/utils';

interface WallpaperCanvasProps {
  width: number;
  height: number;
  bgColor: string;
  filledColor: string;
  emptyColor: string;
  radius: number;
  spacing: number;
  textColor: string;
  showCustomText: boolean;
  customText: string;
  font: string;
  highlightColor?: string;
  mode?: 'year' | 'month';
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function WallpaperCanvas({
  width,
  height,
  bgColor,
  filledColor,
  emptyColor,
  radius,
  spacing,
  textColor,
  showCustomText,
  customText,
  font,
  highlightColor = '#FFD700',
  mode = 'year',
}: WallpaperCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate date in IST (UTC+5:30)
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(now.getTime() + istOffset + now.getTimezoneOffset() * 60 * 1000);

    // Clear and fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    if (mode === 'month') {
      drawMonthView(ctx, istDate);
    } else {
      drawYearView(ctx, istDate);
    }

    function drawYearView(ctx: CanvasRenderingContext2D, istDate: Date) {
      const year = istDate.getFullYear();
      const totalDays = getDaysInYear(year);
      const dayOfYear = getDayOfYear(istDate);

      // Calculate grid layout
      const diameter = radius * 2;
      const cellSize = diameter + spacing;

      // Use 85% of width for the grid
      const availableWidth = width * 0.85;
      const columns = Math.floor(availableWidth / cellSize);
      const rows = Math.ceil(totalDays / columns);

      // Calculate offsets to center the grid
      const gridWidth = columns * cellSize - spacing;
      const gridHeight = rows * cellSize - spacing;

      // Font sizes
      const subtitleFontSize = Math.max(28, Math.floor(width / 32));
      const customTextFontSize = Math.max(42, Math.floor(width / 20));

      // Calculate total content height (grid + subtitle below)
      const gridToSubtitleGap = 25;
      const subtitleBlockHeight = gridToSubtitleGap + subtitleFontSize;
      const totalContentHeight = gridHeight + subtitleBlockHeight;

      // Center everything vertically, but push down a bit to avoid clock (add 5% offset)
      const verticalOffset = height * 0.05;
      const contentStartY = (height - totalContentHeight) / 2 + verticalOffset;

      // Layout positioning
      const offsetX = (width - gridWidth) / 2;
      const gridStartY = contentStartY;
      const subtitleY = gridStartY + gridHeight + gridToSubtitleGap;

      // Draw subtitle (below grid)
      const daysLeft = totalDays - dayOfYear;
      const percentComplete = ((dayOfYear / totalDays) * 100).toFixed(1);
      ctx.font = `400 ${subtitleFontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.textBaseline = 'top';

      // Measure text widths for positioning
      const daysLeftText = `${daysLeft}d left`;
      const separatorText = '  •  ';
      const percentText = `${percentComplete}%`;
      const daysLeftWidth = ctx.measureText(daysLeftText).width;
      const separatorWidth = ctx.measureText(separatorText).width;
      const percentWidth = ctx.measureText(percentText).width;
      const totalWidth = daysLeftWidth + separatorWidth + percentWidth;
      const startX = (width - totalWidth) / 2;

      // Draw "329d left" in orange
      ctx.fillStyle = '#FFA500';
      ctx.textAlign = 'left';
      ctx.fillText(daysLeftText, startX, subtitleY);

      // Draw " · " and percentage in white
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(separatorText, startX + daysLeftWidth, subtitleY);
      ctx.fillText(percentText, startX + daysLeftWidth + separatorWidth, subtitleY);

      // Draw circles
      for (let i = 0; i < totalDays; i++) {
        const col = i % columns;
        const row = Math.floor(i / columns);
        const x = offsetX + col * cellSize + radius;
        const y = gridStartY + row * cellSize + radius;
        const dayNumber = i + 1;
        const isPassed = dayNumber < dayOfYear;
        const isCurrentDay = dayNumber === dayOfYear;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);

        if (isPassed) {
          ctx.fillStyle = filledColor;
          ctx.fill();
        } else if (isCurrentDay) {
          ctx.fillStyle = highlightColor;
          ctx.fill();
        } else {
          ctx.strokeStyle = emptyColor;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // Draw custom text
      if (showCustomText && customText) {
        ctx.fillStyle = textColor;
        ctx.font = `italic 400 ${customTextFontSize}px ${font}, serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(customText, width / 2, height - height * 0.08);
      }
    }

    function drawMonthView(ctx: CanvasRenderingContext2D, istDate: Date) {
      const totalDays = getDaysInMonth(istDate);
      const dayOfMonth = getDayOfMonth(istDate);
      const firstDayOffset = getFirstDayOfMonth(istDate);

      // Calendar grid layout
      const columns = 7;
      const rows = Math.ceil((totalDays + firstDayOffset) / columns);

      // Calculate cell size based on available width
      const availableWidth = width * 0.85;
      const cellSize = Math.floor(availableWidth / columns);
      const gridWidth = columns * cellSize;
      const gridHeight = rows * cellSize;

      // Font sizes
      const dayNameFontSize = Math.max(24, Math.floor(width / 40));
      const dateFontSize = Math.max(32, Math.floor(width / 28));
      const subtitleFontSize = Math.max(28, Math.floor(width / 32));
      const customTextFontSize = Math.max(42, Math.floor(width / 20));

      // Calculate total content height
      const headerHeight = dayNameFontSize + 20;
      const gridToSubtitleGap = 25;
      const subtitleBlockHeight = gridToSubtitleGap + subtitleFontSize;
      const totalContentHeight = headerHeight + gridHeight + subtitleBlockHeight;

      // Center everything vertically, push down to avoid clock
      const verticalOffset = height * 0.05;
      const contentStartY = (height - totalContentHeight) / 2 + verticalOffset;

      const offsetX = (width - gridWidth) / 2;
      const headerY = contentStartY;
      const gridStartY = headerY + headerHeight;
      const subtitleY = gridStartY + gridHeight + gridToSubtitleGap;

      // Draw day name headers
      ctx.font = `500 ${dayNameFontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = emptyColor;

      for (let i = 0; i < DAY_NAMES.length; i++) {
        const x = offsetX + i * cellSize + cellSize / 2;
        const y = headerY + headerHeight / 2;
        ctx.fillText(DAY_NAMES[i], x, y);
      }

      // Draw calendar cells
      for (let i = 0; i < rows * columns; i++) {
        const col = i % columns;
        const row = Math.floor(i / columns);
        const dayNumber = i - firstDayOffset + 1;
        const isValidDay = dayNumber >= 1 && dayNumber <= totalDays;

        if (!isValidDay) continue;

        const isPassed = dayNumber < dayOfMonth;
        const isCurrentDay = dayNumber === dayOfMonth;

        const x = offsetX + col * cellSize + cellSize / 2;
        const y = gridStartY + row * cellSize + cellSize / 2;
        const circleRadius = cellSize * 0.375;

        // Draw highlight circle for current day
        if (isCurrentDay) {
          ctx.beginPath();
          ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
          ctx.fillStyle = highlightColor;
          ctx.fill();
        }

        // Draw date number
        ctx.font = `${isCurrentDay ? '600' : '400'} ${dateFontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (isPassed) {
          ctx.fillStyle = filledColor;
        } else if (isCurrentDay) {
          ctx.fillStyle = bgColor;
        } else {
          ctx.fillStyle = emptyColor;
        }

        ctx.fillText(String(dayNumber), x, y);
      }

      // Draw subtitle (below grid)
      const daysLeft = totalDays - dayOfMonth;
      const percentComplete = ((dayOfMonth / totalDays) * 100).toFixed(1);
      ctx.font = `400 ${subtitleFontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.textBaseline = 'top';

      // Measure text widths for positioning
      const daysLeftText = `${daysLeft}d left`;
      const separatorText = '  •  ';
      const percentText = `${percentComplete}%`;
      const daysLeftWidth = ctx.measureText(daysLeftText).width;
      const separatorWidth = ctx.measureText(separatorText).width;
      const percentWidth = ctx.measureText(percentText).width;
      const totalWidth = daysLeftWidth + separatorWidth + percentWidth;
      const startX = (width - totalWidth) / 2;

      // Draw "Xd left" in orange
      ctx.fillStyle = '#FFA500';
      ctx.textAlign = 'left';
      ctx.fillText(daysLeftText, startX, subtitleY);

      // Draw " · " and percentage in white
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(separatorText, startX + daysLeftWidth, subtitleY);
      ctx.fillText(percentText, startX + daysLeftWidth + separatorWidth, subtitleY);

      // Draw custom text
      if (showCustomText && customText) {
        ctx.fillStyle = textColor;
        ctx.font = `italic 400 ${customTextFontSize}px ${font}, serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(customText, width / 2, height - height * 0.08);
      }
    }
  }, [width, height, bgColor, filledColor, emptyColor, radius, spacing, textColor, showCustomText, customText, font, highlightColor, mode]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
