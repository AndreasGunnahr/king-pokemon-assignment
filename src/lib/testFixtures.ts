import type { Card } from '@/types';

/** Build a Card with sensible defaults, overriding only what a test cares about. */
export const makeCard = (overrides: Partial<Card> = {}): Card => {
  return {
    id: 'base1-1',
    name: 'Test Card',
    supertype: 'Pokémon',
    number: '1',
    legalities: {},
    images: { small: 's.png', large: 'l.png' },
    ...overrides,
  };
};
