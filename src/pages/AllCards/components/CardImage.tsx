import { useEffect, useState } from 'react';

import type { Card } from '@/types';

// Hi-res URLs the browser has fetched this session, so re-opening a card starts
// crisp instead of doing the low-res → swap again.
const hiResLoaded = new Set<string>();

interface Props {
  card: Card;
  className?: string;
}

/**
 * Card art that paints instantly by reusing the grid thumbnail's already-cached
 * `images.small` URL, then silently upgrades to `images.large` once that has
 * finished downloading in the background.
 */
export const CardImage = ({ card, className }: Props) => {
  const largeSrc = card.images.large || card.images.small;

  const [prevLarge, setPrevLarge] = useState(largeSrc);
  const [src, setSrc] = useState(() =>
    hiResLoaded.has(largeSrc) ? largeSrc : card.images.small,
  );

  if (largeSrc !== prevLarge) {
    setPrevLarge(largeSrc);
    setSrc(hiResLoaded.has(largeSrc) ? largeSrc : card.images.small);
  }

  useEffect(() => {
    if (hiResLoaded.has(largeSrc)) {
      return;
    }

    const preload = new Image();

    preload.onload = () => {
      hiResLoaded.add(largeSrc);
      setSrc(largeSrc);
    };

    preload.src = largeSrc;

    return () => {
      preload.onload = null;
    };
  }, [largeSrc]);

  return <img src={src} alt={card.name} className={className} />;
};
