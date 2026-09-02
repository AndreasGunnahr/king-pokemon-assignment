import type { ReactNode } from 'react';

interface Props {
  label: string;
  children: ReactNode;
}

/** A labeled group within the card detail panel. */
export const Section = ({ label, children }: Props) => (
  <div>
    <p className="mb-1.5 text-[12px] text-muted">{label}</p>
    {children}
  </div>
);
