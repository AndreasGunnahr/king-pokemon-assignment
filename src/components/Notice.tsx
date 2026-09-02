import type { ReactNode } from 'react';

interface NoticeProps {
  children: ReactNode;
  tone?: 'muted' | 'error';
}

export const Notice = ({ children, tone = 'muted' }: NoticeProps) => (
  <p
    className={`rounded-card border border-border bg-surface-2 px-4 py-10 text-center text-[13px] ${
      tone === 'error' ? 'text-primary' : 'text-muted'
    }`}
  >
    {children}
  </p>
);

export const ErrorNotice = ({ error }: { error: unknown }) => (
  <Notice tone="error">
    Couldn't load the collection:{' '}
    {error instanceof Error ? error.message : 'Unknown error'}. Please reload
    the page.
  </Notice>
);
