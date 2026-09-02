import type { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  aside?: ReactNode;
}

export const PageHeader = ({ title, subtitle, aside }: Props) => (
  <header className="mb-6 flex items-baseline justify-between gap-4 border-b border-border pb-3">
    <div>
      <h1 className="text-lg font-medium text-primary">{title}</h1>
      {subtitle && (
        <p className="mt-0.5 text-[13px] text-secondary">{subtitle}</p>
      )}
    </div>
    {aside && (
      <div className="shrink-0 text-[13px] text-secondary">{aside}</div>
    )}
  </header>
);
