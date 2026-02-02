import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDaysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Parse query parameters with defaults
  const width = parseInt(searchParams.get('width') || '1284', 10);
  const height = parseInt(searchParams.get('height') || '2778', 10);
  const bgColor = `#${searchParams.get('bg') || '000000'}`;
  const filledColor = `#${searchParams.get('filled') || 'FFFFFF'}`;
  const emptyColor = `#${searchParams.get('empty') || '333333'}`;
  const radius = parseInt(searchParams.get('radius') || '12', 10);
  const spacing = parseInt(searchParams.get('spacing') || '6', 10);
  const textColor = `#${searchParams.get('textColor') || 'FFFFFF'}`;
  const showCustomText = searchParams.get('showCustomText') === 'true';
  const customText = searchParams.get('customText') || '';
  const font = searchParams.get('font') || 'sans-serif';

  // Calculate day of year
  const now = new Date();
  const totalDays = getDaysInYear(now.getFullYear());
  const dayOfYear = getDayOfYear(now);
  const daysRemaining = totalDays - dayOfYear;

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

  // Calculate text spacing - font is 4x larger
  const textFontSize = Math.max(24, Math.floor(width / 30)) * 4;
  const topTextSpace = textFontSize + 40; // Space for "X days remaining" above grid

  // Center horizontally, push grid down to avoid clock overlay
  const offsetX = (width - gridWidth) / 2;
  const topPadding = height * 0.28; // Start grid at ~28% from top to clear the clock
  const offsetY = topPadding + topTextSpace;

  // Generate circles
  const circles = [];
  for (let i = 0; i < totalDays; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const x = offsetX + col * cellSize + radius;
    const y = offsetY + row * cellSize + radius;
    const isFilled = i < dayOfYear;

    circles.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x - radius,
          top: y - radius,
          width: diameter,
          height: diameter,
          borderRadius: '50%',
          backgroundColor: isFilled ? filledColor : 'transparent',
          border: isFilled ? 'none' : `2px solid ${emptyColor}`,
          boxSizing: 'border-box',
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
        {/* Days remaining text - always shown above grid */}
        <div
          style={{
            position: 'absolute',
            top: offsetY - topTextSpace + 20,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: textColor,
            fontSize: textFontSize,
            fontFamily: font,
            fontWeight: 300,
            letterSpacing: '0.05em',
          }}
        >
          {daysRemaining} days remaining
        </div>

        {/* Circles grid */}
        {circles}

        {/* Custom text - shown near bottom (above flashlight/camera widgets) */}
        {showCustomText && customText && (
          <div
            style={{
              position: 'absolute',
              bottom: height * 0.12, // Position near bottom, above the widgets
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: textColor,
              fontSize: textFontSize,
              fontFamily: font,
              fontWeight: 300,
              letterSpacing: '0.05em',
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
