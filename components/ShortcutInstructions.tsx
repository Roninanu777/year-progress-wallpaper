'use client';

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';

interface ShortcutInstructionsProps {
  apiUrl: string;
}

export default function ShortcutInstructions({ apiUrl }: ShortcutInstructionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl bg-card/50 border border-border">
      <Accordion defaultValue={[]}>
        <AccordionItem value="instructions" className="border-none">
          <AccordionTrigger className="hover:no-underline px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-primary" />
              </div>
              <div className="text-left">
                <div className="text-[13px] font-semibold text-foreground">iOS Shortcut Setup</div>
                <div className="text-[11px] text-muted-foreground">Auto-update your wallpaper daily</div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4 pt-2">
              {/* API URL */}
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-[11px] text-muted-foreground mb-2">Your personalized API URL:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-[11px] text-primary break-all font-mono">
                    {apiUrl || 'Configure your wallpaper to generate URL'}
                  </code>
                  <Button
                    onClick={handleCopy}
                    disabled={!apiUrl}
                    variant="secondary"
                    size="sm"
                    className="text-[11px]"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>

              {/* Required setting */}
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-[12px] text-destructive">
                  <strong>Required:</strong> In <strong>Set Wallpaper</strong>, turn <strong>Show Preview</strong> off.
                </p>
              </div>

              {/* Instructions */}
              <div className="space-y-3">
                <h4 className="text-[13px] font-medium text-foreground">Setup Instructions:</h4>
                <ol className="space-y-2.5 text-[12px] text-muted-foreground">
                  {[
                    <>Open the <strong className="text-foreground">Shortcuts</strong> app on your iPhone</>,
                    <>Tap <strong className="text-foreground">+</strong> to create a new shortcut</>,
                    <>Add <strong className="text-foreground">URL</strong> action and paste your API URL</>,
                    <>Add <strong className="text-foreground">Get Contents of URL</strong> action</>,
                    <>Add <strong className="text-foreground">Set Wallpaper</strong> and turn <strong className="text-foreground">Show Preview</strong> off</>,
                    <>Name your shortcut and run it once to grant permissions</>,
                  ].map((text, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="shrink-0 w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-[10px] font-bold">
                        {i + 1}
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Automation */}
              <div className="bg-muted/50 rounded-lg p-3 border border-border">
                <h4 className="text-[12px] font-medium text-foreground mb-2">Daily Automation (Optional):</h4>
                <ol className="space-y-1.5 text-[11px] text-muted-foreground">
                  <li>1. Go to <strong className="text-foreground">Automation</strong> tab</li>
                  <li>2. Tap <strong className="text-foreground">+</strong> then <strong className="text-foreground">Time of Day</strong></li>
                  <li>3. Set time (e.g., 6:00 AM)</li>
                  <li>4. Add <strong className="text-foreground">Run Shortcut</strong> and select your shortcut</li>
                  <li>5. Turn off <strong className="text-foreground">Ask Before Running</strong></li>
                </ol>
              </div>

              {/* Pro tip */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                <p className="text-[12px] text-primary">
                  <strong>Pro tip:</strong> With Show Preview off, the wallpaper applies automatically — no manual save needed.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
