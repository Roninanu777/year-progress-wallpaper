import { render, screen, fireEvent } from '@testing-library/react';
import ShortcutInstructions from '@/components/ShortcutInstructions';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

describe('ShortcutInstructions', () => {
  const testApiUrl = 'https://example.com/api/wallpaper?width=1284&height=2778';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders collapsed by default', () => {
    render(<ShortcutInstructions apiUrl={testApiUrl} />);

    expect(screen.getByText('iOS Shortcut Setup')).toBeInTheDocument();
    expect(
      screen.getByText('Automate daily wallpaper updates')
    ).toBeInTheDocument();

    // Instructions should not be visible
    expect(screen.queryByText('Setup Instructions:')).not.toBeInTheDocument();
  });

  it('expands when clicked', () => {
    render(<ShortcutInstructions apiUrl={testApiUrl} />);

    const expandButton = screen.getByRole('button');
    fireEvent.click(expandButton);

    expect(screen.getByText('Setup Instructions:')).toBeInTheDocument();
  });

  it('shows API URL when expanded', () => {
    render(<ShortcutInstructions apiUrl={testApiUrl} />);

    const expandButton = screen.getByRole('button');
    fireEvent.click(expandButton);

    expect(screen.getByText(testApiUrl)).toBeInTheDocument();
  });

  it('displays all setup steps when expanded', () => {
    render(<ShortcutInstructions apiUrl={testApiUrl} />);

    const expandButton = screen.getByRole('button');
    fireEvent.click(expandButton);

    // Use getByText with a function to handle text split across elements
    expect(screen.getByText((_, element) => element?.textContent === 'Open the Shortcuts app on your iPhone')).toBeInTheDocument();
    expect(screen.getByText('Shortcuts')).toBeInTheDocument();
    expect(screen.getByText('Get Contents of URL')).toBeInTheDocument();
    expect(screen.getByText('Set Wallpaper')).toBeInTheDocument();
  });

  it('shows daily automation section when expanded', () => {
    render(<ShortcutInstructions apiUrl={testApiUrl} />);

    const expandButton = screen.getByRole('button');
    fireEvent.click(expandButton);

    expect(screen.getByText(/Daily Automation \(Optional\):/)).toBeInTheDocument();
    expect(screen.getByText('Automation')).toBeInTheDocument();
  });

  it('shows pro tip when expanded', () => {
    render(<ShortcutInstructions apiUrl={testApiUrl} />);

    const expandButton = screen.getByRole('button');
    fireEvent.click(expandButton);

    expect(screen.getByText(/Pro tip:/)).toBeInTheDocument();
  });

  it('copies URL to clipboard when copy button is clicked', async () => {
    render(<ShortcutInstructions apiUrl={testApiUrl} />);

    const expandButton = screen.getByRole('button');
    fireEvent.click(expandButton);

    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testApiUrl);
  });

  it('shows "Copied!" feedback after copying', async () => {
    jest.useFakeTimers();

    render(<ShortcutInstructions apiUrl={testApiUrl} />);

    const expandButton = screen.getByRole('button');
    fireEvent.click(expandButton);

    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);

    expect(screen.getByText('Copied!')).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('collapses when clicked again', () => {
    render(<ShortcutInstructions apiUrl={testApiUrl} />);

    const expandButton = screen.getByRole('button');

    // Expand
    fireEvent.click(expandButton);
    expect(screen.getByText('Setup Instructions:')).toBeInTheDocument();

    // Collapse
    fireEvent.click(expandButton);
    expect(screen.queryByText('Setup Instructions:')).not.toBeInTheDocument();
  });

  it('shows placeholder when no API URL provided', () => {
    render(<ShortcutInstructions apiUrl="" />);

    const expandButton = screen.getByRole('button');
    fireEvent.click(expandButton);

    expect(
      screen.getByText('Configure your wallpaper to generate URL')
    ).toBeInTheDocument();
  });

  it('disables copy button when no API URL', () => {
    render(<ShortcutInstructions apiUrl="" />);

    const expandButton = screen.getByRole('button');
    fireEvent.click(expandButton);

    const copyButton = screen.getByRole('button', { name: /copy/i });
    expect(copyButton).toBeDisabled();
  });
});
