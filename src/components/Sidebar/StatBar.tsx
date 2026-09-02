interface Props {
  label: string;
  count: number;
  fillPercent: number;
  color: string;
}

export const StatBar = ({ label, count, fillPercent, color }: Props) => (
  <div className="flex items-center gap-2">
    <span className="w-14 shrink-0 text-[12px] text-secondary">{label}</span>
    <div className="h-1 flex-1 rounded-full bg-surface-0">
      <div
        className="h-full rounded-full"
        style={{
          width: `${Math.min(100, Math.max(fillPercent, 2))}%`,
          background: color,
        }}
      />
    </div>
    <span className="w-7 shrink-0 text-right font-mono text-[11px] text-muted tabular-nums">
      {count}
    </span>
  </div>
);
