import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

  // Calculate date in IST (UTC+5:30)
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset + now.getTimezoneOffset() * 60 * 1000);

  const totalDays = getDaysInMonth(istDate);
  const dayOfMonth = getDayOfMonth(istDate);
  const firstDayOffset = getFirstDayOfMonth(istDate);
  const monthName = getMonthNameShort(istDate);
  const year = istDate.getFullYear();

  // Calendar grid layout
  const columns = 7;
  const rows = Math.ceil((totalDays + firstDayOffset) / columns);

  // Calculate cell size based on available width
  const availableWidth = width * 0.85;
  const cellSize = Math.floor(availableWidth / columns);
  const gridWidth = columns * cellSize;
  const gridHeight = rows * cellSize;

  // Font sizes
  const monthTitleFontSize = Math.max(36, Math.floor(width / 24));
  const dayNameFontSize = Math.max(24, Math.floor(width / 40));
  const dateFontSize = Math.max(32, Math.floor(width / 28));
  const subtitleFontSize = Math.max(28, Math.floor(width / 32));
  const customTextFontSize = Math.max(42, Math.floor(width / 20));

  // Calculate total content height
  const monthTitleHeight = monthTitleFontSize + 30;
  const headerHeight = dayNameFontSize + 20;
  const gridToSubtitleGap = 25;
  const subtitleBlockHeight = gridToSubtitleGap + subtitleFontSize;
  const totalContentHeight = monthTitleHeight + headerHeight + gridHeight + subtitleBlockHeight;

  // Center everything vertically, push down to avoid clock
  const verticalOffset = height * 0.05;
  const contentStartY = (height - totalContentHeight) / 2 + verticalOffset;

  const offsetX = (width - gridWidth) / 2;
  const monthTitleY = contentStartY;
  const headerY = monthTitleY + monthTitleHeight;
  const gridStartY = headerY + headerHeight;
  const subtitleY = gridStartY + gridHeight + gridToSubtitleGap;
  const gridLineColor = '#666666';

  // Generate day name headers
  const dayHeaders = DAY_NAMES.map((day, i) => (
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
        color: emptyColor,
      }}
    >
      {day}
    </div>
  ));

  // Generate calendar cells
  const cells = [];
  for (let i = 0; i < rows * columns; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const dayNumber = i - firstDayOffset + 1;
    const isValidDay = dayNumber >= 1 && dayNumber <= totalDays;

    if (!isValidDay) continue;

    const isPassed = dayNumber < dayOfMonth;
    const isCurrentDay = dayNumber === dayOfMonth;

    const x = offsetX + col * cellSize;
    const y = gridStartY + row * cellSize;

    // Determine styling
    let textColorForCell = emptyColor;
    let backgroundColor = 'transparent';

    if (isPassed) {
      textColorForCell = filledColor;
    } else if (isCurrentDay) {
      textColorForCell = bgColor;
      backgroundColor = highlightColor;
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: cellSize * 0.75,
            height: cellSize * 0.75,
            borderRadius: '50%',
            backgroundColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: dateFontSize,
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: isCurrentDay ? 600 : 400,
            color: textColorForCell,
          }}
        >
          {dayNumber}
        </div>
      </div>
    );
  }

  // Determine which font family to use for custom text
  const customFontFamily = font || 'serif';

  // Generate grid lines
  const gridLines = [];

  // Horizontal lines
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
          backgroundColor: gridLineColor,
        }}
      />
    );
  }

  // Vertical lines
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
          backgroundColor: gridLineColor,
        }}
      />
    );
  }

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
        {/* Month title */}
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

        {/* Day name headers */}
        {dayHeaders}

        {/* Grid lines */}
        {gridLines}

        {/* Calendar cells */}
        {cells}

        {/* Subtitle - "Xd left . X%" */}
        <div
          style={{
            position: 'absolute',
            top: subtitleY,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: subtitleFontSize,
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 400,
            letterSpacing: '0.02em',
          }}
        >
          <span style={{ color: accentColor }}>{totalDays - dayOfMonth}d left</span>
          <span style={{ color: textColor, marginLeft: 16, marginRight: 16 }}>•</span>
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
