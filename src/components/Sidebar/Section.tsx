import type { ReactNode } from 'react';

interface Props {
  label: string;
  note?: string;
  children: ReactNode;
}

export const Section = ({ label, note, children }: Props) => (
  <div className="border-t border-border px-2 pt-3">
    <p className="mb-2 text-[11px] text-muted">{label}</p>
    <div className="flex flex-col gap-2">{children}</div>
    {note && <p className="mt-2.5 text-[11px] text-muted">{note}</p>}
  </div>
);
