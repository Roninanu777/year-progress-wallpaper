'use client';

import { HexColorPicker, HexColorInput } from 'react-colorful';
import { useState, useRef, useEffect } from 'react';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ label, color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={popoverRef}>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-lg border-2 border-gray-600 cursor-pointer transition-transform hover:scale-105"
          style={{ backgroundColor: color }}
          aria-label={`Select ${label.toLowerCase()}`}
        />
        <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
          <span className="text-gray-400 mr-1">#</span>
          <HexColorInput
            color={color}
            onChange={onChange}
            className="w-20 bg-transparent text-white uppercase font-mono text-sm focus:outline-none"
            prefixed={false}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 p-3 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
}
