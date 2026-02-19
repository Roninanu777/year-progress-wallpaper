import { render, screen } from '@testing-library/react';
import DeviceFrame from '@/components/DeviceFrame';

describe('DeviceFrame', () => {
  it('renders children content', () => {
    render(
      <DeviceFrame aspectRatio={2.16}>
        <div data-testid="child-content">Test Content</div>
      </DeviceFrame>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders frame overlay image', () => {
    render(
      <DeviceFrame aspectRatio={2.16}>
        <div>Content</div>
      </DeviceFrame>
    );

    expect(screen.getByAltText('iPhone frame')).toBeInTheDocument();
  });

  it('renders a screen container for wallpaper content', () => {
    const { container } = render(
      <DeviceFrame aspectRatio={2.16}>
        <div>Content</div>
      </DeviceFrame>
    );

    const screenContainer = container.querySelector('.absolute.overflow-hidden.bg-black');
    expect(screenContainer).toBeInTheDocument();
    expect(screenContainer).toHaveStyle({ borderRadius: '38px' });
  });

  it('renders fixed frame dimensions', () => {
    const { container } = render(
      <DeviceFrame aspectRatio={2}>
        <div>Content</div>
      </DeviceFrame>
    );

    const frameContainer = container.querySelector('.relative[style*="width: 280px"]');
    expect(frameContainer).toBeInTheDocument();
  });
});
