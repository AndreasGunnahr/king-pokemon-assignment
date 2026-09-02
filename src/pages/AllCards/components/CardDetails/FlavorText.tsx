import type { Card } from '@/types';

interface Props {
  card: Card;
}

/** The card's italic flavor blurb. Renders nothing when absent. */
export const FlavorText = ({ card }: Props) => {
  if (!card.flavorText) {
    return null;
  }

  return (
    <p className="border-t border-border pt-3 text-[12px] leading-relaxed text-muted italic">
      {card.flavorText}
    </p>
  );
};
