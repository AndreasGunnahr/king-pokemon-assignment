import {
  RectangleStackIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';
import { NavLink } from 'react-router-dom';

import { useCollection } from '@/hooks/useCollection';

import { ChaseCards } from './ChaseCards';
import { EnergyTypes } from './EnergyTypes';
import { RarestCard } from './RarestCard';
import { TradeBinder } from './TradeBinder';

interface NavItem {
  to: string;
  label: string;
  end: boolean;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Overview', end: true, Icon: Squares2X2Icon },
  { to: '/cards', label: 'All cards', end: false, Icon: RectangleStackIcon },
];

export const Sidebar = () => {
  const { cards, duplicates } = useCollection();

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col gap-4 overflow-y-auto border-r border-border bg-surface-1 px-3 py-4">
      <div className="px-2">
        <p className="text-sm font-medium text-primary">Ash's collection</p>
        <p className="font-mono text-[11px] text-muted tabular-nums">
          {duplicates.totalRows} cards · {duplicates.uniqueCards} unique
        </p>
      </div>
      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ to, label, end, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] ${
                isActive
                  ? 'bg-bg-accent text-text-accent'
                  : 'text-secondary hover:bg-surface-2 hover:text-primary'
              }`
            }
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>
      <ChaseCards cards={cards} />
      <EnergyTypes cards={cards} />
      <TradeBinder duplicates={duplicates} />
      <RarestCard cards={cards} />
      <p className="mt-auto border-t text-center border-border px-2 pt-3 text-[11px] leading-relaxed text-muted">
        Pokémon TCG API
      </p>
    </aside>
  );
};
