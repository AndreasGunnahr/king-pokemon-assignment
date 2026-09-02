import { getChaseCards } from '@/lib/derive';
import type { Card } from '@/types';

import { Section } from './Section';

interface Props {
  cards: Card[];
}

/** Rare-or-better rarity tiers, rarest first, each with its card count. Hidden
 *  when the collection has nothing above the bulk rarities. */
export const ChaseCards = ({ cards }: Props) => {
  const { rows, totalCards, tierCount } = getChaseCards(cards);

  if (!rows.length) {
    return null;
  }

  return (
    <Section
      label="Chase cards"
      note={`${totalCards} cards across ${tierCount} rarity tiers`}
    >
      {rows.map((tier) => (
        <div
          key={tier.label}
          className="flex items-baseline justify-between gap-2 text-[13px]"
        >
          <span className="truncate text-secondary">{tier.label}</span>
          <span className="font-mono text-[11px] text-muted tabular-nums">
            {tier.count}
          </span>
        </div>
      ))}
    </Section>
  );
};
