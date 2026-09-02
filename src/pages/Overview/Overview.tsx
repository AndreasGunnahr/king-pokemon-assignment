import { useMemo, useState } from 'react';

import { FilterControls } from '@/components/FilterControls';
import { PageHeader } from '@/components/PageHeader';
import { useCollection } from '@/hooks/useCollection';
import {
  getHpDamageScatter,
  getSummarizeOfStats,
  groupByRarity,
  NO_RARITY,
} from '@/lib/derive';
import {
  emptyFilters,
  filterCards,
  getRarityOptions,
  getTypeOptions,
} from '@/lib/filter';
import { getCountLabel } from '@/lib/format';

import { ActiveFilters } from './components/ActiveFilters';
import { CollectionTable } from './components/CollectionTable';
import { HpDamageScatter } from './components/HpDamageScatter';
import { Panel } from './components/Panel';
import { RarityBar } from './components/RarityBar';
import { StatTile } from './components/StatTile';

export const Overview = () => {
  const { cards, duplicates } = useCollection();
  const [filters, setFilters] = useState(emptyFilters);

  const { stats, scatter, rarityGroups, rarityNames, typeNames } = useMemo(
    () => ({
      stats: getSummarizeOfStats(cards),
      scatter: getHpDamageScatter(cards),
      rarityGroups: groupByRarity(cards),
      rarityNames: getRarityOptions(cards),
      typeNames: getTypeOptions(cards),
    }),
    [cards],
  );

  const filtered = useMemo(() => filterCards(cards, filters), [cards, filters]);

  const toggleType = (type: string) =>
    setFilters((f) => ({ ...f, type: f.type === type ? '' : type }));

  const noRarity = rarityGroups.find((g) => g.label === NO_RARITY)?.count ?? 0;
  const cardsPerSet = stats.uniqueSets
    ? Math.round(stats.totalCards / stats.uniqueSets)
    : 0;
  const standardPct = stats.totalCards
    ? Math.round((stats.standardLegal / stats.totalCards) * 100)
    : 0;

  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle="What Ash's collection is made of"
      />

      <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile
          label="Total cards"
          value={`${duplicates.totalRows}`}
          hint="incl. duplicates"
        />
        <StatTile
          label="Unique cards"
          value={`${duplicates.uniqueCards}`}
          hint="distinct printings"
        />
        <StatTile
          label="Sets represented"
          value={`${stats.uniqueSets}`}
          hint={`~${cardsPerSet} cards in each`}
        />
        <StatTile
          label="Rare or better"
          value={`${stats.rareOrBetterPct}%`}
          hint={`${stats.rareOrBetter} cards`}
        />
        <StatTile
          label="Tournament legal"
          value={`${stats.standardLegal}`}
          hint={`${standardPct}% of cards`}
        />
      </div>
      <Panel
        title="Just over half the collection is Common"
        subtitle="Rarity mix"
        className="mb-6"
        footnote={
          noRarity ? `${noRarity} cards have no printed rarity.` : undefined
        }
      >
        <RarityBar groups={rarityGroups} />
      </Panel>
      <Panel
        title="Half of Ash's Pokémon fall at or below 60 HP and 20 damage"
        subtitle="HP vs. max attack damage · 1,102 Pokémon · Click a dot to filter by type"
        footnote="Damage is parsed from free-text attack values (e.g. “20×”); cards whose attacks deal no fixed damage are excluded."
        className="mb-6"
      >
        <HpDamageScatter
          points={scatter}
          activeType={filters.type}
          onSelect={toggleType}
        />
      </Panel>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <FilterControls
          filters={filters}
          onChange={setFilters}
          rarities={rarityNames}
          types={typeNames}
          showSearch={false}
        />
        <span className="text-[13px] text-muted">
          {getCountLabel(filtered.length, cards.length)}
        </span>
      </div>
      <div className="mb-3">
        <ActiveFilters filters={filters} onChange={setFilters} />
      </div>
      <CollectionTable cards={filtered} />
    </div>
  );
};
