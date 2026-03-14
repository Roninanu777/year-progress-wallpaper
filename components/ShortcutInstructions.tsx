'use client';

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

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
    <Accordion defaultValue={[]}>
      <AccordionItem value="instructions" className="border-border">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📱</span>
            <div className="text-left">
              <div className="font-semibold text-foreground">iOS Shortcut Setup</div>
              <div className="text-sm text-muted-foreground">Automate daily wallpaper updates</div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 pt-2">
            {/* API URL */}
            <div className="bg-card rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-2">Your personalized API URL:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs text-primary break-all">
                  {apiUrl || 'Configure your wallpaper to generate URL'}
                </code>
                <Button
                  onClick={handleCopy}
                  disabled={!apiUrl}
                  variant="secondary"
                  size="sm"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>

            {/* Required setting */}
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
              <p className="text-sm text-destructive">
                <strong>Required for full automation:</strong> In <strong>Set Wallpaper</strong>, turn <strong>Show Preview</strong> off.
              </p>
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Setup Instructions:</h4>
              <ol className="space-y-3 text-sm text-muted-foreground">
                {[
                  <>Open the <strong>Shortcuts</strong> app on your iPhone</>,
                  <>Tap <strong>+</strong> to create a new shortcut</>,
                  <>Add <strong>URL</strong> action and paste your API URL</>,
                  <>Add <strong>Get Contents of URL</strong> action</>,
                  <>Add <strong>Set Wallpaper</strong> action (choose Lock Screen, Home Screen, or Both) and turn <strong>Show Preview</strong> off</>,
                  <>Name your shortcut (e.g., &quot;Update Year Progress&quot;) and run it once to grant permissions</>,
                ].map((text, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Automation */}
            <div className="bg-card rounded-lg p-4 border border-border">
              <h4 className="font-medium text-foreground mb-2">Daily Automation (Optional):</h4>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Go to <strong>Automation</strong> tab in Shortcuts</li>
                <li>2. Tap <strong>+</strong> then <strong>Time of Day</strong></li>
                <li>3. Set time (e.g., 6:00 AM)</li>
                <li>4. Add <strong>Run Shortcut</strong> and select your wallpaper shortcut</li>
                <li>5. Choose <strong>Run Immediately</strong> and turn off <strong>Ask Before Running</strong></li>
              </ol>
            </div>

            {/* Pro tip */}
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
              <p className="text-sm text-primary">
                <strong>Pro tip:</strong> With <strong>Set Wallpaper</strong> + <strong>Show Preview off</strong>, the wallpaper applies automatically when the shortcut runs, with no manual save needed.
              </p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
