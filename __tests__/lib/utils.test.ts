import {
  isLeapYear,
  getDaysInYear,
  getDayOfYear,
  getDaysRemaining,
  getYearProgress,
  hexToParam,
  paramToHex,
  generateApiUrl,
  calculateGridLayout,
} from '@/lib/utils';

describe('isLeapYear', () => {
  it('returns true for years divisible by 4 but not 100', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2028)).toBe(true);
  });

  it('returns false for years divisible by 100 but not 400', () => {
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2100)).toBe(false);
  });

  it('returns true for years divisible by 400', () => {
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(1600)).toBe(true);
  });

  it('returns false for regular non-leap years', () => {
    expect(isLeapYear(2023)).toBe(false);
    expect(isLeapYear(2025)).toBe(false);
    expect(isLeapYear(2026)).toBe(false);
  });
});

describe('getDaysInYear', () => {
  it('returns 366 for leap years', () => {
    expect(getDaysInYear(2024)).toBe(366);
    expect(getDaysInYear(2000)).toBe(366);
  });

  it('returns 365 for non-leap years', () => {
    expect(getDaysInYear(2023)).toBe(365);
    expect(getDaysInYear(2025)).toBe(365);
    expect(getDaysInYear(2026)).toBe(365);
  });
});

describe('getDayOfYear', () => {
  it('returns 1 for January 1st', () => {
    const jan1 = new Date(2024, 0, 1);
    expect(getDayOfYear(jan1)).toBe(1);
  });

  it('returns 32 for February 1st', () => {
    const feb1 = new Date(2024, 1, 1);
    expect(getDayOfYear(feb1)).toBe(32);
  });

  it('returns 365 for December 31st in non-leap year', () => {
    const dec31 = new Date(2023, 11, 31);
    expect(getDayOfYear(dec31)).toBe(365);
  });

  it('returns 366 for December 31st in leap year', () => {
    const dec31 = new Date(2024, 11, 31);
    expect(getDayOfYear(dec31)).toBe(366);
  });

  it('handles mid-year dates correctly', () => {
    const july4 = new Date(2024, 6, 4);
    // Jan: 31, Feb: 29, Mar: 31, Apr: 30, May: 31, Jun: 30, Jul 1-4: 4
    // Total: 31 + 29 + 31 + 30 + 31 + 30 + 4 = 186
    expect(getDayOfYear(july4)).toBe(186);
  });
});

describe('getDaysRemaining', () => {
  it('returns correct days remaining for January 1st', () => {
    const jan1 = new Date(2024, 0, 1);
    expect(getDaysRemaining(jan1)).toBe(365); // 366 - 1 = 365
  });

  it('returns 0 for December 31st', () => {
    const dec31 = new Date(2024, 11, 31);
    expect(getDaysRemaining(dec31)).toBe(0);
  });

  it('returns correct value mid-year', () => {
    const july1 = new Date(2024, 6, 1);
    const dayOfYear = getDayOfYear(july1);
    expect(getDaysRemaining(july1)).toBe(366 - dayOfYear);
  });
});

describe('getYearProgress', () => {
  it('returns approximately 0% at start of year', () => {
    const jan1 = new Date(2024, 0, 1);
    const progress = getYearProgress(jan1);
    expect(progress).toBeCloseTo(0.27, 1); // 1/366 ≈ 0.27%
  });

  it('returns 100% at end of year', () => {
    const dec31 = new Date(2024, 11, 31);
    const progress = getYearProgress(dec31);
    expect(progress).toBe(100);
  });

  it('returns approximately 50% mid-year', () => {
    // Day 183 of 366 = 50%
    const midYear = new Date(2024, 6, 1); // July 1st is day 183
    const progress = getYearProgress(midYear);
    expect(progress).toBeGreaterThan(45);
    expect(progress).toBeLessThan(55);
  });
});

describe('hexToParam', () => {
  it('removes # from hex color', () => {
    expect(hexToParam('#FFFFFF')).toBe('FFFFFF');
    expect(hexToParam('#000000')).toBe('000000');
    expect(hexToParam('#ff5733')).toBe('ff5733');
  });

  it('returns unchanged if no #', () => {
    expect(hexToParam('FFFFFF')).toBe('FFFFFF');
    expect(hexToParam('000000')).toBe('000000');
  });
});

describe('paramToHex', () => {
  it('adds # to param', () => {
    expect(paramToHex('FFFFFF')).toBe('#FFFFFF');
    expect(paramToHex('000000')).toBe('#000000');
  });

  it('returns unchanged if already has #', () => {
    expect(paramToHex('#FFFFFF')).toBe('#FFFFFF');
    expect(paramToHex('#000000')).toBe('#000000');
  });
});

describe('generateApiUrl', () => {
  it('generates correct URL with all parameters', () => {
    const url = generateApiUrl('https://example.com', {
      width: 1284,
      height: 2778,
      bgColor: '#000000',
      filledColor: '#FFFFFF',
      emptyColor: '#333333',
      radius: 12,
      spacing: 6,
      textColor: '#FFFFFF',
      showCustomText: false,
      customText: '',
      font: 'sans-serif',
    });

    expect(url).toContain('https://example.com/api/wallpaper?');
    expect(url).toContain('width=1284');
    expect(url).toContain('height=2778');
    expect(url).toContain('bg=000000');
    expect(url).toContain('filled=FFFFFF');
    expect(url).toContain('empty=333333');
    expect(url).toContain('radius=12');
    expect(url).toContain('spacing=6');
    expect(url).toContain('textColor=FFFFFF');
    expect(url).toContain('showCustomText=false');
    expect(url).toContain('font=sans-serif');
  });

  it('handles showCustomText=true with custom text', () => {
    const url = generateApiUrl('https://example.com', {
      width: 1284,
      height: 2778,
      bgColor: '#000000',
      filledColor: '#FFFFFF',
      emptyColor: '#333333',
      radius: 12,
      spacing: 6,
      textColor: '#FFFFFF',
      showCustomText: true,
      customText: 'Test text',
      font: 'serif',
    });

    expect(url).toContain('showCustomText=true');
    expect(url).toContain('customText=Test+text');
    expect(url).toContain('font=serif');
  });

  it('works with empty base URL', () => {
    const url = generateApiUrl('', {
      width: 400,
      height: 800,
      bgColor: '#000000',
      filledColor: '#FFFFFF',
      emptyColor: '#333333',
      radius: 10,
      spacing: 4,
      textColor: '#FFFFFF',
      showCustomText: false,
      customText: '',
      font: 'monospace',
    });

    expect(url).toContain('/api/wallpaper?');
    expect(url).toContain('width=400');
    expect(url).toContain('font=monospace');
  });
});

describe('calculateGridLayout', () => {
  it('calculates correct grid dimensions', () => {
    const layout = calculateGridLayout(1284, 2778, 12, 6, 365);

    expect(layout.columns).toBeGreaterThan(0);
    expect(layout.rows).toBeGreaterThan(0);
    expect(layout.columns * layout.rows).toBeGreaterThanOrEqual(365);
    expect(layout.offsetX).toBeGreaterThan(0);
    expect(layout.offsetY).toBeGreaterThan(0);
  });

  it('centers the grid horizontally', () => {
    const width = 1000;
    const layout = calculateGridLayout(width, 2000, 10, 5, 365);

    const cellSize = 20 + 5; // diameter + spacing
    const gridWidth = layout.columns * cellSize - 5;
    const expectedOffsetX = (width - gridWidth) / 2;

    expect(layout.offsetX).toBeCloseTo(expectedOffsetX, 0);
  });

  it('handles leap year (366 days)', () => {
    const layout = calculateGridLayout(1284, 2778, 12, 6, 366);

    expect(layout.columns * layout.rows).toBeGreaterThanOrEqual(366);
  });

  it('adjusts for different radius and spacing', () => {
    const layoutSmall = calculateGridLayout(1000, 2000, 8, 4, 365);
    const layoutLarge = calculateGridLayout(1000, 2000, 16, 8, 365);

    // Smaller circles should allow more columns
    expect(layoutSmall.columns).toBeGreaterThan(layoutLarge.columns);
  });
});
