import { render, screen, waitFor } from '@testing-library/react';
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

  it('shows loading spinner initially', () => {
    render(<Preview {...defaultProps} />);

    // Should have a spinning loader (animate-spin class)
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders wallpaper preview image', async () => {
    render(<Preview {...defaultProps} />);

    await waitFor(() => {
      const img = screen.getByAltText('Wallpaper preview');
      expect(img).toBeInTheDocument();
    });
  });

  it('updates preview when props change', async () => {
    const { rerender } = render(<Preview {...defaultProps} />);

    await waitFor(() => {
      const img = screen.getByAltText('Wallpaper preview');
      expect(img).toBeInTheDocument();
    });

    const initialImg = screen.getByAltText('Wallpaper preview');
    const initialSrc = initialImg.getAttribute('src');

    // Change a prop
    rerender(<Preview {...defaultProps} bgColor="#FF0000" />);

    await waitFor(() => {
      const img = screen.getByAltText('Wallpaper preview');
      expect(img.getAttribute('src')).not.toBe(initialSrc);
    });
  });

  it('renders within DeviceFrame', () => {
    const { container } = render(<Preview {...defaultProps} />);

    // Check for DeviceFrame's rounded corners class
    const frame = container.querySelector('.rounded-\\[3rem\\]');
    expect(frame).toBeInTheDocument();
  });

  it('generates preview URL with correct parameters', async () => {
    render(<Preview {...defaultProps} />);

    await waitFor(() => {
      const img = screen.getByAltText('Wallpaper preview');
      const src = img.getAttribute('src');

      expect(src).toContain('/api/wallpaper');
      expect(src).toContain('bg=000000');
      expect(src).toContain('filled=FFFFFF');
      expect(src).toContain('empty=333333');
    });
  });

  it('uses smaller dimensions for preview performance', async () => {
    render(<Preview {...defaultProps} />);

    await waitFor(() => {
      const img = screen.getByAltText('Wallpaper preview');
      const src = img.getAttribute('src');

      // Should use preview dimensions (400px width) not full device dimensions
      expect(src).toContain('width=400');
    });
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
