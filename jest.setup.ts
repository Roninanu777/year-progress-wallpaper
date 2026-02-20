import '@testing-library/jest-dom';

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
