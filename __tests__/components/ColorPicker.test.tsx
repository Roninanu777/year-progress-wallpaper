import { render, screen, fireEvent } from '@testing-library/react';
import ColorPicker from '@/components/ColorPicker';

describe('ColorPicker', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with label', () => {
    render(
      <ColorPicker label="Background" color="#000000" onChange={mockOnChange} />
    );

    expect(screen.getByText('Background')).toBeInTheDocument();
  });

  it('displays color preview button with correct background', () => {
    render(
      <ColorPicker label="Background" color="#FF5733" onChange={mockOnChange} />
    );

    const colorButton = screen.getByRole('button', {
      name: /select background/i,
    });
    expect(colorButton).toHaveStyle({ backgroundColor: '#FF5733' });
  });

  it('opens color picker popover on button click', () => {
    render(
      <ColorPicker label="Background" color="#000000" onChange={mockOnChange} />
    );

    const colorButton = screen.getByRole('button', {
      name: /select background/i,
    });
    fireEvent.click(colorButton);

    // The react-colorful picker should be visible
    expect(document.querySelector('.react-colorful')).toBeInTheDocument();
  });

  it('closes popover on second click', () => {
    render(
      <ColorPicker label="Background" color="#000000" onChange={mockOnChange} />
    );

    const colorButton = screen.getByRole('button', {
      name: /select background/i,
    });

    // Open
    fireEvent.click(colorButton);
    expect(document.querySelector('.react-colorful')).toBeInTheDocument();

    // Close
    fireEvent.click(colorButton);
    expect(document.querySelector('.react-colorful')).not.toBeInTheDocument();
  });

  it('displays hex input field', () => {
    render(
      <ColorPicker label="Test" color="#ABCDEF" onChange={mockOnChange} />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('ABCDEF');
  });

  it('calls onChange when hex input changes', () => {
    render(
      <ColorPicker label="Test" color="#000000" onChange={mockOnChange} />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'FF0000' } });

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('closes popover when clicking outside', () => {
    render(
      <div>
        <ColorPicker label="Test" color="#000000" onChange={mockOnChange} />
        <button data-testid="outside">Outside</button>
      </div>
    );

    const colorButton = screen.getByRole('button', { name: /select test/i });
    fireEvent.click(colorButton);

    expect(document.querySelector('.react-colorful')).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(screen.getByTestId('outside'));

    expect(document.querySelector('.react-colorful')).not.toBeInTheDocument();
  });
});
