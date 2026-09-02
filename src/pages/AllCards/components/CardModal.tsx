import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { createPortal } from 'react-dom';

import type { Card } from '@/types';

import { CardDetails } from './CardDetails/CardDetails';
import { CardImage } from './CardImage';
import { useCardModal } from './CardModal.hook';

interface Props {
  card: Card | null;
  onClose: () => void;
  /** Step to the previous card. Omitted at the start of the list. */
  onPrev?: () => void;
  /** Step to the next card. Omitted at the end of the list. */
  onNext?: () => void;
  /** 1-based position of the current card in the list. */
  position?: number;
  /** Length of the list the arrows step through. */
  total?: number;
}

const iconButton =
  'flex size-7 cursor-pointer items-center justify-center rounded-md border border-border text-secondary transition-colors hover:border-border-strong hover:text-primary disabled:cursor-default disabled:opacity-35 disabled:hover:border-border disabled:hover:text-secondary';

export const CardModal = ({
  card,
  onClose,
  onPrev,
  onNext,
  position,
  total,
}: Props) => {
  const { shown, closing, dialogRef } = useCardModal(card, {
    onClose,
    onPrev,
    onNext,
  });

  if (!shown) {
    return null;
  }

  return createPortal(
    <div
      onClick={onClose}
      data-closing={closing ? '' : undefined}
      className="card-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={shown.name}
        tabIndex={-1}
        data-closing={closing ? '' : undefined}
        onClick={(e) => e.stopPropagation()}
        className="card-modal-panel relative flex max-h-[86vh] w-full max-w-2xl flex-col overflow-hidden rounded-card border border-border bg-surface-1 p-4 shadow-2xl outline-none"
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onPrev}
              disabled={!onPrev}
              aria-label="Previous card"
              className={iconButton}
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!onNext}
              aria-label="Next card"
              className={iconButton}
            >
              <ChevronRightIcon className="size-4" />
            </button>
            {position && total ? (
              <span className="ml-1.5 font-mono text-[11px] text-muted tabular-nums">
                {position} of {total}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={iconButton}
          >
            <XMarkIcon className="size-4" />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 gap-4 overflow-y-auto pr-1 max-sm:flex-col">
          <div className="w-44 shrink-0 self-start max-sm:mx-auto">
            <a
              href={shown.images.large || shown.images.small}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <CardImage card={shown} className="w-full rounded-lg" />
            </a>
            <p className="mt-2 text-center text-[11px] text-muted">
              Open full size ↗
            </p>
          </div>
          <div className="min-w-0 flex-1">
            <CardDetails card={shown} />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
