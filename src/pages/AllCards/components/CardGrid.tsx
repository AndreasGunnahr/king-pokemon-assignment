import { useCallback, useMemo, useState } from 'react';

import { useInfiniteList } from '@/hooks/useInfiniteList';
import type { Card } from '@/types';

import { CardModal } from './CardModal';
import { CardTile } from './CardTile';
import { EmptyState } from './EmptyState';

interface Props {
  cards: Card[];
}

export const CardGrid = ({ cards }: Props) => {
  const { visible, sentinelRef, hasMore } = useInfiniteList(cards, 60);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedIndex = useMemo(
    () => (selectedId ? cards.findIndex((card) => card.id === selectedId) : -1),
    [cards, selectedId],
  );
  const selected = selectedIndex >= 0 ? (cards[selectedIndex] ?? null) : null;

  const closeModal = useCallback(() => setSelectedId(null), []);
  const openCard = useCallback((card: Card) => setSelectedId(card.id), []);
  const moveSelectionBy = useCallback(
    (offset: number) =>
      setSelectedId((id) => {
        const current = cards.findIndex((card) => card.id === id);
        const next = current + offset;
        const nextCard = current >= 0 ? cards[next] : undefined;

        return nextCard?.id ?? id;
      }),
    [cards],
  );

  const navigateToPreviousCard = useCallback(
    () => moveSelectionBy(-1),
    [moveSelectionBy],
  );
  const navigateToNextCard = useCallback(
    () => moveSelectionBy(1),
    [moveSelectionBy],
  );

  const hasPreviousCard = selectedIndex > 0;
  const hasNextCard = selectedIndex >= 0 && selectedIndex < cards.length - 1;

  if (cards.length === 0) {
    return <EmptyState>No cards match your search.</EmptyState>;
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {visible.map((card) => (
          <CardTile key={card.id} card={card} onOpen={openCard} />
        ))}
      </div>
      {hasMore && (
        <div
          ref={sentinelRef}
          role="status"
          className="py-8 text-center text-[13px] text-muted"
        >
          Loading more…
        </div>
      )}
      <CardModal
        card={selected}
        onClose={closeModal}
        onPrev={hasPreviousCard ? navigateToPreviousCard : undefined}
        onNext={hasNextCard ? navigateToNextCard : undefined}
        position={selected ? selectedIndex + 1 : undefined}
        total={cards.length}
      />
    </div>
  );
};
