# Pokémon assignment - card collection dashboard

A dashboard for digging through Ash's ~2,100-card Pokémon TCG collection. Summary stats, one chart, and a filterable grid of every card.

---

## Application flow

I split the app into two pages so each one has a single job:

1. The `/` (**Overview**) page is the summary view. Five stat tiles, a rarity-mix bar, and an HP-vs-damage scatter colored by energy type with median lines. Click a dot or pick a dropdown value and the table below filters to match. Whatever is active shows as a chip you can click to remove.

2. The `/cards` (**All cards**) page is for browsing. Every card as its printed art, with a name search and the same type and rarity dropdowns. It pages in more cards as you scroll. Click one for a modal with the full-size art and the parsed card details (attacks, abilities, legality, weakness, rules, flavor text).

A sidebar sits next to both pages with a few extra breakdowns: the scarcest rarity tiers, the energy-type spread, how many duplicate copies could go in a trade binder, and the single rarest card.

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
├── main.tsx      Entry point. Builds the router and mounts <App>.
├── App.tsx       Layout shell that holds the sidebar + Suspense / error boundary.
├── types.ts      Cross-page types for the collection data.
├── lib/          Pure logic for the static data (all unit-tested).
├── hooks/        Cross-page React hooks (the data fetch, infinite scroll).
├── components/   Cross-page components (sidebar, page header, filters).
└── pages/
    ├── Overview/
    │   ├── Overview.tsx
    │   └── components/   Used only within the Overview page.
    └── AllCards/
        ├── AllCards.tsx
        └── components/   Used only within the AllCards page.
```

## Approach & trade-offs

- **The data logic sits in `src/lib`** (`derive.ts`, `damage.ts`, `filter.ts`, `sets.ts`, `sort.ts`) as plain functions over the card array, all unit-tested, so the components don't do much. `src/hooks/useCollection.tsx` runs one `fetch` at module load and hands the result to every caller through React 19's `use()`. `App.tsx` wraps the app in a `<Suspense>` and an error boundary for the loading and error states.
- **The export repeats ~300 rows exactly** (same `id`, same fields), so `dedupeById` removes them on load. Real alternate printings have their own ids and stay. The pre-dedupe counts still feed the trade-binder panel.
- **Attack damage is free text** (`"90"`, `"10×"`, `"20+"`, `""`). "Max damage" reads the leading number and drops the modifier. Cards with no number are left out of the scatter and show "-" in the table.
- **There are no set names or dates in the data**, just the code inside each `id` (`base3`, `swsh9`). So the UI shows the code as-is, and I dropped the "collection over time" chart from the mockup.
- **One chart and one table.** The scatter is the main visual. Rarity is a small stacked bar in the summary, and energy type shows up in the scatter colors, the table's Type column, and the sidebar. The table sits high on the page instead of below a stack of panels.
- **The 2.6 MB JSON is fetched at runtime**, not imported, so it is not in the JS bundle and the browser caches it on its own.
- **ECharts is big.** The Overview route loads lazily and pulls ECharts in with it. That chunk is still heavy. I would trim it with per-module ECharts imports or a smaller charting lib.
- **Dark-only theme.** One brown-tinted token palette on `:root` in `src/index.css`, exposed to Tailwind through `@theme`. There is no light mode. The look is fixed on purpose.

## Not implemented / next steps

- **Set code to name and date mapping** (from the Pokémon TCG API). Would bring back a collection-over-time chart and real set names in the table and filters.
- **Format toggle** (Standard / Expanded / All) to re-slice every stat and chart.
- **Accessibility.** Color contrast is covered, but keyboard and screen-reader support is thin. The card modal needs a focus trap and focus return, the sortable table headers need `aria-sort`, and the scatter chart is mouse-only.
- **Responsive layout.** The card and stat grids already reflow, but the frame is desktop-first. The sidebar is a fixed column with no mobile menu, and the scatter and table are tight on a phone.
- **Better error handling.** Right now there is one error boundary at the top with a "reload the page" message. I would add a retry that re-runs the fetch without a full refresh, a route-level `errorElement` and a 404 page, and error reporting to something like Sentry.
- **Filters in the URL** so a filtered view can be shared.
- **i18n.** All the copy is hard-coded English. It would move into a message catalogue (`react-intl` or `i18next`) with locale-aware number formatting.
- **Component and interaction tests.** Only the `src/lib` functions have tests so far.
