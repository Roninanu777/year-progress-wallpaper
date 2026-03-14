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
      <ColorPicker label="BG" color="#000000" onChange={mockOnChange} />
    );

    expect(screen.getByText('BG')).toBeInTheDocument();
  });

  it('renders color dot button with correct background', () => {
    render(
      <ColorPicker label="BG" color="#FF5733" onChange={mockOnChange} />
    );

    const colorButton = screen.getByRole('button', { name: /change bg color/i });
    expect(colorButton).toHaveStyle({ backgroundColor: '#FF5733' });
  });

  it('renders the color dot trigger', () => {
    render(
      <ColorPicker label="Fill" color="#ABCDEF" onChange={mockOnChange} />
    );

    const button = screen.getByRole('button', { name: /change fill color/i });
    expect(button).toBeInTheDocument();
  });
});
