import type { Card } from '@/types';

import { getHpValue, getMaxDamage } from './damage';
import { setCode } from './sets';

/**
 * Drop cards that repeat an earlier card's `id`. The source export contains
 * ~300 exact-duplicate entries (same `id`, identical fields). Genuinely
 * different printings of the same Pokémon carry different ids (and collector
 * numbers) and are kept. Input order is preserved.
 */
export const dedupeById = (cards: Card[]) => {
  const seen = new Set<string>();

  return cards.filter((card) => {
    if (seen.has(card.id)) {
      return false;
    }

    seen.add(card.id);

    return true;
  });
};

export interface DuplicateStats {
  /** Rows in the raw export, before de-duplication. */
  totalRows: number;
  /** Distinct card ids. */
  uniqueCards: number;
  /** Extra rows beyond the first copy of each card (`totalRows - uniqueCards`). */
  spareCopies: number;
  /** How many distinct cards have at least one spare copy. */
  cardsWithSpares: number;
  /** Copies of the most-duplicated card (1 when there are no duplicates). */
  deepest: number;
  /** Raw copy count per card id. */
  byId: Record<string, number>;
}

/**
 * Duplicate accounting over the *raw* export (call before {@link dedupeById}).
 * Powers the sidebar's "Trade binder" panel and the "N unique" header.
 */
export const getDuplicateStats = (raw: Card[]): DuplicateStats => {
  const byId: Record<string, number> = {};
  let uniqueCards = 0;
  let cardsWithSpares = 0;
  let deepest = 0;

  for (const card of raw) {
    const copies = (byId[card.id] ?? 0) + 1;
    byId[card.id] = copies;
    // First time we see this id: one more distinct card.
    if (copies === 1) {
      uniqueCards += 1;
    }
    // Crossing 1 -> 2: this id now has spare copies (counted once, not per copy).
    if (copies === 2) {
      cardsWithSpares += 1;
    }
    // Track the most-duplicated id for the "deepest is N×" caption.
    if (copies > deepest) {
      deepest = copies;
    }
  }

  return {
    totalRows: raw.length,
    uniqueCards,
    spareCopies: raw.length - uniqueCards,
    cardsWithSpares,
    deepest,
    byId,
  };
};

/** Bucket label for a card whose `rarity` field is absent. */
export const NO_RARITY = 'No rarity';

/** A card's rarity for grouping / filtering, with the missing case named. */
export const getRarityLabel = (card: Card) => card.rarity ?? NO_RARITY;

/** A rarity counts as "rare or better" when it is present and not one of the
 * two bulk tiers. Covers Rare, Rare Holo, Rare Ultra, Promo, Secret, etc. */
export const isRareOrBetter = (rarity: string | undefined): rarity is string =>
  !!rarity && rarity !== 'Common' && rarity !== 'Uncommon';

export interface SummaryStats {
  totalCards: number;
  uniqueSets: number;
  rareOrBetter: number;
  rareOrBetterPct: number;
  standardLegal: number;
}

export const getSummarizeOfStats = (cards: Card[]): SummaryStats => {
  const sets = new Set<string>();
  let rareOrBetter = 0;
  let standardLegal = 0;

  for (const card of cards) {
    sets.add(setCode(card));
    if (isRareOrBetter(card.rarity)) {
      rareOrBetter += 1;
    }
    if (card.legalities.standard === 'Legal') {
      standardLegal += 1;
    }
  }

  return {
    totalCards: cards.length,
    uniqueSets: sets.size,
    rareOrBetter,
    rareOrBetterPct: cards.length
      ? Math.round((rareOrBetter / cards.length) * 100)
      : 0,
    standardLegal,
  };
};

export interface LabelCount {
  label: string;
  count: number;
}

/** Fixed display order for the four-bucket rarity summary. */
const RARITY_GROUPS = [
  'Common',
  'Uncommon',
  'Rare or better',
  NO_RARITY,
] as const;

/** Collapse the ~13 printed rarities into the four buckets the summary bar
 *  shows, in {@link RARITY_GROUPS} order (zero-filled). */
export const groupByRarity = (cards: Card[]): LabelCount[] => {
  const counts = new Map<string, number>(
    RARITY_GROUPS.map((group) => [group, 0]),
  );

  for (const card of cards) {
    const group = !card.rarity
      ? NO_RARITY
      : isRareOrBetter(card.rarity)
        ? 'Rare or better'
        : card.rarity;

    counts.set(group, (counts.get(group) ?? 0) + 1);
  }

  return RARITY_GROUPS.map((label) => ({
    label,
    count: counts.get(label) ?? 0,
  }));
};

export interface ScatterPoint {
  id: string;
  name: string;
  hp: number;
  damage: number;
  type: string;
}

/** One point per Pokémon card that has both an HP value and numeric damage. */
export const getHpDamageScatter = (cards: Card[]): ScatterPoint[] =>
  cards.flatMap((card) => {
    if (card.supertype !== 'Pokémon') {
      return [];
    }

    const hp = getHpValue(card);
    const damage = getMaxDamage(card);

    if (hp === null || damage === null) {
      return [];
    }

    return [
      {
        id: card.id,
        name: card.name,
        hp,
        damage,
        type: card.types?.[0] ?? 'Colorless',
      },
    ];
  });

/** Median of a numeric list. Returns 0 for an empty list. Input is not mutated. */
export const getMedian = (values: number[]) => {
  if (values.length === 0) {
    return 0;
  }

  const sorted = values.toSorted((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  // `values` is non-empty here, so both indices are in range.
  const upper = sorted[middle]!;

  return sorted.length % 2 === 0 ? (sorted[middle - 1]! + upper) / 2 : upper;
};

/** Card count per energy type, most common first. */
export const getEnergyTypeBreakdown = (cards: Card[]): LabelCount[] => {
  const counts = new Map<string, number>();

  for (const card of cards) {
    for (const type of card.types ?? []) {
      counts.set(type, (counts.get(type) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((entryA, entryB) => entryB.count - entryA.count);
};

/** `getEnergyTypeBreakdown` with everything past `top` folded into one "N others" row. */
export const getEnergyTypeSummary = (cards: Card[], top = 5) => {
  const all = getEnergyTypeBreakdown(cards);

  if (all.length <= top + 1) {
    return all;
  }

  const tail = all.slice(top);
  const othersCount = tail.reduce((sum, entry) => sum + entry.count, 0);

  return [
    ...all.slice(0, top),
    { label: `${tail.length} more types`, count: othersCount },
  ];
};

/** Printed rarities in scarcity order, rarest first. Anything else sorts last. */
const RARITY_ORDER = [
  'Rare Secret',
  'Rare Rainbow',
  'Rare Shiny',
  'Rare Holo Star',
  'Rare Holo LV.X',
  'Rare Ultra',
  'Rare Holo EX',
  'Rare Holo V',
  'Rare Holo',
  'Rare',
  'Promo',
  'Uncommon',
  'Common',
];

const rankByRarity = new Map(
  RARITY_ORDER.map((rarity, index) => [rarity, index]),
);

const getRarityRank = (rarity: string | undefined) =>
  rankByRarity.get(rarity ?? '') ?? RARITY_ORDER.length;

const byScarcity = (cardA: Card, cardB: Card) =>
  getRarityRank(cardA.rarity) - getRarityRank(cardB.rarity) ||
  (getHpValue(cardB) ?? -1) - (getHpValue(cardA) ?? -1) ||
  (getMaxDamage(cardB) ?? -1) - (getMaxDamage(cardA) ?? -1) ||
  cardA.name.localeCompare(cardB.name);

/** The collection's "crown jewel": rarest tier, then highest HP, then damage. */
export const getRarestCard = (cards: Card[]) => {
  let bestCard: Card | null = null;

  for (const card of cards) {
    if (bestCard === null || byScarcity(card, bestCard) < 0) {
      bestCard = card;
    }
  }

  return bestCard;
};

export interface ChaseSummary {
  /** Rare-or-better tiers, rarest first, capped at `top`. */
  rows: LabelCount[];
  /** Cards across every rare-or-better tier (not just the capped rows). */
  totalCards: number;
  /** Distinct rare-or-better tiers present. */
  tierCount: number;
}

/**
 * The scarce end of the collection: card count per rare-or-better rarity tier,
 * rarest first. Feeds the sidebar's "Chase cards" panel.
 */
export const getChaseCards = (cards: Card[], top = 5): ChaseSummary => {
  const counts = new Map<string, number>();
  let totalCards = 0;

  for (const card of cards) {
    const { rarity } = card;

    if (!isRareOrBetter(rarity)) {
      continue;
    }

    counts.set(rarity, (counts.get(rarity) ?? 0) + 1);
    totalCards += 1;
  }

  const tiers = [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort(
      (tierA, tierB) =>
        getRarityRank(tierA.label) - getRarityRank(tierB.label) ||
        tierA.label.localeCompare(tierB.label),
    );

  return {
    rows: tiers.slice(0, top),
    totalCards,
    tierCount: tiers.length,
  };
};
