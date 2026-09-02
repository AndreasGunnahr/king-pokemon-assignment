import { useMemo, useState } from 'react';

import { getHpValue, getMaxDamage } from '@/lib/damage';
import { setCode } from '@/lib/sets';
import { sortCards, type SortKey, type SortState } from '@/lib/sort';
import { typeColor } from '@/lib/typeColors';
import type { Card } from '@/types';

const PAGE_SIZE = 25;

const COLUMNS: Column[] = [
  { id: 'name', label: 'Name', align: 'left', sortKey: 'name' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'set', label: 'Set', align: 'left', sortKey: 'set' },
  { id: 'rarity', label: 'Rarity', align: 'left', sortKey: 'rarity' },
  { id: 'hp', label: 'HP', align: 'right', sortKey: 'hp' },
  { id: 'damage', label: 'Damage', align: 'right', sortKey: 'damage' },
];

interface Column {
  id: string;
  label: string;
  align: 'left' | 'right';
  sortKey?: SortKey;
}

interface Props {
  cards: Card[];
}

export const CollectionTable = ({ cards }: Props) => {
  const [sort, setSort] = useState<SortState>({ key: 'name', dir: 'asc' });
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => sortCards(cards, sort), [cards, sort]);
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

  // Jump back to the first page whenever the filtered list or sort changes
  // (adjusting state during render, per the React docs).
  const [prevView, setPrevView] = useState({ cards, sort });
  if (prevView.cards !== cards || prevView.sort !== sort) {
    setPrevView({ cards, sort });

    if (page !== 0) {
      setPage(0);
    }
  }

  const rows = sorted.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const toggleSort = (key: SortKey) =>
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: key === 'hp' || key === 'damage' ? 'desc' : 'asc' },
    );

  return (
    <div className="rounded-card border border-border bg-surface-2 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-border">
              {COLUMNS.map((col) => (
                <th
                  key={col.id}
                  className={`px-3.5 py-2.5 font-medium text-secondary ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.sortKey ? (
                    <button
                      type="button"
                      onClick={() => col.sortKey && toggleSort(col.sortKey)}
                      className="inline-flex items-center gap-1 hover:text-primary"
                    >
                      {col.label}
                      <span className="text-muted">
                        {sort.key === col.sortKey
                          ? sort.dir === 'asc'
                            ? '▲'
                            : '▼'
                          : ''}
                      </span>
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((card) => {
              const hp = getHpValue(card);
              const dmg = getMaxDamage(card);
              return (
                <tr
                  key={card.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-3.5 py-2.5 text-primary">{card.name}</td>
                  <td className="px-3.5 py-2.5">
                    {card.types?.length ? (
                      <span className="inline-flex items-center gap-1.5 text-secondary">
                        {card.types.map((tp) => (
                          <span
                            key={tp}
                            className="size-2 rounded-full"
                            style={{ background: typeColor(tp) }}
                            title={tp}
                          />
                        ))}
                        {card.types.join(' / ')}
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="px-3.5 py-2.5 font-mono text-secondary">
                    {setCode(card)}
                  </td>
                  <td className="px-3.5 py-2.5 text-secondary">
                    {card.rarity ?? '—'}
                  </td>
                  <td className="px-3.5 py-2.5 text-right font-mono tabular-nums">
                    {hp ?? '—'}
                  </td>
                  <td className="px-3.5 py-2.5 text-right font-mono tabular-nums">
                    {dmg ?? '—'}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-3.5 py-8 text-center text-muted"
                >
                  No cards match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pageCount > 1 && (
        <div className="flex items-center justify-between border-t border-border px-3.5 py-2 text-[13px] text-secondary">
          <span className="font-mono tabular-nums">
            {page * PAGE_SIZE + 1}–
            {Math.min((page + 1) * PAGE_SIZE, sorted.length)} of {sorted.length}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-md border border-border px-2 py-1 disabled:opacity-40 hover:enabled:border-border-strong"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={page >= pageCount - 1}
              className="rounded-md border border-border px-2 py-1 disabled:opacity-40 hover:enabled:border-border-strong"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
