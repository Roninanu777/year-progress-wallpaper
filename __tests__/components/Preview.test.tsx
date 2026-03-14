import { render, screen } from '@testing-library/react';
import Preview from '@/components/Preview';
import { WallpaperProvider } from '@/lib/wallpaper-context';

function renderWithProvider() {
  return render(
    <WallpaperProvider>
      <Preview />
    </WallpaperProvider>
  );
}

describe('Preview', () => {
  it('renders device name and dimensions', () => {
    renderWithProvider();

    expect(screen.getByText(/iPhone 17/)).toBeInTheDocument();
    expect(screen.getByText(/1284/)).toBeInTheDocument();
    expect(screen.getByText(/2778/)).toBeInTheDocument();
  });

  it('renders wallpaper preview canvas', () => {
    renderWithProvider();

    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('renders within DeviceFrame', () => {
    const { container } = renderWithProvider();

    const frame = container.querySelector('img[alt="iPhone frame"]');
    expect(frame).toBeInTheDocument();
  });

  it('renders frame overlay image', () => {
    renderWithProvider();

    expect(screen.getByAltText('iPhone frame')).toBeInTheDocument();
  });

  it('uses smaller dimensions for preview performance', () => {
    renderWithProvider();
    const canvas = document.querySelector('canvas');

    expect(canvas).toHaveAttribute('width', '400');
  });
});
