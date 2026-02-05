'use client';

import { useRef, useEffect } from 'react';
import { getDayOfYear, getDaysInYear } from '@/lib/utils';

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
}

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
}: WallpaperCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate day of year in IST (UTC+5:30)
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(now.getTime() + istOffset + now.getTimezoneOffset() * 60 * 1000);
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

    // Clear and fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Draw subtitle (below grid)
    const daysLeft = totalDays - dayOfYear;
    ctx.fillStyle = '#888888';
    ctx.font = `400 ${subtitleFontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(`${daysLeft} days left`, width / 2, subtitleY);

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
  }, [width, height, bgColor, filledColor, emptyColor, radius, spacing, textColor, showCustomText, customText, font, highlightColor]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
