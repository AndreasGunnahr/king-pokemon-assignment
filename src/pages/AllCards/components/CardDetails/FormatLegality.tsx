import type { Card } from '@/types';

const FORMATS = [
  ['standard', 'Standard'],
  ['expanded', 'Expanded'],
  ['unlimited', 'Unlimited'],
] as const;

interface Props {
  card: Card;
}

/** Standard / Expanded / Unlimited badges, grayed with a "Not " prefix when the
card isn't legal in that format. */
export const FormatLegality = ({ card }: Props) => (
  <div className="flex flex-wrap gap-1.5">
    {FORMATS.map(([key, label]) => {
      const legal = card.legalities[key] === 'Legal';
      return (
        <span
          key={key}
          className={
            legal
              ? 'rounded bg-bg-accent px-2 py-0.5 text-[11px] text-text-accent'
              : 'rounded border border-border px-2 py-0.5 text-[11px] text-muted'
          }
        >
          {legal ? label : `Not ${label}`}
        </span>
      );
    })}
  </div>
);
