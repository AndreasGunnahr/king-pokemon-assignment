interface Props {
  label: string;
  value: string;
  hint?: string;
}

export const StatTile = ({ label, value, hint }: Props) => {
  return (
    <div className="rounded-card bg-surface-1 border border-border p-4">
      <p className="text-[13px] text-secondary">{label}</p>
      <p className="mt-1 font-mono text-2xl font-medium text-primary tabular-nums">
        {value}
      </p>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </div>
  );
};
