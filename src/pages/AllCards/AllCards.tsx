import { useMemo, useState } from 'react';

import { FilterControls } from '@/components/FilterControls';
import { PageHeader } from '@/components/PageHeader';
import { useCollection } from '@/hooks/useCollection';
import {
  emptyFilters,
  filterCards,
  getRarityOptions,
  getTypeOptions,
} from '@/lib/filter';
import { getCountLabel } from '@/lib/format';

import { CardGrid } from './components/CardGrid';

export const AllCards = () => {
  const { cards } = useCollection();
  const [filters, setFilters] = useState(emptyFilters);

  const { rarityNames, typeNames } = useMemo(
    () => ({
      rarityNames: getRarityOptions(cards),
      typeNames: getTypeOptions(cards),
    }),
    [cards],
  );
  const filtered = useMemo(() => filterCards(cards, filters), [cards, filters]);

  return (
    <div>
      <PageHeader
        title="All cards"
        subtitle="Every card in the collection. Click any card for details"
        aside={getCountLabel(filtered.length, cards.length)}
      />
      <div className="mb-5">
        <FilterControls
          filters={filters}
          onChange={setFilters}
          rarities={rarityNames}
          types={typeNames}
        />
      </div>
      <CardGrid cards={filtered} />
    </div>
  );
};
