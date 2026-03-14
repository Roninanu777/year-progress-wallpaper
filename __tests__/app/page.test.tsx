import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock the components to isolate the page test
vi.mock('@/components/Preview', () => ({
  default: function MockPreview() {
    return <div data-testid="preview">Preview</div>;
  },
}));

vi.mock('@/components/Controls', () => ({
  default: function MockControls() {
    return <div data-testid="controls">Controls</div>;
  },
}));

vi.mock('@/components/ShortcutInstructions', () => ({
  default: function MockShortcutInstructions() {
    return <div data-testid="shortcut-instructions">Shortcut Instructions</div>;
  },
}));

vi.mock('@/components/ModeToggle', () => ({
  default: function MockModeToggle() {
    return <div data-testid="mode-toggle">Mode Toggle</div>;
  },
}));

vi.mock('@/components/ProgressBadge', () => ({
  default: function MockProgressBadge() {
    return <div data-testid="progress-badge">20.0%</div>;
  },
}));

vi.mock('@/components/MobileControlsSheet', () => ({
  default: function MockMobileControlsSheet() {
    return <div data-testid="mobile-sheet">Mobile Sheet</div>;
  },
}));

import Home from '@/app/page';

describe('Home Page', () => {
  it('renders the page header', () => {
    render(<Home />);

    expect(screen.getByText('Year Progress Wallpaper')).toBeInTheDocument();
  });

  it('renders the Preview component', () => {
    render(<Home />);

    expect(screen.getByTestId('preview')).toBeInTheDocument();
  });

  it('renders the Controls component', () => {
    render(<Home />);

    expect(screen.getByTestId('controls')).toBeInTheDocument();
  });

  it('renders the ShortcutInstructions component', () => {
    render(<Home />);

    expect(screen.getByTestId('shortcut-instructions')).toBeInTheDocument();
  });

  it('renders section headers', () => {
    render(<Home />);

    expect(screen.getByText('Live Preview')).toBeInTheDocument();
    expect(screen.getByText('Customize Your Wallpaper')).toBeInTheDocument();
  });

  it('renders the footer', () => {
    render(<Home />);

    expect(
      screen.getByText(/Generate beautiful year-progress wallpapers/)
    ).toBeInTheDocument();
  });

  it('shows description text in header', () => {
    render(<Home />);

    expect(
      screen.getByText('Visualize your year with a customizable circle grid')
    ).toBeInTheDocument();
  });
});
