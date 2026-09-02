interface Props {
  label: string;
  value: string;
  /** Trailing context after a "·", e.g. how many peers share this value. */
  meta?: string;
  /** Drop the bottom margin on the last row in a stats box. */
  last?: boolean;
}

/** One label/value row inside {@link StatsBox}. */
export const Stat = ({ label, value, meta, last }: Props) => (
  <div
    className={`flex items-baseline justify-between gap-3 text-[12px] ${last ? '' : 'mb-1.5'}`}
  >
    <dt className="shrink-0 text-secondary">{label}</dt>
    <dd className="min-w-0 truncate text-right text-primary">
      {value}
      {meta ? <span className="text-secondary"> · {meta}</span> : null}
    </dd>
  </div>
);
