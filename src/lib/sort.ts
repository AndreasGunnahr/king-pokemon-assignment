import { getHpValue, getMaxDamage } from '@/lib/damage';
import { setCode } from '@/lib/sets';
import type { Card } from '@/types';

export type SortKey = 'name' | 'set' | 'rarity' | 'hp' | 'damage';
export type SortDir = 'asc' | 'desc';

export interface SortState {
  key: SortKey;
  dir: SortDir;
}

const accessors: Record<SortKey, (card: Card) => string | number | null> = {
  name: (card) => card.name.toLowerCase(),
  set: setCode,
  rarity: (card) => card.rarity ?? '',
  hp: getHpValue,
  damage: getMaxDamage,
};

/**
 * Stable-ish sort by the given column. `null` values (no HP / no damage) always
 * sort to the bottom regardless of direction.
 */
export const sortCards = (cards: Card[], sort: SortState): Card[] => {
  const getValue = accessors[sort.key];
  const factor = sort.dir === 'asc' ? 1 : -1;

  return cards.toSorted((cardA, cardB) => {
    const valueA = getValue(cardA);
    const valueB = getValue(cardB);
    if (valueA === null && valueB === null) {
      return 0;
    }
    if (valueA === null) {
      return 1;
    }
    if (valueB === null) {
      return -1;
    }
    if (valueA < valueB) {
      return -1 * factor;
    }
    if (valueA > valueB) {
      return 1 * factor;
    }
    return 0;
  });
};
