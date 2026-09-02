import type { Card, WeaknessOrResistance } from '@/types';

/** `[{type:"Lightning",value:"×2"}]` becomes `Lightning ×2`. Returns `"none"` when the list is empty. */
const joinPairs = (pairs: WeaknessOrResistance[] | undefined) =>
  pairs?.map((p) => `${p.type} ${p.value}`).join(', ') || 'none';

interface Props {
  card: Card;
}

/** Weakness / resistance / retreat-cost strip. Renders nothing when the card has none of the three. */
export const BattleStats = ({ card }: Props) => {
  const hasBattleStats =
    !!card.weaknesses?.length ||
    !!card.resistances?.length ||
    !!card.retreatCost?.length;

  if (!hasBattleStats) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-border pt-3 text-[12px] text-muted">
      <span>
        Weakness{' '}
        <span className="text-secondary">{joinPairs(card.weaknesses)}</span>
      </span>
      <span>
        Resist{' '}
        <span className="text-secondary">{joinPairs(card.resistances)}</span>
      </span>
      <span>
        Retreat{' '}
        <span className="text-secondary">{card.retreatCost?.length ?? 0}</span>
      </span>
    </div>
  );
};
