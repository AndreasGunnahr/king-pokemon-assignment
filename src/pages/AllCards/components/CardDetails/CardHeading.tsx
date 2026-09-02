import type { Card } from '@/types';

interface Props {
  card: Card;
}

/** Card name with a "Basic Pokémon · Fire · 120 HP" style sub-line. */
export const CardHeading = ({ card }: Props) => {
  const kind = [card.subtypes?.join(' '), card.supertype]
    .filter(Boolean)
    .join(' ');

  const subline = [
    kind,
    ...(card.types ?? []),
    card.hp ? `${card.hp} HP` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div>
      <p className="text-xl font-medium text-primary">{card.name}</p>
      <p className="mt-1 text-secondary">{subline}</p>
    </div>
  );
};
