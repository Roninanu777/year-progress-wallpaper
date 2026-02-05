import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Google Fonts URLs for different fonts (using wght for weight variations)
const FONT_URLS: Record<string, { regular: string; italic?: string; bold?: string }> = {
  'Inter': {
    regular: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
    bold: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2',
  },
  'Playfair Display': {
    regular: 'https://fonts.gstatic.com/s/playfairdisplay/v36/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff2',
    italic: 'https://fonts.gstatic.com/s/playfairdisplay/v36/nuFRD-vYSZviVYUb_rj3ij__anPXDTnCjmHKM4nYO7KN_qiTbtbK-F2rA.woff2',
  },
  'Roboto Mono': {
    regular: 'https://fonts.gstatic.com/s/robotomono/v23/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_3vq_ROW4.woff2',
  },
  'Lora': {
    regular: 'https://fonts.gstatic.com/s/lora/v32/0QI6MX1D_JOuGQbT0gvTJPa787weuxJBkqs.woff2',
    italic: 'https://fonts.gstatic.com/s/lora/v32/0QI8MX1D_JOuMw_hLdO6T2wV9KnW-MoFkqh8ndeZzZ0.woff2',
  },
  'Oswald': {
    regular: 'https://fonts.gstatic.com/s/oswald/v53/TK3_WkUHHAIjg75cFRf3bXL8LICs1_FvsUZiYA.woff2',
  },
};

async function loadFont(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  return response.arrayBuffer();
}

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
  const font = searchParams.get('font') || 'Lora';
  const highlightColor = `#${searchParams.get('highlightColor') || 'FFD700'}`;
  const accentColor = `#${searchParams.get('accentColor') || 'FFA500'}`;

  // Calculate day of year in IST (UTC+5:30)
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
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

  // Font sizes (matching LifeGrid style)
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
  const offsetY = gridStartY;
  const subtitleY = gridStartY + gridHeight + gridToSubtitleGap;

  // Generate circles
  const circles = [];
  for (let i = 0; i < totalDays; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const x = offsetX + col * cellSize + radius;
    const y = offsetY + row * cellSize + radius;
    const dayNumber = i + 1;
    const isPassed = dayNumber < dayOfYear;
    const isCurrentDay = dayNumber === dayOfYear;

    let dotColor = emptyColor;
    let dotStyle: 'filled' | 'outline' = 'outline';

    if (isPassed) {
      dotColor = filledColor;
      dotStyle = 'filled';
    } else if (isCurrentDay) {
      dotColor = highlightColor;
      dotStyle = 'filled';
    }

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
          backgroundColor: dotStyle === 'filled' ? dotColor : 'transparent',
          border: dotStyle === 'outline' ? `2px solid ${emptyColor}` : 'none',
          boxSizing: 'border-box',
        }}
      />
    );
  }

  // Determine which font family to use for custom text
  const customFontFamily = FONT_URLS[font] ? font : 'serif';

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
        {/* Subtitle - "Xd left · X%" */}
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
          <span style={{ color: accentColor }}>{totalDays - dayOfYear}d left</span>
          <span style={{ color: textColor, marginLeft: 16, marginRight: 16 }}>•</span>
          <span style={{ color: textColor }}>{((dayOfYear / totalDays) * 100).toFixed(1)}%</span>
        </div>

        {/* Circles grid */}
        {circles}

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
