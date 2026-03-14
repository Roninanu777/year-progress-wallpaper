import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ColorPicker from '@/components/ColorPicker';

describe('ColorPicker', () => {
  const mockOnChange = vi.fn();

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
});
