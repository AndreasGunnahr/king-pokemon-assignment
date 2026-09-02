import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/** Shared "nothing to show" panel used by the table and the card grid. */
export const EmptyState = ({ children }: Props) => {
  return (
    <p className="rounded-card border border-border bg-surface-2 px-4 py-10 text-center text-muted max-h-screen h-full">
      {children}
    </p>
  );
};
