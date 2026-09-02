import type { CardFilters } from '@/lib/filter';
import { SUPERTYPES } from '@/lib/filter';
import type { Supertype } from '@/types';

interface Props {
  filters: CardFilters;
  onChange: (next: CardFilters) => void;
  rarities: string[];
  types: string[];
  showSearch?: boolean;
}

const controlClass =
  'rounded-md border border-border bg-surface-1 py-1.5 pl-2.5 text-[13px] text-primary ' +
  'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent';

const selectClass = `${controlClass} select-chevron pr-8`;

export const FilterControls = ({
  filters,
  onChange,
  rarities,
  types,
  showSearch = true,
}: Props) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {showSearch && (
        <input
          type="search"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search by name…"
          className={`${controlClass} w-56 pr-2.5 placeholder:text-muted`}
          aria-label="Search cards by name"
        />
      )}

      <select
        value={filters.supertype}
        onChange={(e) =>
          onChange({ ...filters, supertype: e.target.value as Supertype | '' })
        }
        className={selectClass}
        aria-label="Filter by card type"
      >
        <option value="">All card types</option>
        {SUPERTYPES.map((superType) => (
          <option key={superType} value={superType}>
            {superType}
          </option>
        ))}
      </select>
      <select
        value={filters.type}
        onChange={(e) => onChange({ ...filters, type: e.target.value })}
        className={selectClass}
        aria-label="Filter by energy type"
      >
        <option value="">All energy types</option>
        {types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <select
        value={filters.rarity}
        onChange={(e) => onChange({ ...filters, rarity: e.target.value })}
        className={selectClass}
        aria-label="Filter by rarity"
      >
        <option value="">All rarities</option>
        {rarities.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </div>
  );
};
