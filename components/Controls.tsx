'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import DeviceSection from '@/components/controls/DeviceSection';
import ThemeSection from '@/components/controls/ThemeSection';
import ColorSection from '@/components/controls/ColorSection';
import SizeSection from '@/components/controls/SizeSection';
import TextSection from '@/components/controls/TextSection';
import ActionButtons from '@/components/controls/ActionButtons';

export default function Controls() {
  return (
    <div className="space-y-4">
      <Accordion multiple defaultValue={['device', 'theme', 'colors', 'size', 'text']}>
        <AccordionItem value="device">
          <AccordionTrigger>Device & Style</AccordionTrigger>
          <AccordionContent>
            <DeviceSection />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="theme">
          <AccordionTrigger>Theme Presets</AccordionTrigger>
          <AccordionContent>
            <ThemeSection />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="colors">
          <AccordionTrigger>Colors</AccordionTrigger>
          <AccordionContent>
            <ColorSection />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="size">
          <AccordionTrigger>Size & Spacing</AccordionTrigger>
          <AccordionContent>
            <SizeSection />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="text">
          <AccordionTrigger>Text & Font</AccordionTrigger>
          <AccordionContent>
            <TextSection />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Separator />
      <ActionButtons />
    </div>
  );
}
