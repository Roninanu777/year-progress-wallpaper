import '@testing-library/jest-dom';

if (typeof HTMLCanvasElement !== 'undefined') {
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: () => ({
      fillStyle: '#000000',
      strokeStyle: '#000000',
      lineWidth: 1,
      font: '',
      textAlign: 'left',
      textBaseline: 'alphabetic',
      fillRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn(),
      fillText: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      measureText: jest.fn(() => ({ width: 100 })),
    }),
  });
}
