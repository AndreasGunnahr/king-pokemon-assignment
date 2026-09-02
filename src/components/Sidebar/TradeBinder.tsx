import type { DuplicateStats } from '@/lib/derive';

import { Section } from './Section';

interface Props {
  duplicates: DuplicateStats;
}

export const TradeBinder = ({ duplicates }: Props) => {
  if (!duplicates.spareCopies) {
    return null;
  }

  return (
    <Section label="Trade binder">
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-xl font-medium text-primary tabular-nums">
          {duplicates.spareCopies}
        </span>
        <span className="text-[12px] text-secondary">spare copies</span>
      </div>
      <p className="text-[11px] text-muted">
        Across {duplicates.cardsWithSpares} cards · deepest is{' '}
        {duplicates.deepest}×
      </p>
    </Section>
  );
};
