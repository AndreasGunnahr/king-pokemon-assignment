import type { Card } from '@/types';

interface Props {
  card: Card;
}

/** Box-text rules (e.g. "V rule", "ex rule"). Renders nothing when absent. */
export const RulesBox = ({ card }: Props) => {
  if (!card.rules?.length) {
    return null;
  }

  return (
    <div className="border-t border-border pt-3 text-[12px] text-muted">
      {card.rules.map((rule) => (
        <p key={rule} className="mb-1 last:mb-0">
          {rule}
        </p>
      ))}
    </div>
  );
};
