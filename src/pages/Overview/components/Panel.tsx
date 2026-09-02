import type { ReactNode } from 'react';

interface Props {
  title?: string;
  subtitle?: string;
  /** Small print under the content — data caveats, sample size, etc. */
  footnote?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** The bordered surface used for charts and the collection table. */
export const Panel = ({
  title,
  subtitle,
  footnote,
  children,
  className = '',
}: Props) => {
  return (
    <section
      className={`rounded-card border border-border bg-surface-2 p-5 ${className}`}
    >
      {title && (
        <div className="mb-4">
          <h2 className="text-base font-medium text-primary">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 text-[13px] text-secondary">{subtitle}</p>
          )}
        </div>
      )}
      {children}
      {footnote && <p className="mt-3 text-[11px] text-muted">{footnote}</p>}
    </section>
  );
};
