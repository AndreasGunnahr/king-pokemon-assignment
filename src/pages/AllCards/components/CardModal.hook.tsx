import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

import type { Card } from '@/types';

/** Exit-animation duration. Keep in sync with the `.card-modal-*` CSS. */
export const ANIM_MS = 200;

interface Props {
  /** The card to render: the live one while open, a retained copy while
   *  animating out, `null` when fully closed. */
  shown: Card | null;
  /** True while the retained card is animating out. */
  closing: boolean;
  dialogRef: RefObject<HTMLDivElement | null>;
}

interface CardModalHandlers {
  onClose: () => void;
  /** Step to the previous card in the list, if there is one. */
  onPrev?: () => void;
  /** Step to the next card in the list, if there is one. */
  onNext?: () => void;
}

export const useCardModal = (
  card: Card | null,
  { onClose, onPrev, onNext }: CardModalHandlers,
): Props => {
  // Last non-null card, kept so the exit animation still has content to show.
  const [retained, setRetained] = useState<Card | null>(card);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Latest handlers, so the keydown listener never needs to be re-bound.
  const handlers = useRef({ onClose, onPrev, onNext });

  useEffect(() => {
    handlers.current = { onClose, onPrev, onNext };
  });

  if (card && card !== retained) {
    setRetained(card);
  }

  useEffect(() => {
    if (!card) {
      // Closing: drop the retained card once the exit animation has run.
      const timer = setTimeout(() => setRetained(null), ANIM_MS);
      return () => clearTimeout(timer);
    }

    // Open: lock body scroll, wire keys, move focus into the dialog.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handlers.current.onClose();
      } else if (e.key === 'ArrowLeft') {
        handlers.current.onPrev?.();
      } else if (e.key === 'ArrowRight') {
        handlers.current.onNext?.();
      }
    };

    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [card]);

  return { shown: card ?? retained, closing: card === null, dialogRef };
};
