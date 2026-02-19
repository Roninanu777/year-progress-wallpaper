import { render, screen } from '@testing-library/react';
import Preview from '@/components/Preview';
import { DEFAULT_SETTINGS } from '@/lib/constants';

describe('Preview', () => {
  const defaultProps = {
    device: DEFAULT_SETTINGS.device,
    bgColor: DEFAULT_SETTINGS.bgColor,
    filledColor: DEFAULT_SETTINGS.filledColor,
    emptyColor: DEFAULT_SETTINGS.emptyColor,
    radius: DEFAULT_SETTINGS.radius,
    spacing: DEFAULT_SETTINGS.spacing,
    textColor: DEFAULT_SETTINGS.textColor,
    showCustomText: DEFAULT_SETTINGS.showCustomText,
    customText: DEFAULT_SETTINGS.customText,
    font: DEFAULT_SETTINGS.font,
  };

  it('renders device name and dimensions', () => {
    render(<Preview {...defaultProps} />);

    expect(screen.getByText(/iPhone 17/)).toBeInTheDocument();
    expect(screen.getByText(/1284 × 2778/)).toBeInTheDocument();
  });

  it('renders wallpaper preview canvas', () => {
    render(<Preview {...defaultProps} />);

    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('re-renders canvas when props change', () => {
    const { rerender } = render(<Preview {...defaultProps} />);
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas).toBeInTheDocument();

    rerender(<Preview {...defaultProps} bgColor="#FF0000" />);
    const updatedCanvas = document.querySelector('canvas');
    expect(updatedCanvas).toBeInTheDocument();
  });

  it('renders within DeviceFrame', () => {
    const { container } = render(<Preview {...defaultProps} />);

    const frame = container.querySelector('img[alt="iPhone frame"]');
    expect(frame).toBeInTheDocument();
  });

  it('renders frame overlay image', () => {
    render(<Preview {...defaultProps} />);

    expect(screen.getByAltText('iPhone frame')).toBeInTheDocument();
  });

  it('uses smaller dimensions for preview performance', () => {
    render(<Preview {...defaultProps} />);
    const canvas = document.querySelector('canvas');

    expect(canvas).toHaveAttribute('width', '400');
  });

  it('displays different device info when device prop changes', () => {
    const { rerender } = render(<Preview {...defaultProps} />);

    expect(screen.getByText(/iPhone 17/)).toBeInTheDocument();
    expect(screen.getByText(/1284 × 2778/)).toBeInTheDocument();

    rerender(<Preview {...defaultProps} device="iphone-17-pro" />);

    expect(screen.getByText(/iPhone 17 Pro/)).toBeInTheDocument();
    expect(screen.getByText(/1206 × 2622/)).toBeInTheDocument();
  });
});
