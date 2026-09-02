import type { Card, Supertype } from '@/types';

import { getEnergyTypeBreakdown, getRarityLabel, NO_RARITY } from './derive';

export interface CardFilters {
  /** Case-insensitive substring match on card name. Empty = no name filter. */
  search: string;
  /** Empty = all supertypes. */
  supertype: Supertype | '';
  /** Empty = all rarities. Matches the card's rarity label exactly ("No rarity" targets missing). */
  rarity: string | '';
  /** Empty = all types. Matches if the card carries this energy type. */
  type: string | '';
}

export const emptyFilters: CardFilters = {
  search: '',
  supertype: '',
  rarity: '',
  type: '',
};

export const SUPERTYPES: Supertype[] = ['Pokémon', 'Trainer', 'Energy'];

export const filterCards = (cards: Card[], filters: CardFilters) => {
  const searchTerm = filters.search.trim().toLowerCase();

  return cards.filter((card) => {
    if (searchTerm && !card.name.toLowerCase().includes(searchTerm)) {
      return false;
    }
    if (filters.supertype && card.supertype !== filters.supertype) {
      return false;
    }
    if (filters.rarity && getRarityLabel(card) !== filters.rarity) {
      return false;
    }
    if (filters.type && !card.types?.includes(filters.type)) {
      return false;
    }

    return true;
  });
};

/** Distinct rarity values present in the data, "No rarity" last. */
export const getRarityOptions = (cards: Card[]) => {
  const rarities = new Set<string>();

  for (const card of cards) {
    rarities.add(getRarityLabel(card));
  }

  // Alphabetical, but "No rarity" is always pinned to the end of the list.
  return [...rarities].sort((rarityA, rarityB) => {
    if (rarityA === NO_RARITY) {
      return 1;
    }
    if (rarityB === NO_RARITY) {
      return -1;
    }
    return rarityA.localeCompare(rarityB);
  });
};

/** Distinct energy types present in the data, most common first. */
export const getTypeOptions = (cards: Card[]) =>
  getEnergyTypeBreakdown(cards).map((entry) => entry.label);
