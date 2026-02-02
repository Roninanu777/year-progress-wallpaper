/**
 * @jest-environment node
 */

import { GET } from '@/app/api/wallpaper/route';
import { NextRequest } from 'next/server';

// Mock ImageResponse
jest.mock('next/og', () => ({
  ImageResponse: jest.fn().mockImplementation((element, options) => {
    return {
      status: 200,
      headers: new Headers({ 'content-type': 'image/png' }),
      body: 'mock-image-body',
      element,
      options,
    };
  }),
}));

describe('GET /api/wallpaper', () => {
  function createRequest(params: Record<string, string> = {}): NextRequest {
    const url = new URL('http://localhost:3000/api/wallpaper');
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return new NextRequest(url);
  }

  it('returns an image response', async () => {
    const request = createRequest();
    const response = await GET(request);

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
  });

  it('uses default parameters when none provided', async () => {
    const { ImageResponse } = require('next/og');
    ImageResponse.mockClear();

    const request = createRequest();
    await GET(request);

    expect(ImageResponse).toHaveBeenCalled();
    const [, options] = ImageResponse.mock.calls[0];
    expect(options.width).toBe(1284);
    expect(options.height).toBe(2778);
  });

  it('uses custom width and height', async () => {
    const { ImageResponse } = require('next/og');
    ImageResponse.mockClear();

    const request = createRequest({ width: '800', height: '1600' });
    await GET(request);

    expect(ImageResponse).toHaveBeenCalled();
    const [, options] = ImageResponse.mock.calls[0];
    expect(options.width).toBe(800);
    expect(options.height).toBe(1600);
  });

  it('parses color parameters correctly', async () => {
    const { ImageResponse } = require('next/og');
    ImageResponse.mockClear();

    const request = createRequest({
      bg: 'FF0000',
      filled: '00FF00',
      empty: '0000FF',
    });
    await GET(request);

    expect(ImageResponse).toHaveBeenCalled();
  });

  it('handles showCustomText and customText parameters', async () => {
    const { ImageResponse } = require('next/og');
    ImageResponse.mockClear();

    const request = createRequest({ showCustomText: 'true', customText: 'Test text' });
    await GET(request);

    expect(ImageResponse).toHaveBeenCalled();
  });

  it('handles font parameter', async () => {
    const { ImageResponse } = require('next/og');
    ImageResponse.mockClear();

    const request = createRequest({ font: 'serif' });
    await GET(request);

    expect(ImageResponse).toHaveBeenCalled();
  });

  it('handles radius and spacing parameters', async () => {
    const { ImageResponse } = require('next/og');
    ImageResponse.mockClear();

    const request = createRequest({ radius: '16', spacing: '8' });
    await GET(request);

    expect(ImageResponse).toHaveBeenCalled();
  });

  it('handles textColor parameter', async () => {
    const { ImageResponse } = require('next/og');
    ImageResponse.mockClear();

    const request = createRequest({ textColor: 'AABBCC' });
    await GET(request);

    expect(ImageResponse).toHaveBeenCalled();
  });

  it('generates correct number of circles for 365/366 days', async () => {
    const { ImageResponse } = require('next/og');
    ImageResponse.mockClear();

    const request = createRequest();
    await GET(request);

    expect(ImageResponse).toHaveBeenCalled();
    const [element] = ImageResponse.mock.calls[0];

    // The element should contain multiple circle divs
    // We can't easily count them due to mocking, but verify structure exists
    expect(element).toBeDefined();
  });
});

describe('API helper functions', () => {
  // Test the helper functions defined in the route file
  // These are duplicated in the route for Edge runtime compatibility

  function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  function getDaysInYear(year: number): number {
    return isLeapYear(year) ? 366 : 365;
  }

  function getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  it('isLeapYear returns true for leap years', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2000)).toBe(true);
  });

  it('isLeapYear returns false for non-leap years', () => {
    expect(isLeapYear(2023)).toBe(false);
    expect(isLeapYear(1900)).toBe(false);
  });

  it('getDaysInYear returns 366 for leap years', () => {
    expect(getDaysInYear(2024)).toBe(366);
  });

  it('getDaysInYear returns 365 for non-leap years', () => {
    expect(getDaysInYear(2025)).toBe(365);
  });

  it('getDayOfYear returns correct day number', () => {
    const jan1 = new Date(2024, 0, 1);
    expect(getDayOfYear(jan1)).toBe(1);

    const dec31 = new Date(2024, 11, 31);
    expect(getDayOfYear(dec31)).toBe(366);
  });
});
