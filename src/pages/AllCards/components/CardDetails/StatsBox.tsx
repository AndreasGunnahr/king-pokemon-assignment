import { useMemo } from 'react';

import { useCollection } from '@/hooks/useCollection';
import { getRarityLabel } from '@/lib/derive';
import { setCode } from '@/lib/sets';
import type { Card } from '@/types';

import { Stat } from './Stat';

interface Props {
  card: Card;
}

/** Copies held, rarity, set and artist for the card — each annotated with how
 *  many other cards in the collection share that trait. */
export const StatsBox = ({ card }: Props) => {
  const { cards, duplicates } = useCollection();

  const peers = useMemo(() => {
    const rarity = getRarityLabel(card);
    const set = setCode(card);
    let rarityPeers = 0;
    let setPeers = 0;
    let artistPeers = 0;

    for (const other of cards) {
      if (getRarityLabel(other) === rarity) {
        rarityPeers += 1;
      }
      if (setCode(other) === set) {
        setPeers += 1;
      }
      if (card.artist && other.artist === card.artist) {
        artistPeers += 1;
      }
    }

    return { rarityPeers, setPeers, artistPeers };
  }, [cards, card]);

  const copies = duplicates.byId[card.id] ?? 1;

  return (
    <dl className="rounded-lg bg-surface-2 px-3 py-2.5">
      <Stat label="Copies held" value={`${copies}`} />
      <Stat
        label="Rarity"
        value={getRarityLabel(card)}
        meta={`${peers.rarityPeers} in collection`}
      />
      <Stat
        label="Set"
        value={`${setCode(card)} #${card.number}`}
        meta={`${peers.setPeers} held`}
      />
      <Stat
        label="Artist"
        value={card.artist ?? 'Unknown'}
        meta={card.artist ? `${peers.artistPeers} in collection` : undefined}
        last
      />
    </dl>
  );
};
