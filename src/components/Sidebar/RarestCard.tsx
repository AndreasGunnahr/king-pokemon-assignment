import { getHpValue, getMaxDamage } from '@/lib/damage';
import { getRarestCard } from '@/lib/derive';
import type { Card } from '@/types';

import { Section } from './Section';

interface Props {
  cards: Card[];
}

/** The collection's scarcest card - rarest tier, then highest HP, then damage. */
export const RarestCard = ({ cards }: Props) => {
  const rarest = getRarestCard(cards);

  if (!rarest) {
    return null;
  }

  return (
    <Section label="Rarest card">
      <div className="flex items-start gap-3">
        <img
          src={rarest.images.small}
          alt=""
          className="aspect-245/342 w-12 shrink-0 rounded border border-border object-cover"
        />
        <div className="min-w-0">
          <p className="text-[13px] font-medium leading-snug text-primary">
            {rarest.name}
          </p>
          <p className="mt-1 text-[11px] text-muted">
            {rarest.rarity ?? 'No rarity'}
          </p>
          <p className="font-mono text-[11px] text-muted">
            {getHpValue(rarest) ?? '—'} HP · {getMaxDamage(rarest) ?? '—'} dmg
          </p>
        </div>
      </div>
    </Section>
  );
};
