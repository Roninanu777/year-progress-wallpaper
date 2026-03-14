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

vi.mock('@/components/ThemeToggle', () => ({
  default: function MockThemeToggle() {
    return <div data-testid="theme-toggle">Theme Toggle</div>;
  },
}));

vi.mock('@/components/controls/ActionButtons', () => ({
  default: function MockActionButtons() {
    return <div data-testid="action-buttons">Action Buttons</div>;
  },
}));

import Home from '@/app/page';

describe('Home Page', () => {
  it('renders the brand name', () => {
    render(<Home />);
    expect(screen.getByText('Live Calendar')).toBeInTheDocument();
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

  it('renders the sidebar header', () => {
    render(<Home />);
    expect(screen.getByText('Customize')).toBeInTheDocument();
    expect(screen.getByText('Configure your wallpaper')).toBeInTheDocument();
  });

  it('renders the mode toggle', () => {
    render(<Home />);
    expect(screen.getByTestId('mode-toggle')).toBeInTheDocument();
  });

  it('renders the theme toggle', () => {
    render(<Home />);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });
});
