import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

// Mock the components to isolate the page test
jest.mock('@/components/Preview', () => {
  return function MockPreview() {
    return <div data-testid="preview">Preview</div>;
  };
});

jest.mock('@/components/Controls', () => {
  return function MockControls() {
    return <div data-testid="controls">Controls</div>;
  };
});

jest.mock('@/components/ShortcutInstructions', () => {
  return function MockShortcutInstructions() {
    return <div data-testid="shortcut-instructions">Shortcut Instructions</div>;
  };
});

describe('Home Page', () => {
  it('renders the page header', () => {
    render(<Home />);

    expect(screen.getByText('Year Progress Wallpaper')).toBeInTheDocument();
  });

  it('displays year progress percentage', () => {
    render(<Home />);

    // Should show a percentage value
    expect(screen.getByText(/%$/)).toBeInTheDocument();
  });

  it('displays current day information', () => {
    render(<Home />);

    // Should show "Day X" and "X remaining"
    expect(screen.getByText(/Day \d+/)).toBeInTheDocument();
    expect(screen.getByText(/\d+ remaining/)).toBeInTheDocument();
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
