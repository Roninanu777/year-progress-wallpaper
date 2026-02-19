import {
  DEVICE_PRESETS,
  DEFAULT_SETTINGS,
  PRESET_THEMES,
  GRID_CONFIG,
  FONT_OPTIONS,
} from '@/lib/constants';

describe('DEVICE_PRESETS', () => {
  it('contains expected device keys', () => {
    expect(DEVICE_PRESETS).toHaveProperty('iphone-17');
    expect(DEVICE_PRESETS).toHaveProperty('iphone-17-pro');
    expect(DEVICE_PRESETS).toHaveProperty('iphone-17-pro-max');
    expect(DEVICE_PRESETS).toHaveProperty('iphone-16-pro-max');
    expect(DEVICE_PRESETS).toHaveProperty('iphone-15-pro');
  });

  it('has valid dimensions for all devices', () => {
    Object.values(DEVICE_PRESETS).forEach((device) => {
      expect(device.width).toBeGreaterThan(0);
      expect(device.height).toBeGreaterThan(0);
      expect(device.height).toBeGreaterThan(device.width); // Portrait mode
      expect(device.name).toBeDefined();
      expect(typeof device.name).toBe('string');
    });
  });

  it('has correct iPhone 17 dimensions', () => {
    expect(DEVICE_PRESETS['iphone-17']).toEqual({
      width: 1284,
      height: 2778,
      name: 'iPhone 17',
    });
  });
});

describe('DEFAULT_SETTINGS', () => {
  it('has all required settings', () => {
    expect(DEFAULT_SETTINGS).toHaveProperty('device');
    expect(DEFAULT_SETTINGS).toHaveProperty('bgColor');
    expect(DEFAULT_SETTINGS).toHaveProperty('filledColor');
    expect(DEFAULT_SETTINGS).toHaveProperty('emptyColor');
    expect(DEFAULT_SETTINGS).toHaveProperty('radius');
    expect(DEFAULT_SETTINGS).toHaveProperty('spacing');
    expect(DEFAULT_SETTINGS).toHaveProperty('textColor');
    expect(DEFAULT_SETTINGS).toHaveProperty('showCustomText');
    expect(DEFAULT_SETTINGS).toHaveProperty('customText');
    expect(DEFAULT_SETTINGS).toHaveProperty('font');
  });

  it('has valid default device', () => {
    expect(DEVICE_PRESETS).toHaveProperty(DEFAULT_SETTINGS.device);
  });

  it('has valid hex colors', () => {
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    expect(DEFAULT_SETTINGS.bgColor).toMatch(hexPattern);
    expect(DEFAULT_SETTINGS.filledColor).toMatch(hexPattern);
    expect(DEFAULT_SETTINGS.emptyColor).toMatch(hexPattern);
    expect(DEFAULT_SETTINGS.textColor).toMatch(hexPattern);
  });

  it('has positive radius and spacing', () => {
    expect(DEFAULT_SETTINGS.radius).toBeGreaterThan(0);
    expect(DEFAULT_SETTINGS.spacing).toBeGreaterThan(0);
  });

  it('has boolean showCustomText', () => {
    expect(typeof DEFAULT_SETTINGS.showCustomText).toBe('boolean');
  });

  it('has string customText', () => {
    expect(typeof DEFAULT_SETTINGS.customText).toBe('string');
  });

  it('has valid font', () => {
    expect(FONT_OPTIONS).toHaveProperty(DEFAULT_SETTINGS.font);
  });
});

describe('PRESET_THEMES', () => {
  it('contains expected themes', () => {
    expect(PRESET_THEMES).toHaveProperty('minimal');
    expect(PRESET_THEMES).toHaveProperty('neon');
    expect(PRESET_THEMES).toHaveProperty('ocean');
    expect(PRESET_THEMES).toHaveProperty('sunset');
    expect(PRESET_THEMES).toHaveProperty('lavender');
    expect(PRESET_THEMES).toHaveProperty('midnight');
  });

  it('has valid color values for all themes', () => {
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;

    Object.values(PRESET_THEMES).forEach((theme) => {
      expect(theme.name).toBeDefined();
      expect(typeof theme.name).toBe('string');
      expect(theme.bgColor).toMatch(hexPattern);
      expect(theme.filledColor).toMatch(hexPattern);
      expect(theme.emptyColor).toMatch(hexPattern);
      expect(theme.textColor).toMatch(hexPattern);
    });
  });

  it('minimal theme uses black and white', () => {
    expect(PRESET_THEMES.minimal.bgColor).toBe('#000000');
    expect(PRESET_THEMES.minimal.filledColor).toBe('#FFFFFF');
  });
});

describe('GRID_CONFIG', () => {
  it('has valid columns and rows', () => {
    expect(GRID_CONFIG.columns).toBeGreaterThan(0);
    expect(GRID_CONFIG.rows).toBeGreaterThan(0);
  });

  it('can accommodate at least 366 days', () => {
    const totalCells = GRID_CONFIG.columns * GRID_CONFIG.rows;
    expect(totalCells).toBeGreaterThanOrEqual(366);
  });
});

describe('FONT_OPTIONS', () => {
  it('contains expected font keys', () => {
    expect(FONT_OPTIONS).toHaveProperty('Inter');
    expect(FONT_OPTIONS).toHaveProperty('Playfair Display');
    expect(FONT_OPTIONS).toHaveProperty('Roboto Mono');
    expect(FONT_OPTIONS).toHaveProperty('Lora');
    expect(FONT_OPTIONS).toHaveProperty('Oswald');
    expect(FONT_OPTIONS).toHaveProperty('sans-serif');
    expect(FONT_OPTIONS).toHaveProperty('serif');
    expect(FONT_OPTIONS).toHaveProperty('monospace');
  });

  it('has string names for all fonts', () => {
    Object.values(FONT_OPTIONS).forEach((name) => {
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(0);
    });
  });

  it('has expected display names', () => {
    expect(FONT_OPTIONS['Inter']).toBe('Inter');
    expect(FONT_OPTIONS['Lora']).toBe('Lora');
    expect(FONT_OPTIONS['sans-serif']).toBe('Sans Serif');
  });
});
