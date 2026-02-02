/**
 * Check if a year is a leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Get the total number of days in a year
 */
export function getDaysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

/**
 * Get the current day of the year (1-indexed)
 */
export function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Get days remaining in the year
 */
export function getDaysRemaining(date: Date = new Date()): number {
  const totalDays = getDaysInYear(date.getFullYear());
  const dayOfYear = getDayOfYear(date);
  return totalDays - dayOfYear;
}

/**
 * Get year progress as a percentage
 */
export function getYearProgress(date: Date = new Date()): number {
  const totalDays = getDaysInYear(date.getFullYear());
  const dayOfYear = getDayOfYear(date);
  return (dayOfYear / totalDays) * 100;
}

/**
 * Convert hex color to a format without #
 */
export function hexToParam(hex: string): string {
  return hex.replace('#', '');
}

/**
 * Convert param to hex color with #
 */
export function paramToHex(param: string): string {
  return param.startsWith('#') ? param : `#${param}`;
}

/**
 * Generate API URL with current settings
 */
export function generateApiUrl(
  baseUrl: string,
  settings: {
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
  }
): string {
  const params = new URLSearchParams({
    width: settings.width.toString(),
    height: settings.height.toString(),
    bg: hexToParam(settings.bgColor),
    filled: hexToParam(settings.filledColor),
    empty: hexToParam(settings.emptyColor),
    radius: settings.radius.toString(),
    spacing: settings.spacing.toString(),
    textColor: hexToParam(settings.textColor),
    showCustomText: settings.showCustomText.toString(),
    customText: settings.customText,
    font: settings.font,
  });

  return `${baseUrl}/api/wallpaper?${params.toString()}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Calculate optimal grid layout based on device dimensions
 */
export function calculateGridLayout(
  width: number,
  height: number,
  radius: number,
  spacing: number,
  totalDays: number
): { columns: number; rows: number; offsetX: number; offsetY: number } {
  const diameter = radius * 2;
  const cellSize = diameter + spacing;

  // Calculate how many columns fit
  const availableWidth = width * 0.85; // Use 85% of width for padding
  const columns = Math.floor(availableWidth / cellSize);

  // Calculate rows needed
  const rows = Math.ceil(totalDays / columns);

  // Calculate offsets to center the grid
  const gridWidth = columns * cellSize - spacing;
  const gridHeight = rows * cellSize - spacing;

  const offsetX = (width - gridWidth) / 2;
  const offsetY = (height - gridHeight) / 2;

  return { columns, rows, offsetX, offsetY };
}
