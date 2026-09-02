import type { Card } from '@/types';

import { Section } from './Section';

interface Props {
  card: Card;
}

/** The card's abilities (Ability / Poké-Power / Poké-Body). Renders nothing when the card has none. */
export const AbilityList = ({ card }: Props) => {
  if (!card.abilities?.length) {
    return null;
  }

  return (
    <Section label="Abilities">
      {card.abilities.map((ability) => (
        <div
          key={ability.name}
          className="border-t border-border py-2 first:border-t-0 first:pt-0"
        >
          <p className="text-primary">
            <span className="text-text-accent">{ability.type}</span> ·{' '}
            {ability.name}
          </p>
          <p className="mt-1 text-[12px] text-muted">{ability.text}</p>
        </div>
      ))}
    </Section>
  );
};
