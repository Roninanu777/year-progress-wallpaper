'use client';

import ControlSection from '@/components/ControlSection';
import ThemeSection from '@/components/controls/ThemeSection';
import DeviceSection from '@/components/controls/DeviceSection';
import ColorSection from '@/components/controls/ColorSection';
import SizeSection from '@/components/controls/SizeSection';
import TextSection from '@/components/controls/TextSection';

export default function Controls() {
  return (
    <div className="space-y-6">
      <ControlSection label="Theme">
        <ThemeSection />
      </ControlSection>

      <ControlSection label="Device">
        <DeviceSection />
      </ControlSection>

      <ControlSection label="Colors">
        <ColorSection />
      </ControlSection>

      <ControlSection label="Layout">
        <SizeSection />
      </ControlSection>

      <ControlSection label="Typography">
        <TextSection />
      </ControlSection>
    </div>
  );
}
