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

  it('applies correct aspect ratio to screen', () => {
    const { container } = render(
      <DeviceFrame aspectRatio={2.16}>
        <div>Content</div>
      </DeviceFrame>
    );

    const screen = container.querySelector('.rounded-\\[2\\.5rem\\]');
    expect(screen).toHaveStyle({ aspectRatio: '1 / 2.16' });
  });

  it('renders with device frame styling', () => {
    const { container } = render(
      <DeviceFrame aspectRatio={2}>
        <div>Content</div>
      </DeviceFrame>
    );

    // Check for the outer frame container
    const frame = container.querySelector('.rounded-\\[3rem\\]');
    expect(frame).toBeInTheDocument();
  });

  it('renders notch/dynamic island', () => {
    const { container } = render(
      <DeviceFrame aspectRatio={2}>
        <div>Content</div>
      </DeviceFrame>
    );

    // Check for the notch element (w-28 h-7 rounded-full bg-black)
    const notch = container.querySelector('.w-28.h-7.rounded-full.bg-black');
    expect(notch).toBeInTheDocument();
  });

  it('renders home indicator', () => {
    const { container } = render(
      <DeviceFrame aspectRatio={2}>
        <div>Content</div>
      </DeviceFrame>
    );

    // Check for the home indicator (w-32 h-1 rounded-full)
    const homeIndicator = container.querySelector('.w-32.h-1.rounded-full');
    expect(homeIndicator).toBeInTheDocument();
  });
});
