import type { Attack, Card } from '@/types';

import { Section } from './Section';

interface Props {
  card: Card;
}

/** The card's attacks with cost and effect text. Renders nothing when the card has none. */
export const AttackList = ({ card }: Props) => {
  if (!card.attacks?.length) {
    return null;
  }

  return (
    <Section label="Attacks">
      {card.attacks.map((attack) => (
        <AttackRow key={attack.name} attack={attack} />
      ))}
    </Section>
  );
};

/** Collapse an energy-cost list (`["Fire","Fire","Colorless"]`) to `2 Fire · 1 Colorless`. */
const formatCost = (cost: string[] | undefined) => {
  if (!cost || cost.length === 0) {
    return 'No energy';
  }
  const counts = new Map<string, number>();
  for (const energy of cost) {
    counts.set(energy, (counts.get(energy) ?? 0) + 1);
  }
  return [...counts].map(([energy, n]) => `${n} ${energy}`).join(' · ');
};

const AttackRow = ({ attack }: { attack: Attack }) => (
  <div className="border-t border-border py-2 first:border-t-0 first:pt-0">
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-primary">{attack.name}</span>
      {attack.damage ? (
        <span className="font-mono text-primary tabular-nums">
          {attack.damage}
        </span>
      ) : null}
    </div>
    <p className="mt-1 text-[12px] text-muted">
      Cost: {formatCost(attack.cost)}
      {' · '}
      {attack.text || 'no additional effect'}
    </p>
  </div>
);
