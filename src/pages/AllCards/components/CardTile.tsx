import { memo, useState } from 'react';

import type { Card } from '@/types';

interface Props {
  card: Card;
  onOpen: (card: Card) => void;
}

/** A grid thumbnail - the card art with its name beneath.
 *
 *  - A pulsing skeleton holds the card's place until its image has loaded.
 *  - Memoized the grid because it can hold hundreds of tiles, and only `selectedId`
 *  changes when a modal opens — with a stable `onOpen` the tiles stay put. */
export const CardTile = memo(({ card, onOpen }: Props) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onOpen(card)}
      aria-label={`${card.name} — view details`}
      className="group block cursor-pointer text-left focus:outline-none"
    >
      <div className="relative aspect-245/342 w-full overflow-hidden rounded-lg border border-transparent bg-surface-1 transition duration-150 group-hover:-translate-y-px group-hover:border-surface-2 group-hover:shadow-lg group-hover:shadow-black/30 group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-accent">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-surface-2" />
        )}
        <img
          src={card.images.small}
          alt={card.name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
      <p className="mt-1.5 truncate text-center text-[13px] text-secondary">
        {card.name}
      </p>
    </button>
  );
});
