import { render, screen, fireEvent } from '@testing-library/react';
import Controls from '@/components/Controls';
import { DEFAULT_SETTINGS } from '@/lib/constants';

describe('Controls', () => {
  const mockProps = {
    device: DEFAULT_SETTINGS.device,
    setDevice: jest.fn(),
    bgColor: DEFAULT_SETTINGS.bgColor,
    setBgColor: jest.fn(),
    filledColor: DEFAULT_SETTINGS.filledColor,
    setFilledColor: jest.fn(),
    emptyColor: DEFAULT_SETTINGS.emptyColor,
    setEmptyColor: jest.fn(),
    radius: DEFAULT_SETTINGS.radius,
    setRadius: jest.fn(),
    spacing: DEFAULT_SETTINGS.spacing,
    setSpacing: jest.fn(),
    textColor: DEFAULT_SETTINGS.textColor,
    setTextColor: jest.fn(),
    accentColor: DEFAULT_SETTINGS.accentColor,
    setAccentColor: jest.fn(),
    showCustomText: DEFAULT_SETTINGS.showCustomText,
    setShowCustomText: jest.fn(),
    customText: DEFAULT_SETTINGS.customText,
    setCustomText: jest.fn(),
    font: DEFAULT_SETTINGS.font,
    setFont: jest.fn(),
    monthStyle: DEFAULT_SETTINGS.monthStyle,
    setMonthStyle: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders device selection', () => {
    render(<Controls {...mockProps} />);

    expect(screen.getByText('Device')).toBeInTheDocument();
    expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(1);
  });

  it('renders theme presets', () => {
    render(<Controls {...mockProps} />);

    expect(screen.getByText('Theme Presets')).toBeInTheDocument();
    expect(screen.getByText('Minimal')).toBeInTheDocument();
    expect(screen.getByText('Neon')).toBeInTheDocument();
    expect(screen.getByText('Ocean')).toBeInTheDocument();
  });

  it('renders color pickers', () => {
    render(<Controls {...mockProps} />);

    expect(screen.getByText('Colors')).toBeInTheDocument();
    expect(screen.getByText('Background')).toBeInTheDocument();
    expect(screen.getByText('Filled Circles (Days Passed)')).toBeInTheDocument();
    expect(screen.getByText('Empty Circles (Days Remaining)')).toBeInTheDocument();
  });

  it('renders size controls', () => {
    render(<Controls {...mockProps} />);

    expect(screen.getByText('Size')).toBeInTheDocument();
    expect(screen.getByText(/Circle Radius:/)).toBeInTheDocument();
    expect(screen.getByText(/Spacing:/)).toBeInTheDocument();
  });

  it('renders custom text checkbox', () => {
    render(<Controls {...mockProps} />);

    expect(screen.getByText('Options')).toBeInTheDocument();
    expect(screen.getByText(/Add custom text/)).toBeInTheDocument();
  });

  it('renders font dropdown', () => {
    render(<Controls {...mockProps} />);

    expect(screen.getByText('Font')).toBeInTheDocument();
    expect(screen.getByText('Sans Serif')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<Controls {...mockProps} />);

    expect(
      screen.getByRole('button', { name: /download wallpaper/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /copy api url/i })
    ).toBeInTheDocument();
  });

  it('calls setDevice when device is changed', () => {
    render(<Controls {...mockProps} />);

    const selects = screen.getAllByRole('combobox');
    const deviceSelect = selects[0]; // First combobox is device
    fireEvent.change(deviceSelect, { target: { value: 'iphone-17-pro' } });

    expect(mockProps.setDevice).toHaveBeenCalledWith('iphone-17-pro');
  });

  it('calls setRadius when slider is changed', () => {
    render(<Controls {...mockProps} />);

    const sliders = screen.getAllByRole('slider');
    const radiusSlider = sliders[0];

    fireEvent.change(radiusSlider, { target: { value: '16' } });

    expect(mockProps.setRadius).toHaveBeenCalledWith(16);
  });

  it('calls setSpacing when slider is changed', () => {
    render(<Controls {...mockProps} />);

    const sliders = screen.getAllByRole('slider');
    const spacingSlider = sliders[1];

    fireEvent.change(spacingSlider, { target: { value: '10' } });

    expect(mockProps.setSpacing).toHaveBeenCalledWith(10);
  });

  it('calls setShowCustomText when checkbox is toggled', () => {
    render(<Controls {...mockProps} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockProps.setShowCustomText).toHaveBeenCalledWith(true);
  });

  it('calls setFont when font dropdown is changed', () => {
    render(<Controls {...mockProps} />);

    const fontSelect = screen.getAllByRole('combobox')[1]; // Second combobox is font
    fireEvent.change(fontSelect, { target: { value: 'serif' } });

    expect(mockProps.setFont).toHaveBeenCalledWith('serif');
  });

  it('applies theme when theme button is clicked', () => {
    render(<Controls {...mockProps} />);

    const neonButton = screen.getByText('Neon').closest('button');
    fireEvent.click(neonButton!);

    expect(mockProps.setBgColor).toHaveBeenCalledWith('#0a0a0a');
    expect(mockProps.setFilledColor).toHaveBeenCalledWith('#22c55e');
    expect(mockProps.setEmptyColor).toHaveBeenCalledWith('#1a1a1a');
    expect(mockProps.setTextColor).toHaveBeenCalledWith('#22c55e');
    expect(mockProps.setAccentColor).toHaveBeenCalledWith('#4ade80');
  });

  it('always shows text color picker', () => {
    const { unmount } = render(<Controls {...mockProps} showCustomText={false} />);
    expect(screen.getByText('Text Color')).toBeInTheDocument();
    unmount();

    render(<Controls {...mockProps} showCustomText={true} />);
    expect(screen.getByText('Text Color')).toBeInTheDocument();
  });

  it('shows custom text input when showCustomText is true', () => {
    render(<Controls {...mockProps} showCustomText={true} />);

    expect(screen.getByText('Custom Text')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter text to display/)).toBeInTheDocument();
  });

  it('hides custom text input when showCustomText is false', () => {
    render(<Controls {...mockProps} showCustomText={false} />);

    expect(screen.queryByText('Custom Text')).not.toBeInTheDocument();
  });

  it('calls setCustomText when custom text input is changed', () => {
    render(<Controls {...mockProps} showCustomText={true} />);

    const input = screen.getByPlaceholderText(/Enter text to display/);
    fireEvent.change(input, { target: { value: 'My custom text' } });

    expect(mockProps.setCustomText).toHaveBeenCalledWith('My custom text');
  });

  it('displays current radius value', () => {
    render(<Controls {...mockProps} radius={18} />);

    expect(screen.getByText('Circle Radius: 18px')).toBeInTheDocument();
  });

  it('displays current spacing value', () => {
    render(<Controls {...mockProps} spacing={8} />);

    expect(screen.getByText('Spacing: 8px')).toBeInTheDocument();
  });

  it('shows month style selector in month mode', () => {
    render(<Controls {...mockProps} mode="month" />);

    expect(screen.getByText('Calendar Style')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Glass Card')).toBeInTheDocument();
  });

  it('calls setMonthStyle when month style changes', () => {
    render(<Controls {...mockProps} mode="month" />);

    const monthStyleSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(monthStyleSelect, { target: { value: 'bold' } });

    expect(mockProps.setMonthStyle).toHaveBeenCalledWith('bold');
  });
});
