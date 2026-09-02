import { describe, expect, it } from 'vitest';

import { makeCard } from '@/lib/testFixtures';

import { sortCards } from './sort';

const cards = [
  makeCard({
    id: 'a',
    name: 'Charizard',
    hp: '120',
    attacks: [{ name: 'x', damage: '100' }],
  }),
  makeCard({
    id: 'b',
    name: 'Abra',
    hp: '30',
    attacks: [{ name: 'x', damage: '10' }],
  }),
  makeCard({
    id: 'c',
    name: 'Zapdos',
    hp: undefined,
    attacks: [{ name: 'x', damage: '' }],
  }),
];

describe('sortCards', () => {
  it('sorts by name ascending', () => {
    expect(
      sortCards(cards, { key: 'name', dir: 'asc' }).map((c) => c.id),
    ).toEqual(['b', 'a', 'c']);
  });

  it('sorts by hp descending with nulls last', () => {
    expect(
      sortCards(cards, { key: 'hp', dir: 'desc' }).map((c) => c.id),
    ).toEqual(['a', 'b', 'c']);
  });

  it('sorts by hp ascending with nulls still last', () => {
    expect(
      sortCards(cards, { key: 'hp', dir: 'asc' }).map((c) => c.id),
    ).toEqual(['b', 'a', 'c']);
  });

  it('sorts by damage descending', () => {
    expect(
      sortCards(cards, { key: 'damage', dir: 'desc' }).map((c) => c.id),
    ).toEqual(['a', 'b', 'c']);
  });

  it('does not mutate the input', () => {
    const before = cards.map((c) => c.id);
    sortCards(cards, { key: 'name', dir: 'desc' });
    expect(cards.map((c) => c.id)).toEqual(before);
  });
});
