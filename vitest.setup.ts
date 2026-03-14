import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Alias jest globals to vitest equivalents so existing tests work without modification
globalThis.jest = vi;

if (typeof HTMLCanvasElement !== 'undefined') {
  const noop = () => undefined;

  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: () => ({
      fillStyle: '#000000',
      strokeStyle: '#000000',
      lineWidth: 1,
      font: '',
      textAlign: 'left',
      textBaseline: 'alphabetic',
      fillRect: noop,
      beginPath: noop,
      arc: noop,
      fill: noop,
      stroke: noop,
      fillText: noop,
      moveTo: noop,
      lineTo: noop,
      measureText: () => ({ width: 100 }),
    }),
  });
}
