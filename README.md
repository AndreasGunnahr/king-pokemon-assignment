# Pokémon assignment - card collection dashboard

A dashboard for exploring Ash's ~2,100-card Pokémon TCG collection which contains summaries, stats, a headline chart, and a browsable, filterable card grid.

---

## Application flow

I split the app into two pages so each one has a single job:

1. The `/` (**Overview**) page is the read-at-a-glance view. Five headline stats, a rarity-mix bar, and an HP-vs-max-damage scatter colored by energy type with median reference lines. Clicking a dot or using the dropdowns filters the sortable, paginated table underneath, and the active filters show up as removable chips.

2. The `/cards` (**All cards**) page is the browse view. Every card as its printed art, filtered live by a name search plus card-type, energy-type, and rarity dropdowns. The grid loads more as you scroll (infinity scrolling), clicking a card opens a modal with the high-res art and its parsed properties (format legality, attacks, abilities, weakness/resistance, rules, flavor text).

A left sidebar runs alongside both pages which contains a couple of different stats overviews - the scarcest rarity tiers (chase cards), the energy-type spread, how many spare copies are sitting in the trade binder, and the single rarest card.

## How to run the code locally

1. Clone the repository to your computer.
2. Navigate into the folder and run `npm install`.
3. Run `npm run dev` and open http://localhost:5173.

Additional scripts:

- `npm run build`
- `npm test`
- `npm run lint`

## Built With

- [TypeScript](https://www.typescriptlang.org/) - language, in `strict` mode.
- [Vite](https://vitejs.dev/) - dev server and build.
- [React 19](https://react.dev/) - UI, using the new `use()` hook for data.
- [React Router](https://reactrouter.com/) - the two routes, with lazy loading.
- [Tailwind CSS v4](https://tailwindcss.com/) - styling, from a small `@theme` token palette.
- [ECharts](https://echarts.apache.org/) - the scatter chart, used via its raw API (no wrapper lib).
- [Heroicons](https://heroicons.com/) - icons.
- [Vitest](https://vitest.dev/) - unit tests for the data layer.
- [Claude Code](https://claude.com/claude-code) - AI coding tool. 

## Project structure

```
public/
└── ash_collection.json   Collection data (fetched at runtime, not bundled)
src/
├── main.tsx      Entry point which builds the router, mounts <App>.
├── App.tsx       Layout shell that holds the sidebar + Suspense / error boundary.
├── types.ts      Cross-page types for the collection data.
├── lib/          Pure logic for our static data (all unit-tested).
├── hooks/        Cross-page shared React hooks (the data fetch, infinite scroll).
├── components/   Cross-page components (sidebar, page header, filters).
└── pages/
    ├── Overview/
    │   ├── Overview.tsx
    │   └── components/  Locally used components only within the Overview page.
    └── AllCards/
        ├── AllCards.tsx
        └── components/   Locally used components only within the AllCards page.
```

## Approach & trade-offs

- **All the data crunching lives in `src/lib`** as pure functions / helpers of the collection data (`derive.ts`, `damage.ts`, `filter.ts`, `sets.ts`, `sort.ts`) and is unit-tested, so the components stay thin. One module-level `fetch` in `src/hooks/useCollection.tsx` is shared through React 19's `use()`, with `<Suspense>` and an error boundary in `App.tsx` covering the loading and failure states.
- **The export has ~300 exact-duplicate rows** (same `id`, identical fields), so `dedupeById` drops them on load. Genuinely different printings keep their own ids and are kept. The raw copy counts still feed the "trade binder" panel.
- **Attack damage is free text** (`"90"`, `"10×"`, `"20+"`, `""`). "Max damage" takes the leading integer and ignores modifiers. A card with no numeric damage is left out of the scatter and shown as "-" in the table.
- **The data has no set names or dates**, only the code baked into each `id` (`base3`, `swsh9`), so the UI shows that raw code and I skipped the "collection by set over time" idea from the mockup.
- **One headline chart, not a wall of panels.** The scatter leads. Rarity stays as a compact stacked bar, and the energy-type breakdown lives in the scatter color, the table's Type column, and the sidebar. The table stays near the top.
- **The 2.6 MB JSON is fetched, not imported**, so it stays out of the JS bundle and is cached on its own. ECharts is heavy, so the Overview route (and with it ECharts) is lazy-loaded. That chunk is still large, which I'd fix with per-module ECharts imports or a lighter chart lib.
- **Dark-only "warm charcoal" theme.** A single brown-tinted token palette on `:root` in `src/index.css`, surfaced to Tailwind via `@theme`. The design commits to one look. There is no light mode.

## Not implemented / next steps

- **Set code → name & date mapping** (vendored from the Pokémon TCG API), which would bring back a "collection over time" chart and real set names everywhere.
- **Format toggle** (Standard / Expanded / All) to re-slice every stat and chart.
- **Card modal a11y**: trap focus while open, return focus to the tile on close, and `aria-sort` on the table headers.
- **Responsive layout.** The card and stat grids reflow, but the shell is built for desktop. The sidebar is a fixed rail with no mobile nav, and the scatter and table get cramped on small screens.
- **Fuller error handling.** Today there is one top-level error boundary with a reload prompt. Next would be a retry that re-runs the fetch instead of forcing a refresh, a route-level `errorElement` with a 404 page, and failures reported to a monitoring service.
- **URL-synced filters** so a filtered view is shareable.
- **i18n** All copies is inline English right now. It would move to a message catalogue (e.g. `react-intl` / `i18next`) with locale-aware number formatting.
- **Component / interaction tests** Only the `src/lib` derivations are covered.
