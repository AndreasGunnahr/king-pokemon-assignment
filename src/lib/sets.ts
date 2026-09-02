import type { Card } from '@/types';

/**
 * The source data carries no set name or release date, only the card `id`
 * (`"base3-53"`, `"swsh9-142"`). The portion before the first dash is the
 * Pokémon TCG set code, which is the best set identity we have. Mapping these
 * codes to human names / release dates is a documented follow-up.
 */
export const setCode = (card: Card) => {
  const dashIndex = card.id.indexOf('-');
  return dashIndex === -1 ? card.id : card.id.slice(0, dashIndex);
};
