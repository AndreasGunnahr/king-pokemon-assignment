import { type CardFilters, emptyFilters } from '@/lib/filter';
import { typeColor } from '@/lib/typeColors';

interface Props {
  filters: CardFilters;
  onChange: (next: CardFilters) => void;
}

interface Chip {
  key: keyof CardFilters;
  label: string;
  dot?: string;
}

/** Removable chips for whatever filters are active — the visible trace of a
 *  chart click or a dropdown choice. Renders nothing when no filter is set. */
export const ActiveFilters = ({ filters, onChange }: Props) => {
  const chips = getChips(filters);

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[13px] text-muted">Filters</span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onChange({ ...filters, [chip.key]: '' })}
          className="inline-flex items-center gap-1 rounded-md bg-bg-accent px-2 py-0.5 text-[13px] text-text-accent hover:opacity-80"
        >
          {chip.dot && (
            <span
              className="size-2 rounded-full"
              style={{ background: chip.dot }}
            />
          )}
          {chip.label}
          <span aria-hidden>✕</span>
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(emptyFilters)}
        className="text-[13px] text-muted underline hover:text-primary"
      >
        clear all
      </button>
    </div>
  );
};

/** The active filters as removable chips, in display order. */
const getChips = (filters: CardFilters): Chip[] => {
  const chips: Chip[] = [];

  if (filters.search.trim()) {
    chips.push({ key: 'search', label: `“${filters.search.trim()}”` });
  }
  if (filters.supertype) {
    chips.push({ key: 'supertype', label: filters.supertype });
  }
  if (filters.type) {
    chips.push({
      key: 'type',
      label: filters.type,
      dot: typeColor(filters.type),
    });
  }
  if (filters.rarity) {
    chips.push({ key: 'rarity', label: filters.rarity });
  }

  return chips;
};
