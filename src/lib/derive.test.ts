import { describe, expect, it } from 'vitest';

import {
  dedupeById,
  getChaseCards,
  getDuplicateStats,
  getEnergyTypeSummary,
  getHpDamageScatter,
  getMedian,
  getRarestCard,
  getSummarizeOfStats,
  groupByRarity,
  isRareOrBetter,
} from './derive';
import { makeCard } from './testFixtures';

const cards = [
  makeCard({
    id: 'base1-4',
    name: 'Charizard',
    supertype: 'Pokémon',
    hp: '120',
    rarity: 'Rare Holo',
    types: ['Fire'],
    attacks: [{ name: 'Fire Spin', damage: '100' }],
    legalities: { standard: 'Legal' },
  }),
  makeCard({
    id: 'base1-2',
    name: 'Ivysaur',
    supertype: 'Pokémon',
    hp: '60',
    rarity: 'Uncommon',
    types: ['Grass'],
    attacks: [{ name: 'Vine', damage: '30' }],
  }),
  makeCard({
    id: 'base2-15',
    name: 'Pikachu',
    supertype: 'Pokémon',
    hp: '40',
    rarity: 'Common',
    types: ['Lightning'],
    attacks: [{ name: 'Growl', damage: '' }],
  }),
  makeCard({
    id: 'dp6-130',
    name: "Buck's Training",
    supertype: 'Trainer',
    rarity: 'Uncommon',
  }),
  makeCard({
    id: 'gym2-129',
    name: 'Grass Energy',
    supertype: 'Energy',
    rarity: undefined,
    legalities: { standard: 'Legal' },
  }),
];

describe('dedupeById', () => {
  it('keeps the first card for each id and preserves order', () => {
    const input = [
      makeCard({ id: 'base1-4', name: 'Charizard' }),
      makeCard({ id: 'base1-2', name: 'Ivysaur' }),
      makeCard({ id: 'base1-4', name: 'Charizard' }),
    ];
    expect(dedupeById(input).map((c) => c.id)).toEqual(['base1-4', 'base1-2']);
  });

  it('keeps different printings that share a name but not an id', () => {
    const input = [
      makeCard({ id: 'ecard3-79', name: 'Abra', number: '79' }),
      makeCard({ id: 'ecard3-88', name: 'Abra', number: '88' }),
    ];
    expect(dedupeById(input)).toHaveLength(2);
  });
});

describe('isRareOrBetter', () => {
  it('excludes the bulk tiers and missing rarity', () => {
    expect(isRareOrBetter('Common')).toBe(false);
    expect(isRareOrBetter('Uncommon')).toBe(false);
    expect(isRareOrBetter(undefined)).toBe(false);
    expect(isRareOrBetter('Rare Holo')).toBe(true);
    expect(isRareOrBetter('Promo')).toBe(true);
  });
});

describe('getSummarizeOfStats', () => {
  it('counts totals, sets, rare-or-better and standard legality', () => {
    const s = getSummarizeOfStats(cards);
    expect(s.totalCards).toBe(5);
    expect(s.uniqueSets).toBe(4); // base1, base2, dp6, gym2
    expect(s.rareOrBetter).toBe(1); // Charizard only
    expect(s.rareOrBetterPct).toBe(20);
    expect(s.standardLegal).toBe(2); // Charizard + Grass Energy
  });
});

describe('groupByRarity', () => {
  it('buckets into Common / Uncommon / Rare or better / No rarity in fixed order', () => {
    expect(groupByRarity(cards)).toEqual([
      { label: 'Common', count: 1 },
      { label: 'Uncommon', count: 2 },
      { label: 'Rare or better', count: 1 },
      { label: 'No rarity', count: 1 },
    ]);
  });

  it('always returns all four buckets, zero-filled', () => {
    expect(groupByRarity([]).map((g) => [g.label, g.count])).toEqual([
      ['Common', 0],
      ['Uncommon', 0],
      ['Rare or better', 0],
      ['No rarity', 0],
    ]);
  });
});

describe('getHpDamageScatter', () => {
  it('keeps Pokémon with both HP and numeric damage, tagged with primary type', () => {
    const points = getHpDamageScatter(cards);
    expect(points).toEqual([
      { id: 'base1-4', name: 'Charizard', hp: 120, damage: 100, type: 'Fire' },
      { id: 'base1-2', name: 'Ivysaur', hp: 60, damage: 30, type: 'Grass' },
    ]);
  });

  it('falls back to Colorless when a Pokémon has no type', () => {
    const [point] = getHpDamageScatter([
      makeCard({
        supertype: 'Pokémon',
        hp: '50',
        types: undefined,
        attacks: [{ name: 'x', damage: '10' }],
      }),
    ]);
    expect(point?.type).toBe('Colorless');
  });
});

describe('getEnergyTypeSummary', () => {
  const typed = [
    makeCard({ id: '1', types: ['Water'] }),
    makeCard({ id: '2', types: ['Water'] }),
    makeCard({ id: '3', types: ['Grass'] }),
    makeCard({ id: '4', types: ['Fire'] }),
    makeCard({ id: '5', types: ['Psychic'] }),
  ];

  it('returns every type when the tail would be a single row', () => {
    expect(getEnergyTypeSummary(typed, 5)).toEqual([
      { label: 'Water', count: 2 },
      { label: 'Grass', count: 1 },
      { label: 'Fire', count: 1 },
      { label: 'Psychic', count: 1 },
    ]);
  });

  it('folds the tail into an "N more types" row past `top`', () => {
    expect(getEnergyTypeSummary(typed, 2)).toEqual([
      { label: 'Water', count: 2 },
      { label: 'Grass', count: 1 },
      { label: '2 more types', count: 2 },
    ]);
  });
});

describe('getRarestCard', () => {
  it('picks the rarest tier, then highest HP', () => {
    const cards = [
      makeCard({ id: 'a', name: 'Bulk', rarity: 'Common', hp: '200' }),
      makeCard({ id: 'b', name: 'Secret', rarity: 'Rare Secret', hp: '90' }),
      makeCard({ id: 'c', name: 'Holo Small', rarity: 'Rare Holo', hp: '70' }),
      makeCard({ id: 'd', name: 'Holo Big', rarity: 'Rare Holo', hp: '150' }),
    ];
    expect(getRarestCard(cards)?.id).toBe('b');
  });

  it('breaks a rarity tie by HP', () => {
    const cards = [
      makeCard({ id: 'small', rarity: 'Rare Holo', hp: '70' }),
      makeCard({ id: 'big', rarity: 'Rare Holo', hp: '150' }),
    ];
    expect(getRarestCard(cards)?.id).toBe('big');
  });

  it('is null for an empty collection', () => {
    expect(getRarestCard([])).toBeNull();
  });
});

describe('getDuplicateStats', () => {
  it('counts spare copies, affected cards and the deepest stack over the raw export', () => {
    const raw = [
      makeCard({ id: 'a' }),
      makeCard({ id: 'a' }),
      makeCard({ id: 'a' }),
      makeCard({ id: 'b' }),
      makeCard({ id: 'b' }),
      makeCard({ id: 'c' }),
    ];
    expect(getDuplicateStats(raw)).toEqual({
      totalRows: 6,
      uniqueCards: 3,
      spareCopies: 3, // a: +2, b: +1
      cardsWithSpares: 2, // a, b
      deepest: 3, // a
      byId: { a: 3, b: 2, c: 1 },
    });
  });

  it('reports no spares for an already-unique list', () => {
    const raw = [makeCard({ id: 'a' }), makeCard({ id: 'b' })];
    expect(getDuplicateStats(raw)).toEqual({
      totalRows: 2,
      uniqueCards: 2,
      spareCopies: 0,
      cardsWithSpares: 0,
      deepest: 1,
      byId: { a: 1, b: 1 },
    });
  });
});

describe('getChaseCards', () => {
  const pool = [
    makeCard({ id: '1', rarity: 'Common' }),
    makeCard({ id: '2', rarity: 'Uncommon' }),
    makeCard({ id: '3', rarity: 'Rare Holo' }),
    makeCard({ id: '4', rarity: 'Rare Holo' }),
    makeCard({ id: '5', rarity: 'Rare Secret' }),
    makeCard({ id: '6', rarity: 'Rare Ultra' }),
  ];

  it('counts rare-or-better tiers only, rarest first', () => {
    const { rows, totalCards, tierCount } = getChaseCards(pool);
    expect(rows).toEqual([
      { label: 'Rare Secret', count: 1 },
      { label: 'Rare Ultra', count: 1 },
      { label: 'Rare Holo', count: 2 },
    ]);
    expect(totalCards).toBe(4);
    expect(tierCount).toBe(3);
  });

  it('caps the rows at `top` but still totals every tier', () => {
    const { rows, totalCards, tierCount } = getChaseCards(pool, 1);
    expect(rows).toEqual([{ label: 'Rare Secret', count: 1 }]);
    expect(totalCards).toBe(4);
    expect(tierCount).toBe(3);
  });
});

describe('getMedian', () => {
  it('returns the middle value for odd-length lists', () => {
    expect(getMedian([3, 1, 2])).toBe(2);
  });

  it('averages the two middle values for even-length lists', () => {
    expect(getMedian([10, 20, 30, 40])).toBe(25);
  });

  it('returns 0 for an empty list and does not mutate the input', () => {
    const input = [5, 2, 9];
    expect(getMedian([])).toBe(0);
    getMedian(input);
    expect(input).toEqual([5, 2, 9]);
  });
});
