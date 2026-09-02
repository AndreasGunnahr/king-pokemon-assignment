import type { LabelCount } from '@/lib/derive';

interface Props {
  /** The four buckets from `groupedRarity`, in order. */
  groups: LabelCount[];
}

const SEGMENT_CLASS: Record<string, string> = {
  Common: 'bg-positive-soft',
  Uncommon: 'bg-positive',
  'Rare or better': 'bg-accent',
  'No rarity': 'bg-muted',
};

const SEGMENT_DURATION = 400;

/** A single 100%-stacked bar summarizing the rarity mix, with an inline legend. */
export const RarityBar = ({ groups }: Props) => {
  const total = groups.reduce((sum, g) => sum + g.count, 0) || 1;
  const shown = groups.filter((g) => g.count > 0);

  return (
    <div>
      <div className="flex h-2.5 gap-px overflow-hidden rounded-full">
        {shown.map((g, i) => (
          <div
            key={g.label}
            className={`rarity-seg ${SEGMENT_CLASS[g.label] ?? 'bg-muted'}`}
            style={{
              width: `${(g.count / total) * 100}%`,
              animationDelay: `${i * SEGMENT_DURATION}ms`,
            }}
            title={`${g.label}: ${g.count}`}
          />
        ))}
      </div>
      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
        {shown.map((g) => (
          <span
            key={g.label}
            className="inline-flex items-center gap-1.5 text-secondary"
          >
            <span
              className={`size-2 rounded-full ${SEGMENT_CLASS[g.label] ?? 'bg-muted'}`}
            />
            {g.label}
            <span className="font-mono text-muted tabular-nums">
              {Math.round((g.count / total) * 100)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};
