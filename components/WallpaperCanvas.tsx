'use client';

import { useRef, useEffect } from 'react';
import { getDayOfYear, getDaysInYear, getDayOfMonth, getDaysInMonth, getFirstDayOfMonth } from '@/lib/utils';
import { MonthStyleKey } from '@/lib/constants';

interface WallpaperCanvasProps {
  width: number;
  height: number;
  bgColor: string;
  filledColor: string;
  emptyColor: string;
  radius: number;
  spacing: number;
  textColor: string;
  accentColor?: string;
  showCustomText: boolean;
  customText: string;
  font: string;
  highlightColor?: string;
  mode?: 'year' | 'month';
  monthStyle?: MonthStyleKey;
}

const DAY_NAMES = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAY_NAMES_LONG = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function hexToRgba(hex: string, alpha: number): string {
  const safeHex = hex.replace('#', '');
  if (!/^[\da-fA-F]{6}$/.test(safeHex)) {
    return `rgba(255, 255, 255, ${alpha})`;
  }

  const r = parseInt(safeHex.slice(0, 2), 16);
  const g = parseInt(safeHex.slice(2, 4), 16);
  const b = parseInt(safeHex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rectWidth: number,
  rectHeight: number,
  radius: number
) {
  const r = Math.min(radius, rectWidth / 2, rectHeight / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + rectWidth - r, y);
  ctx.quadraticCurveTo(x + rectWidth, y, x + rectWidth, y + r);
  ctx.lineTo(x + rectWidth, y + rectHeight - r);
  ctx.quadraticCurveTo(x + rectWidth, y + rectHeight, x + rectWidth - r, y + rectHeight);
  ctx.lineTo(x + r, y + rectHeight);
  ctx.quadraticCurveTo(x, y + rectHeight, x, y + rectHeight - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
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
  accentColor = '#FFA500',
  showCustomText,
  customText,
  font,
  highlightColor = '#FFD700',
  mode = 'year',
  monthStyle = 'glass',
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
      drawMonthView(ctx, istDate, monthStyle);
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

      // Draw "329d left" in accent color
      ctx.fillStyle = accentColor;
      ctx.textAlign = 'left';
      ctx.fillText(daysLeftText, startX, subtitleY);

      // Draw " · " and percentage in text color
      ctx.fillStyle = textColor;
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

    function drawMonthView(ctx: CanvasRenderingContext2D, istDate: Date, selectedMonthStyle: MonthStyleKey) {
      if (selectedMonthStyle === 'classic') {
        drawMonthViewClassic(ctx, istDate);
        return;
      }

      if (selectedMonthStyle === 'bold') {
        drawMonthViewBold(ctx, istDate);
        return;
      }

      drawMonthViewGlass(ctx, istDate);
    }

    function drawMonthViewGlass(ctx: CanvasRenderingContext2D, istDate: Date) {
      const totalDays = getDaysInMonth(istDate);
      const dayOfMonth = getDayOfMonth(istDate);
      const firstDayOffset = getFirstDayOfMonth(istDate);
      const monthName = istDate.toLocaleString('en-US', { month: 'short' });
      const year = istDate.getFullYear();

      const columns = 7;
      const rows = Math.ceil((totalDays + firstDayOffset) / columns);

      // Font sizes
      const monthTitleFontSize = Math.max(24, Math.floor(width / 24));
      const badgeFontSize = Math.max(14, Math.floor(width / 52));
      const dayNameFontSize = Math.max(12, Math.floor(width / 70));
      const dateFontSize = Math.max(18, Math.floor(width / 36));
      const subtitleFontSize = Math.max(18, Math.floor(width / 44));
      const customTextFontSize = Math.max(32, Math.floor(width / 22));

      // Card and grid sizing
      const cardWidth = Math.round(width * 0.86);
      const cardPaddingX = Math.max(14, Math.floor(width / 40));
      const cardRadius = Math.max(20, Math.floor(width / 36));
      const cellGap = Math.max(3, Math.floor(width / 190));
      const cellSize = Math.floor((cardWidth - cardPaddingX * 2 - cellGap * (columns - 1)) / columns);
      const gridWidth = columns * cellSize + cellGap * (columns - 1);
      const gridHeight = rows * cellSize + cellGap * (rows - 1);
      const cellRadius = Math.max(6, Math.floor(cellSize * 0.28));

      const topPadding = Math.max(18, Math.floor(width / 42));
      const betweenSectionsGap = Math.max(10, Math.floor(width / 80));
      const bottomPadding = Math.max(18, Math.floor(width / 42));
      const badgeHeight = Math.max(28, Math.floor(width / 42));
      const dayHeaderHeight = dayNameFontSize + Math.max(8, Math.floor(width / 120));

      const cardHeight = topPadding
        + monthTitleFontSize
        + betweenSectionsGap
        + badgeHeight
        + betweenSectionsGap
        + dayHeaderHeight
        + betweenSectionsGap
        + gridHeight
        + betweenSectionsGap
        + subtitleFontSize
        + bottomPadding;

      const verticalOffset = height * 0.06;
      const cardX = (width - cardWidth) / 2;
      const cardY = (height - cardHeight) / 2 + verticalOffset;
      const gridStartX = cardX + (cardWidth - gridWidth) / 2;

      const titleCenterY = cardY + topPadding + monthTitleFontSize / 2;
      const badgeY = cardY + topPadding + monthTitleFontSize + betweenSectionsGap;
      const headerY = badgeY + badgeHeight + betweenSectionsGap;
      const gridStartY = headerY + dayHeaderHeight + betweenSectionsGap;
      const subtitleY = gridStartY + gridHeight + betweenSectionsGap + subtitleFontSize / 2;

      // Ambient glow behind card
      const ambientGlow = ctx.createRadialGradient(
        width / 2,
        cardY + cardHeight * 0.45,
        cardWidth * 0.1,
        width / 2,
        cardY + cardHeight * 0.45,
        cardWidth * 0.75
      );
      ambientGlow.addColorStop(0, hexToRgba(accentColor, 0.14));
      ambientGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ambientGlow;
      ctx.fillRect(0, 0, width, height);

      // Card background
      const cardGradient = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardHeight);
      cardGradient.addColorStop(0, hexToRgba(textColor, 0.1));
      cardGradient.addColorStop(1, hexToRgba(textColor, 0.04));

      roundedRectPath(ctx, cardX, cardY, cardWidth, cardHeight, cardRadius);
      ctx.fillStyle = cardGradient;
      ctx.fill();

      roundedRectPath(ctx, cardX, cardY, cardWidth, cardHeight, cardRadius);
      ctx.strokeStyle = hexToRgba(textColor, 0.18);
      ctx.lineWidth = Math.max(1, Math.floor(width / 640));
      ctx.stroke();

      // Month title
      ctx.font = `600 ${monthTitleFontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = filledColor;
      ctx.fillText(`${monthName} ${year}`, width / 2, titleCenterY);

      // Completion badge
      const completionText = `${dayOfMonth}/${totalDays} complete`;
      ctx.font = `600 ${badgeFontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
      const badgeTextWidth = ctx.measureText(completionText).width;
      const badgeWidth = badgeTextWidth + Math.max(22, Math.floor(width / 54));
      const badgeX = (width - badgeWidth) / 2;

      roundedRectPath(ctx, badgeX, badgeY, badgeWidth, badgeHeight, badgeHeight / 2);
      ctx.fillStyle = hexToRgba(accentColor, 0.2);
      ctx.fill();
      roundedRectPath(ctx, badgeX, badgeY, badgeWidth, badgeHeight, badgeHeight / 2);
      ctx.strokeStyle = hexToRgba(accentColor, 0.5);
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = accentColor;
      ctx.fillText(completionText, width / 2, badgeY + badgeHeight / 2);

      // Day name headers
      ctx.font = `600 ${dayNameFontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
      for (let i = 0; i < DAY_NAMES.length; i++) {
        const x = gridStartX + i * (cellSize + cellGap) + cellSize / 2;
        const y = headerY + dayHeaderHeight / 2;
        const isWeekend = i === 0 || i === 6;
        ctx.fillStyle = isWeekend ? hexToRgba(accentColor, 0.86) : hexToRgba(textColor, 0.68);
        ctx.fillText(DAY_NAMES[i], x, y);
      }

      // Calendar cells
      for (let i = 0; i < rows * columns; i++) {
        const col = i % columns;
        const row = Math.floor(i / columns);
        const dayNumber = i - firstDayOffset + 1;
        const isValidDay = dayNumber >= 1 && dayNumber <= totalDays;
        const x = gridStartX + col * (cellSize + cellGap);
        const y = gridStartY + row * (cellSize + cellGap);
        const isWeekend = col === 0 || col === 6;

        if (!isValidDay) {
          roundedRectPath(ctx, x, y, cellSize, cellSize, cellRadius);
          ctx.fillStyle = hexToRgba(textColor, 0.02);
          ctx.fill();
          roundedRectPath(ctx, x, y, cellSize, cellSize, cellRadius);
          ctx.strokeStyle = hexToRgba(textColor, 0.04);
          ctx.lineWidth = 1;
          ctx.stroke();
          continue;
        }

        const isPassed = dayNumber < dayOfMonth;
        const isCurrentDay = dayNumber === dayOfMonth;

        let tileFill: string | CanvasGradient = hexToRgba(emptyColor, 0.14);
        let tileStroke = hexToRgba(textColor, 0.12);
        let dateTextColor = isWeekend ? hexToRgba(accentColor, 0.72) : hexToRgba(textColor, 0.62);

        if (isPassed) {
          tileFill = hexToRgba(filledColor, 0.2);
          tileStroke = hexToRgba(filledColor, 0.42);
          dateTextColor = filledColor;
        }

        if (isCurrentDay) {
          const tileGradient = ctx.createLinearGradient(x, y, x, y + cellSize);
          tileGradient.addColorStop(0, highlightColor);
          tileGradient.addColorStop(1, accentColor);
          tileFill = tileGradient;
          tileStroke = hexToRgba(highlightColor, 0.94);
          dateTextColor = bgColor;
        }

        roundedRectPath(ctx, x, y, cellSize, cellSize, cellRadius);
        if (isCurrentDay) {
          ctx.shadowColor = hexToRgba(highlightColor, 0.48);
          ctx.shadowBlur = Math.max(10, Math.floor(width / 70));
        }
        ctx.fillStyle = tileFill;
        ctx.fill();
        ctx.shadowBlur = 0;

        roundedRectPath(ctx, x, y, cellSize, cellSize, cellRadius);
        ctx.strokeStyle = tileStroke;
        ctx.lineWidth = isCurrentDay ? Math.max(1.5, width / 520) : 1;
        ctx.stroke();

        ctx.font = `${isCurrentDay ? '700' : isPassed ? '600' : '500'} ${dateFontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = dateTextColor;
        ctx.fillText(String(dayNumber), x + cellSize / 2, y + cellSize / 2);
      }

      // Draw stats row
      const daysLeft = totalDays - dayOfMonth;
      const percentComplete = ((dayOfMonth / totalDays) * 100).toFixed(1);
      const daysLeftText = width < 700 ? `${daysLeft}d left` : `${daysLeft} days left`;
      const separatorText = ' • ';
      const percentText = `${percentComplete}%`;

      ctx.font = `500 ${subtitleFontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
      const daysLeftWidth = ctx.measureText(daysLeftText).width;
      const separatorWidth = ctx.measureText(separatorText).width;
      const percentWidth = ctx.measureText(percentText).width;
      const totalTextWidth = daysLeftWidth + separatorWidth + percentWidth;
      const startX = (width - totalTextWidth) / 2;

      ctx.textBaseline = 'middle';
      ctx.fillStyle = accentColor;
      ctx.textAlign = 'left';
      ctx.fillText(daysLeftText, startX, subtitleY);

      ctx.fillStyle = hexToRgba(textColor, 0.8);
      ctx.fillText(separatorText, startX + daysLeftWidth, subtitleY);
      ctx.fillStyle = textColor;
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

    function drawMonthViewClassic(ctx: CanvasRenderingContext2D, istDate: Date) {
      const totalDays = getDaysInMonth(istDate);
      const dayOfMonth = getDayOfMonth(istDate);
      const firstDayOffset = getFirstDayOfMonth(istDate);
      const monthName = istDate.toLocaleString('en-US', { month: 'short' });
      const year = istDate.getFullYear();

      const columns = 7;
      const rows = Math.ceil((totalDays + firstDayOffset) / columns);
      const availableWidth = width * 0.85;
      const cellSize = Math.floor(availableWidth / columns);
      const gridWidth = columns * cellSize;
      const gridHeight = rows * cellSize;

      const monthTitleFontSize = Math.max(34, Math.floor(width / 24));
      const dayNameFontSize = Math.max(20, Math.floor(width / 42));
      const dateFontSize = Math.max(28, Math.floor(width / 30));
      const subtitleFontSize = Math.max(26, Math.floor(width / 34));
      const customTextFontSize = Math.max(38, Math.floor(width / 20));

      const monthTitleHeight = monthTitleFontSize + 24;
      const headerHeight = dayNameFontSize + 18;
      const gridToSubtitleGap = 24;
      const subtitleBlockHeight = gridToSubtitleGap + subtitleFontSize;
      const totalContentHeight = monthTitleHeight + headerHeight + gridHeight + subtitleBlockHeight;

      const verticalOffset = height * 0.05;
      const contentStartY = (height - totalContentHeight) / 2 + verticalOffset;

      const offsetX = (width - gridWidth) / 2;
      const monthTitleY = contentStartY;
      const headerY = monthTitleY + monthTitleHeight;
      const gridStartY = headerY + headerHeight;
      const subtitleY = gridStartY + gridHeight + gridToSubtitleGap;

      ctx.font = `600 ${monthTitleFontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = filledColor;
      ctx.fillText(`${monthName} ${year}`, width / 2, monthTitleY + monthTitleHeight / 2);

      ctx.font = `500 ${dayNameFontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.fillStyle = hexToRgba(textColor, 0.72);
      for (let i = 0; i < DAY_NAMES_LONG.length; i++) {
        const x = offsetX + i * cellSize + cellSize / 2;
        const y = headerY + headerHeight / 2;
        ctx.fillText(DAY_NAMES_LONG[i], x, y);
      }

      ctx.strokeStyle = hexToRgba(textColor, 0.24);
      ctx.lineWidth = 1;
      for (let row = 0; row <= rows; row++) {
        const y = gridStartY + row * cellSize;
        ctx.beginPath();
        ctx.moveTo(offsetX, y);
        ctx.lineTo(offsetX + gridWidth, y);
        ctx.stroke();
      }
      for (let col = 0; col <= columns; col++) {
        const x = offsetX + col * cellSize;
        ctx.beginPath();
        ctx.moveTo(x, gridStartY);
        ctx.lineTo(x, gridStartY + gridHeight);
        ctx.stroke();
      }

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

        if (isCurrentDay) {
          ctx.beginPath();
          ctx.arc(x, y, cellSize * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = highlightColor;
          ctx.fill();
        }

        ctx.font = `${isCurrentDay ? '700' : '400'} ${dateFontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (isPassed) {
          ctx.fillStyle = filledColor;
        } else if (isCurrentDay) {
          ctx.fillStyle = bgColor;
        } else {
          ctx.fillStyle = hexToRgba(textColor, 0.46);
        }
        ctx.fillText(String(dayNumber), x, y);
      }

      const daysLeft = totalDays - dayOfMonth;
      const percentComplete = ((dayOfMonth / totalDays) * 100).toFixed(1);
      const daysLeftText = `${daysLeft}d left`;
      const separatorText = ' • ';
      const percentText = `${percentComplete}%`;

      ctx.font = `400 ${subtitleFontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
      const daysLeftWidth = ctx.measureText(daysLeftText).width;
      const separatorWidth = ctx.measureText(separatorText).width;
      const percentWidth = ctx.measureText(percentText).width;
      const totalTextWidth = daysLeftWidth + separatorWidth + percentWidth;
      const startX = (width - totalTextWidth) / 2;

      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillStyle = accentColor;
      ctx.fillText(daysLeftText, startX, subtitleY);
      ctx.fillStyle = textColor;
      ctx.fillText(separatorText, startX + daysLeftWidth, subtitleY);
      ctx.fillText(percentText, startX + daysLeftWidth + separatorWidth, subtitleY);

      if (showCustomText && customText) {
        ctx.fillStyle = textColor;
        ctx.font = `italic 400 ${customTextFontSize}px ${font}, serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(customText, width / 2, height - height * 0.08);
      }
    }

    function drawMonthViewBold(ctx: CanvasRenderingContext2D, istDate: Date) {
      const totalDays = getDaysInMonth(istDate);
      const dayOfMonth = getDayOfMonth(istDate);
      const firstDayOffset = getFirstDayOfMonth(istDate);
      const monthName = istDate.toLocaleString('en-US', { month: 'long' });
      const year = istDate.getFullYear();

      const columns = 7;
      const rows = Math.ceil((totalDays + firstDayOffset) / columns);

      const titleFontSize = Math.max(26, Math.floor(width / 23));
      const dayNameFontSize = Math.max(12, Math.floor(width / 72));
      const dateFontSize = Math.max(20, Math.floor(width / 34));
      const subtitleFontSize = Math.max(20, Math.floor(width / 42));
      const customTextFontSize = Math.max(34, Math.floor(width / 21));

      const shellWidth = Math.round(width * 0.9);
      const shellRadius = Math.max(22, Math.floor(width / 34));
      const shellPadding = Math.max(14, Math.floor(width / 44));
      const gap = Math.max(4, Math.floor(width / 180));
      const cellSize = Math.floor((shellWidth - shellPadding * 2 - gap * (columns - 1)) / columns);
      const gridWidth = columns * cellSize + gap * (columns - 1);
      const gridHeight = rows * cellSize + gap * (rows - 1);
      const tileRadius = Math.max(6, Math.floor(cellSize * 0.24));

      const titleBlock = titleFontSize + Math.max(18, Math.floor(width / 66));
      const headerBlock = dayNameFontSize + Math.max(14, Math.floor(width / 94));
      const subtitleBlock = subtitleFontSize + Math.max(16, Math.floor(width / 90));
      const shellHeight = shellPadding + titleBlock + headerBlock + gridHeight + subtitleBlock + shellPadding;

      const shellX = (width - shellWidth) / 2;
      const shellY = (height - shellHeight) / 2 + height * 0.055;
      const gridStartX = shellX + (shellWidth - gridWidth) / 2;
      const titleY = shellY + shellPadding + titleFontSize / 2;
      const headerY = shellY + shellPadding + titleBlock;
      const gridStartY = headerY + headerBlock;
      const subtitleY = gridStartY + gridHeight + subtitleFontSize / 2 + Math.max(10, Math.floor(width / 88));

      roundedRectPath(ctx, shellX, shellY, shellWidth, shellHeight, shellRadius);
      ctx.fillStyle = hexToRgba(textColor, 0.08);
      ctx.fill();
      roundedRectPath(ctx, shellX, shellY, shellWidth, shellHeight, shellRadius);
      ctx.strokeStyle = hexToRgba(accentColor, 0.35);
      ctx.lineWidth = Math.max(1.5, width / 540);
      ctx.stroke();

      const ribbonHeight = Math.max(34, Math.floor(width / 36));
      roundedRectPath(ctx, shellX + shellPadding, shellY + shellPadding, shellWidth - shellPadding * 2, ribbonHeight, ribbonHeight / 2);
      ctx.fillStyle = hexToRgba(accentColor, 0.2);
      ctx.fill();

      ctx.font = `700 ${titleFontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = filledColor;
      ctx.fillText(`${monthName.toUpperCase()} ${year}`, width / 2, titleY);

      ctx.font = `700 ${dayNameFontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
      for (let i = 0; i < DAY_NAMES.length; i++) {
        const x = gridStartX + i * (cellSize + gap) + cellSize / 2;
        const isWeekend = i === 0 || i === 6;
        ctx.fillStyle = isWeekend ? accentColor : hexToRgba(textColor, 0.72);
        ctx.fillText(DAY_NAMES[i], x, headerY + dayNameFontSize / 2);
      }

      for (let i = 0; i < rows * columns; i++) {
        const col = i % columns;
        const row = Math.floor(i / columns);
        const dayNumber = i - firstDayOffset + 1;
        const isValidDay = dayNumber >= 1 && dayNumber <= totalDays;
        const x = gridStartX + col * (cellSize + gap);
        const y = gridStartY + row * (cellSize + gap);
        if (!isValidDay) continue;

        const isPassed = dayNumber < dayOfMonth;
        const isCurrentDay = dayNumber === dayOfMonth;

        let tileFill = hexToRgba(emptyColor, 0.24);
        let tileStroke = 'transparent';
        let dayText = hexToRgba(textColor, 0.62);

        if (isPassed) {
          tileFill = hexToRgba(filledColor, 0.24);
          dayText = filledColor;
        }

        if (isCurrentDay) {
          tileFill = accentColor;
          tileStroke = hexToRgba(highlightColor, 0.75);
          dayText = bgColor;
        }

        roundedRectPath(ctx, x, y, cellSize, cellSize, tileRadius);
        ctx.fillStyle = tileFill;
        ctx.fill();
        if (tileStroke !== 'transparent') {
          roundedRectPath(ctx, x, y, cellSize, cellSize, tileRadius);
          ctx.strokeStyle = tileStroke;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.font = `${isCurrentDay ? '800' : isPassed ? '600' : '500'} ${dateFontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = dayText;
        ctx.fillText(String(dayNumber), x + cellSize / 2, y + cellSize / 2);
      }

      const daysLeft = totalDays - dayOfMonth;
      const percentComplete = ((dayOfMonth / totalDays) * 100).toFixed(1);
      const statsText = `${daysLeft}d left   •   ${percentComplete}%`;

      ctx.font = `600 ${subtitleFontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = textColor;
      ctx.fillText(statsText, width / 2, subtitleY);

      if (showCustomText && customText) {
        ctx.fillStyle = textColor;
        ctx.font = `italic 400 ${customTextFontSize}px ${font}, serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(customText, width / 2, height - height * 0.08);
      }
    }
  }, [width, height, bgColor, filledColor, emptyColor, radius, spacing, textColor, accentColor, showCustomText, customText, font, highlightColor, mode, monthStyle]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
