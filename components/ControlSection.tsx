import type { ReactNode } from 'react';

interface ControlSectionProps {
  label: string;
  children: ReactNode;
}

export default function ControlSection({ label, children }: ControlSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground shrink-0">
          {label}
        </span>
        <div className="flex-1 h-px bg-black/[0.08] dark:bg-border" />
      </div>
      {children}
    </div>
  );
}
