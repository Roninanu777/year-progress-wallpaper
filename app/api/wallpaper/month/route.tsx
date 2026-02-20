import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const DAY_NAMES = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAY_NAMES_LONG = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_STYLE_KEYS = ['glass', 'classic', 'bold'] as const;
type MonthStyleKey = (typeof MONTH_STYLE_KEYS)[number];

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

function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getDayOfMonth(date: Date): number {
  return date.getDate();
}

function getFirstDayOfMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

function getMonthNameShort(date: Date): string {
  return date.toLocaleString('en-US', { month: 'short' });
}

function normalizeMonthStyle(style: string | null): MonthStyleKey {
  if (style && (MONTH_STYLE_KEYS as readonly string[]).includes(style)) {
    return style as MonthStyleKey;
  }
  return 'glass';
}

interface MonthRouteParams {
  width: number;
  height: number;
  bgColor: string;
  filledColor: string;
  emptyColor: string;
  textColor: string;
  showCustomText: boolean;
  customText: string;
  font: string;
  highlightColor: string;
  accentColor: string;
  istDate: Date;
}

function renderClassicMonthImage({
  width,
  height,
  bgColor,
  filledColor,
  textColor,
  showCustomText,
  customText,
  font,
  highlightColor,
  accentColor,
  istDate,
}: MonthRouteParams): ImageResponse {
  const totalDays = getDaysInMonth(istDate);
  const dayOfMonth = getDayOfMonth(istDate);
  const firstDayOffset = getFirstDayOfMonth(istDate);
  const monthName = getMonthNameShort(istDate);
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

  const dayHeaders = DAY_NAMES_LONG.map((day, i) => (
    <div
      key={`header-${i}`}
      style={{
        position: 'absolute',
        left: offsetX + i * cellSize,
        top: headerY,
        width: cellSize,
        height: headerHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: dayNameFontSize,
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        fontWeight: 500,
        color: hexToRgba(textColor, 0.72),
      }}
    >
      {day}
    </div>
  ));

  const gridLines = [];
  for (let row = 0; row <= rows; row++) {
    gridLines.push(
      <div
        key={`h-line-${row}`}
        style={{
          position: 'absolute',
          left: offsetX,
          top: gridStartY + row * cellSize,
          width: gridWidth,
          height: 1,
          backgroundColor: hexToRgba(textColor, 0.24),
        }}
      />
    );
  }
  for (let col = 0; col <= columns; col++) {
    gridLines.push(
      <div
        key={`v-line-${col}`}
        style={{
          position: 'absolute',
          left: offsetX + col * cellSize,
          top: gridStartY,
          width: 1,
          height: gridHeight,
          backgroundColor: hexToRgba(textColor, 0.24),
        }}
      />
    );
  }

  const cells = [];
  for (let i = 0; i < rows * columns; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const dayNumber = i - firstDayOffset + 1;
    const isValidDay = dayNumber >= 1 && dayNumber <= totalDays;
    if (!isValidDay) continue;

    const isPassed = dayNumber < dayOfMonth;
    const isCurrentDay = dayNumber === dayOfMonth;

    cells.push(
      <div
        key={`cell-${dayNumber}`}
        style={{
          position: 'absolute',
          left: offsetX + col * cellSize,
          top: gridStartY + row * cellSize,
          width: cellSize,
          height: cellSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isCurrentDay && (
          <div
            style={{
              position: 'absolute',
              width: cellSize * 0.7,
              height: cellSize * 0.7,
              borderRadius: '50%',
              backgroundColor: highlightColor,
            }}
          />
        )}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            fontSize: dateFontSize,
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: isCurrentDay ? 700 : 400,
            color: isPassed ? filledColor : isCurrentDay ? bgColor : hexToRgba(textColor, 0.46),
          }}
        >
          {dayNumber}
        </div>
      </div>
    );
  }

  const daysLeft = totalDays - dayOfMonth;
  const percentText = `${((dayOfMonth / totalDays) * 100).toFixed(1)}%`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: bgColor,
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: monthTitleY,
            left: 0,
            right: 0,
            height: monthTitleHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: monthTitleFontSize,
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 600,
            color: filledColor,
          }}
        >
          {monthName} {year}
        </div>

        {dayHeaders}
        {gridLines}
        {cells}

        <div
          style={{
            position: 'absolute',
            top: subtitleY - subtitleFontSize / 2,
            left: 0,
            right: 0,
            height: subtitleFontSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: subtitleFontSize,
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 400,
            letterSpacing: '0.02em',
          }}
        >
          <span style={{ color: accentColor }}>{daysLeft}d left</span>
          <span style={{ color: textColor, marginLeft: 14, marginRight: 14 }}>•</span>
          <span style={{ color: textColor }}>{percentText}</span>
        </div>

        {showCustomText && customText && (
          <div
            style={{
              position: 'absolute',
              bottom: height * 0.08,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: textColor,
              fontSize: customTextFontSize,
              fontFamily: font || 'serif',
              fontWeight: 400,
              fontStyle: 'italic',
              letterSpacing: '0.01em',
            }}
          >
            {customText}
          </div>
        )}
      </div>
    ),
    { width, height }
  );
}

function renderBoldMonthImage({
  width,
  height,
  bgColor,
  filledColor,
  emptyColor,
  textColor,
  showCustomText,
  customText,
  font,
  highlightColor,
  accentColor,
  istDate,
}: MonthRouteParams): ImageResponse {
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

  const dayHeaders = DAY_NAMES.map((day, i) => {
    const isWeekend = i === 0 || i === 6;
    return (
      <div
        key={`header-${i}`}
        style={{
          position: 'absolute',
          left: gridStartX + i * (cellSize + gap),
          top: headerY,
          width: cellSize,
          height: dayNameFontSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: dayNameFontSize,
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 700,
          color: isWeekend ? accentColor : hexToRgba(textColor, 0.72),
        }}
      >
        {day}
      </div>
    );
  });

  const cells = [];
  for (let i = 0; i < rows * columns; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const dayNumber = i - firstDayOffset + 1;
    const isValidDay = dayNumber >= 1 && dayNumber <= totalDays;
    if (!isValidDay) continue;

    const isPassed = dayNumber < dayOfMonth;
    const isCurrentDay = dayNumber === dayOfMonth;
    const x = gridStartX + col * (cellSize + gap);
    const y = gridStartY + row * (cellSize + gap);

    let tileBackground = hexToRgba(emptyColor, 0.24);
    let dayColor = hexToRgba(textColor, 0.62);
    let border = '1px solid transparent';
    let boxShadow = 'none';

    if (isPassed) {
      tileBackground = hexToRgba(filledColor, 0.24);
      dayColor = filledColor;
    }

    if (isCurrentDay) {
      tileBackground = accentColor;
      dayColor = bgColor;
      border = `2px solid ${hexToRgba(highlightColor, 0.75)}`;
      boxShadow = `0 0 ${Math.max(18, Math.floor(width / 70))}px ${hexToRgba(highlightColor, 0.45)}`;
    }

    cells.push(
      <div
        key={`cell-${dayNumber}`}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: cellSize,
          height: cellSize,
          borderRadius: tileRadius,
          backgroundColor: tileBackground,
          border,
          boxShadow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: dateFontSize,
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: isCurrentDay ? 800 : isPassed ? 600 : 500,
          color: dayColor,
        }}
      >
        {dayNumber}
      </div>
    );
  }

  const daysLeft = totalDays - dayOfMonth;
  const percentText = `${((dayOfMonth / totalDays) * 100).toFixed(1)}%`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: bgColor,
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: shellX,
            top: shellY,
            width: shellWidth,
            height: shellHeight,
            borderRadius: shellRadius,
            backgroundColor: hexToRgba(textColor, 0.08),
            border: `${Math.max(1.5, width / 540)}px solid ${hexToRgba(accentColor, 0.35)}`,
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: shellX + shellPadding,
            top: shellY + shellPadding,
            width: shellWidth - shellPadding * 2,
            height: Math.max(34, Math.floor(width / 36)),
            borderRadius: Math.max(17, Math.floor(width / 72)),
            backgroundColor: hexToRgba(accentColor, 0.2),
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: shellX,
            top: titleY - titleFontSize / 2,
            width: shellWidth,
            height: titleFontSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: titleFontSize,
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 700,
            color: filledColor,
          }}
        >
          {monthName.toUpperCase()} {year}
        </div>

        {dayHeaders}
        {cells}

        <div
          style={{
            position: 'absolute',
            left: shellX,
            top: subtitleY - subtitleFontSize / 2,
            width: shellWidth,
            height: subtitleFontSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: subtitleFontSize,
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 600,
            color: textColor,
            letterSpacing: '0.02em',
          }}
        >
          {daysLeft}d left   •   {percentText}
        </div>

        {showCustomText && customText && (
          <div
            style={{
              position: 'absolute',
              bottom: height * 0.08,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: textColor,
              fontSize: customTextFontSize,
              fontFamily: font || 'serif',
              fontWeight: 400,
              fontStyle: 'italic',
              letterSpacing: '0.01em',
            }}
          >
            {customText}
          </div>
        )}
      </div>
    ),
    { width, height }
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Parse query parameters with defaults
  const width = parseInt(searchParams.get('width') || '1284', 10);
  const height = parseInt(searchParams.get('height') || '2778', 10);
  const bgColor = `#${searchParams.get('bg') || '000000'}`;
  const filledColor = `#${searchParams.get('filled') || 'FFFFFF'}`;
  const emptyColor = `#${searchParams.get('empty') || '333333'}`;
  const textColor = `#${searchParams.get('textColor') || 'FFFFFF'}`;
  const showCustomText = searchParams.get('showCustomText') === 'true';
  const customText = searchParams.get('customText') || '';
  const font = searchParams.get('font') || 'Lora';
  const highlightColor = `#${searchParams.get('highlightColor') || 'FFD700'}`;
  const accentColor = `#${searchParams.get('accentColor') || 'FFA500'}`;
  const monthStyle = normalizeMonthStyle(searchParams.get('monthStyle'));

  // Calculate date in IST (UTC+5:30)
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset + now.getTimezoneOffset() * 60 * 1000);

  if (monthStyle === 'classic') {
    return renderClassicMonthImage({
      width,
      height,
      bgColor,
      filledColor,
      emptyColor,
      textColor,
      showCustomText,
      customText,
      font,
      highlightColor,
      accentColor,
      istDate,
    });
  }

  if (monthStyle === 'bold') {
    return renderBoldMonthImage({
      width,
      height,
      bgColor,
      filledColor,
      emptyColor,
      textColor,
      showCustomText,
      customText,
      font,
      highlightColor,
      accentColor,
      istDate,
    });
  }

  const totalDays = getDaysInMonth(istDate);
  const dayOfMonth = getDayOfMonth(istDate);
  const firstDayOffset = getFirstDayOfMonth(istDate);
  const monthName = getMonthNameShort(istDate);
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
  const subtitleY = gridStartY + gridHeight + betweenSectionsGap;

  const completionText = `${dayOfMonth}/${totalDays} complete`;
  const badgeWidth = Math.max(
    Math.floor(cardWidth * 0.34),
    Math.floor(completionText.length * badgeFontSize * 0.66) + Math.max(22, Math.floor(width / 54))
  );
  const badgeX = (width - badgeWidth) / 2;

  // Generate day name headers
  const dayHeaders = DAY_NAMES.map((day, i) => {
    const isWeekend = i === 0 || i === 6;
    return (
      <div
        key={`header-${i}`}
        style={{
          position: 'absolute',
          left: gridStartX + i * (cellSize + cellGap),
          top: headerY,
          width: cellSize,
          height: dayHeaderHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: dayNameFontSize,
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 600,
          color: isWeekend ? hexToRgba(accentColor, 0.86) : hexToRgba(textColor, 0.68),
        }}
      >
        {day}
      </div>
    );
  });

  // Generate calendar cells
  const cells = [];
  for (let i = 0; i < rows * columns; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const dayNumber = i - firstDayOffset + 1;
    const isValidDay = dayNumber >= 1 && dayNumber <= totalDays;
    const x = gridStartX + col * (cellSize + cellGap);
    const y = gridStartY + row * (cellSize + cellGap);
    const isWeekend = col === 0 || col === 6;

    if (!isValidDay) {
      cells.push(
        <div
          key={`empty-${i}`}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: cellSize,
            height: cellSize,
            borderRadius: cellRadius,
            backgroundColor: hexToRgba(textColor, 0.02),
            border: `1px solid ${hexToRgba(textColor, 0.04)}`,
          }}
        />
      );
      continue;
    }

    const isPassed = dayNumber < dayOfMonth;
    const isCurrentDay = dayNumber === dayOfMonth;

    let tileBackground: string = hexToRgba(emptyColor, 0.14);
    let tileBorder = hexToRgba(textColor, 0.12);
    let dayColor = isWeekend ? hexToRgba(accentColor, 0.72) : hexToRgba(textColor, 0.62);
    let shadow = 'none';

    if (isPassed) {
      tileBackground = hexToRgba(filledColor, 0.2);
      tileBorder = hexToRgba(filledColor, 0.42);
      dayColor = filledColor;
    }

    if (isCurrentDay) {
      tileBackground = `linear-gradient(180deg, ${highlightColor} 0%, ${accentColor} 100%)`;
      tileBorder = hexToRgba(highlightColor, 0.94);
      dayColor = bgColor;
      shadow = `0 0 ${Math.max(18, Math.floor(width / 70))}px ${hexToRgba(highlightColor, 0.45)}`;
    }

    cells.push(
      <div
        key={`cell-${dayNumber}`}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: cellSize,
          height: cellSize,
          borderRadius: cellRadius,
          background: tileBackground,
          border: `1px solid ${tileBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: dateFontSize,
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: isCurrentDay ? 700 : isPassed ? 600 : 500,
          color: dayColor,
          boxShadow: shadow,
        }}
      >
        {dayNumber}
      </div>
    );
  }

  // Determine which font family to use for custom text
  const customFontFamily = font || 'serif';
  const daysLeftText = width < 700 ? `${totalDays - dayOfMonth}d left` : `${totalDays - dayOfMonth} days left`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: bgColor,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width,
            height,
            background: `radial-gradient(circle at 50% 45%, ${hexToRgba(accentColor, 0.14)} 0%, rgba(0, 0, 0, 0) 58%)`,
          }}
        />

        {/* Calendar card */}
        <div
          style={{
            position: 'absolute',
            left: cardX,
            top: cardY,
            width: cardWidth,
            height: cardHeight,
            borderRadius: cardRadius,
            background: `linear-gradient(180deg, ${hexToRgba(textColor, 0.1)} 0%, ${hexToRgba(textColor, 0.04)} 100%)`,
            border: `${Math.max(1, Math.floor(width / 640))}px solid ${hexToRgba(textColor, 0.18)}`,
          }}
        />

        {/* Month title */}
        <div
          style={{
            position: 'absolute',
            top: titleCenterY - monthTitleFontSize / 2,
            left: cardX,
            width: cardWidth,
            height: monthTitleFontSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: monthTitleFontSize,
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 600,
            color: filledColor,
          }}
        >
          {monthName} {year}
        </div>

        {/* Completion badge */}
        <div
          style={{
            position: 'absolute',
            left: badgeX,
            top: badgeY,
            width: badgeWidth,
            height: badgeHeight,
            borderRadius: badgeHeight / 2,
            backgroundColor: hexToRgba(accentColor, 0.2),
            border: `1px solid ${hexToRgba(accentColor, 0.5)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: badgeFontSize,
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 600,
            color: accentColor,
          }}
        >
          {completionText}
        </div>

        {/* Day name headers */}
        {dayHeaders}

        {/* Calendar cells */}
        {cells}

        {/* Stats row */}
        <div
          style={{
            position: 'absolute',
            left: cardX,
            top: subtitleY,
            width: cardWidth,
            height: subtitleFontSize,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: subtitleFontSize,
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}
        >
          <span style={{ color: accentColor }}>{daysLeftText}</span>
          <span
            style={{
              color: hexToRgba(textColor, 0.8),
              marginLeft: Math.max(10, Math.floor(width / 90)),
              marginRight: Math.max(10, Math.floor(width / 90)),
            }}
          >
            •
          </span>
          <span style={{ color: textColor }}>{((dayOfMonth / totalDays) * 100).toFixed(1)}%</span>
        </div>

        {/* Custom text/quote - shown near bottom, always italic */}
        {showCustomText && customText && (
          <div
            style={{
              position: 'absolute',
              bottom: height * 0.08,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: textColor,
              fontSize: customTextFontSize,
              fontFamily: customFontFamily,
              fontWeight: 400,
              fontStyle: 'italic',
              letterSpacing: '0.01em',
            }}
          >
            {customText}
          </div>
        )}
      </div>
    ),
    {
      width,
      height,
    }
  );
}
