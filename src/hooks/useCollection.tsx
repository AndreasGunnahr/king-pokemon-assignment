import { use } from 'react';

import {
  dedupeById,
  type DuplicateStats,
  getDuplicateStats,
} from '@/lib/derive';
import type { Card } from '@/types';

const DATA_URL = `${import.meta.env.BASE_URL}ash_collection.json`;

export interface Collection {
  cards: Card[];
  duplicates: DuplicateStats;
}

// Created once at import. Every caller shares this promise.
const collection: Promise<Collection> = fetch(DATA_URL)
  .then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to load collection (HTTP ${res.status})`);
    }

    return res.json() as Promise<Card[]>;
  })
  .then((raw) => {
    if (!Array.isArray(raw) || raw.length === 0) {
      throw new Error('Collection payload is empty or malformed');
    }

    return { cards: dedupeById(raw), duplicates: getDuplicateStats(raw) };
  });

export const useCollection = () => use(collection);
