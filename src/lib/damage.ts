import type { Card } from '@/types';

/**
 * Parse the numeric part of a Pokémon attack's `damage` string.
 *
 * The field is free-form text in the source data: `""`, `"50"`, `"10×"`,
 * `"20+"`, `"40-"`. We take the leading run of digits and ignore any trailing
 * modifier. Anything not starting with a digit (e.g. `""`, `"×"`) yields `null`.
 */
export const parseAttackDamage = (damage: string | undefined) => {
  const match = damage?.trim().match(/^\d+/);

  return match ? Number(match[0]) : null;
};

/**
 * Get a card's headline damage: the largest numeric damage across its attacks.
 * Returns `null` when the card has no attacks with a numeric damage value.
 */
export const getMaxDamage = (card: Card) => {
  const values = (card.attacks ?? [])
    .map((attack) => parseAttackDamage(attack.damage))
    .filter((value) => value !== null);

  return values.length ? Math.max(...values) : null;
};

/** Get numeric HP, or `null` when the card has no HP (Trainer / Energy cards). */
export const getHpValue = (card: Card) => {
  if (!card.hp) {
    return null;
  }

  const parsed = Number(card.hp);

  return Number.isFinite(parsed) ? parsed : null;
};
