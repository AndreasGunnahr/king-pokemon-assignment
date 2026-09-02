import { getEnergyTypeSummary } from '@/lib/derive';
import { typeColor } from '@/lib/typeColors';
import type { Card } from '@/types';

import { Section } from './Section';
import { StatBar } from './StatBar';

interface Props {
  cards: Card[];
}

/** Card count per energy type as proportional bars, most common first. */
export const EnergyTypes = ({ cards }: Props) => {
  const summary = getEnergyTypeSummary(cards);
  // The "N more types" row can out-count any single type, so scale to the real max.
  const typeMax = Math.max(1, ...summary.map((type) => type.count));

  return (
    <Section label="Energy types">
      {summary.map((type) => (
        <StatBar
          key={type.label}
          label={type.label}
          count={type.count}
          fillPercent={(type.count / typeMax) * 100}
          color={typeColor(type.label)}
        />
      ))}
    </Section>
  );
};
