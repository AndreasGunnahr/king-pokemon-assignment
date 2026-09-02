import { describe, expect, it } from 'vitest';

import {
  emptyFilters,
  filterCards,
  getRarityOptions,
  getTypeOptions,
} from './filter';
import { makeCard } from './testFixtures';

const cards = [
  makeCard({
    id: 'a',
    name: 'Charizard',
    supertype: 'Pokémon',
    rarity: 'Rare Holo',
    types: ['Fire'],
  }),
  makeCard({
    id: 'b',
    name: 'Charmander',
    supertype: 'Pokémon',
    rarity: 'Common',
    types: ['Fire'],
  }),
  makeCard({
    id: 'c',
    name: "Buck's Training",
    supertype: 'Trainer',
    rarity: 'Uncommon',
  }),
  makeCard({
    id: 'd',
    name: 'Grass Energy',
    supertype: 'Energy',
    rarity: undefined,
  }),
  makeCard({
    id: 'e',
    name: 'Empoleon',
    supertype: 'Pokémon',
    rarity: 'Rare',
    types: ['Water', 'Metal'],
  }),
];

describe('filterCards', () => {
  it('returns everything with empty filters', () => {
    expect(filterCards(cards, emptyFilters)).toHaveLength(5);
  });

  it('matches name case-insensitively as a substring', () => {
    expect(
      filterCards(cards, { ...emptyFilters, search: 'char' }).map((c) => c.id),
    ).toEqual(['a', 'b']);
  });

  it('filters by supertype', () => {
    expect(
      filterCards(cards, { ...emptyFilters, supertype: 'Trainer' }).map(
        (c) => c.id,
      ),
    ).toEqual(['c']);
  });

  it('filters by rarity, mapping missing to "No rarity"', () => {
    expect(
      filterCards(cards, { ...emptyFilters, rarity: 'No rarity' }).map(
        (c) => c.id,
      ),
    ).toEqual(['d']);
  });

  it('filters by energy type, including secondary types', () => {
    expect(
      filterCards(cards, { ...emptyFilters, type: 'Fire' }).map((c) => c.id),
    ).toEqual(['a', 'b']);
    expect(
      filterCards(cards, { ...emptyFilters, type: 'Metal' }).map((c) => c.id),
    ).toEqual(['e']);
  });

  it('combines filters conjunctively', () => {
    expect(
      filterCards(cards, {
        ...emptyFilters,
        search: 'char',
        supertype: 'Pokémon',
        rarity: 'Common',
      }).map((c) => c.id),
    ).toEqual(['b']);
  });
});

describe('getRarityOptions', () => {
  it('lists distinct rarities with "No rarity" last', () => {
    expect(getRarityOptions(cards)).toEqual([
      'Common',
      'Rare',
      'Rare Holo',
      'Uncommon',
      'No rarity',
    ]);
  });
});

describe('getTypeOptions', () => {
  it('lists distinct energy types, most common first', () => {
    expect(getTypeOptions(cards)).toEqual(['Fire', 'Water', 'Metal']);
  });
});
