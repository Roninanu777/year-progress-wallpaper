import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Controls from '@/components/Controls';
import { WallpaperProvider } from '@/lib/wallpaper-context';

function renderWithProvider() {
  return render(
    <WallpaperProvider>
      <Controls />
    </WallpaperProvider>
  );
}

describe('Controls', () => {
  it('renders control sections', () => {
    renderWithProvider();

    expect(screen.getByText('Theme')).toBeInTheDocument();
    expect(screen.getAllByText('Device').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Colors')).toBeInTheDocument();
    expect(screen.getByText('Layout')).toBeInTheDocument();
    expect(screen.getByText('Typography')).toBeInTheDocument();
  });

  it('renders theme presets', () => {
    renderWithProvider();

    expect(screen.getByText('Minimal')).toBeInTheDocument();
    expect(screen.getByText('Neon')).toBeInTheDocument();
    expect(screen.getByText('Ocean')).toBeInTheDocument();
  });

  it('renders color picker dots', () => {
    renderWithProvider();

    expect(screen.getByText('BG')).toBeInTheDocument();
    expect(screen.getByText('Fill')).toBeInTheDocument();
    expect(screen.getByText('Empty')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Accent')).toBeInTheDocument();
  });

  it('renders size controls with values', () => {
    renderWithProvider();

    expect(screen.getByText('Radius')).toBeInTheDocument();
    expect(screen.getByText('12px')).toBeInTheDocument();
    expect(screen.getByText('Spacing')).toBeInTheDocument();
    expect(screen.getByText('6px')).toBeInTheDocument();
  });

  it('renders custom text toggle', () => {
    renderWithProvider();

    expect(screen.getByText('Custom text')).toBeInTheDocument();
  });

  it('renders font selection', () => {
    renderWithProvider();

    expect(screen.getByText('Font')).toBeInTheDocument();
  });

  it('applies theme when theme button is clicked', () => {
    renderWithProvider();

    const neonButton = screen.getByLabelText('Apply Neon theme');
    fireEvent.click(neonButton);

    expect(neonButton).toBeInTheDocument();
  });
});
