/**
 * One color per Pokémon energy type, reused across every chart, the collection
 * table and (eventually) the grid so a given type always reads the same.
 *
 * Values are mid-saturation on purpose: they need to hold up on both the light
 * (`--surface-2` ≈ #fafafb) and dark (≈ #202027) panel background without a
 * per-theme palette.
 */
const TYPE_COLORS: Record<string, string> = {
  Grass: '#5fb35f',
  Fire: '#e05f3e',
  Water: '#4c90d4',
  Lightning: '#d9b13d',
  Psychic: '#b46fc4',
  Fighting: '#bf6f3f',
  Darkness: '#586b7a',
  Metal: '#8f9bab',
  Fairy: '#e08bbf',
  Dragon: '#9a7fd4',
  Colorless: '#b7b7b3',
};

/** Fallback for anything not in {@link TYPE_COLORS} (also `--text-muted`). */
export const UNKNOWN_TYPE_COLOR = '#9a9aa4';

export const typeColor = (type: string) =>
  TYPE_COLORS[type] ?? UNKNOWN_TYPE_COLOR;
