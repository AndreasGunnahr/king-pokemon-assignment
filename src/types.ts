/** Shape of a single entry in `ash_collection.json` (Pokémon TCG API card). */
export interface Attack {
  name: string;
  cost?: string[];
  convertedEnergyCost?: number;
  damage?: string;
  text?: string;
}

export interface WeaknessOrResistance {
  type: string;
  value: string;
}

export interface CardImages {
  small: string;
  large: string;
}

export type Legality = 'Legal' | 'Banned';

export interface Card {
  id: string;
  name: string;
  supertype: 'Pokémon' | 'Trainer' | 'Energy';
  subtypes?: string[];
  level?: string;
  hp?: string;
  types?: string[];
  evolvesFrom?: string;
  evolvesTo?: string[];
  attacks?: Attack[];
  abilities?: { name: string; text: string; type: string }[];
  weaknesses?: WeaknessOrResistance[];
  resistances?: WeaknessOrResistance[];
  retreatCost?: string[];
  convertedRetreatCost?: number;
  rules?: string[];
  number: string;
  artist?: string;
  rarity?: string;
  flavorText?: string;
  nationalPokedexNumbers?: number[];
  legalities: Partial<Record<'unlimited' | 'standard' | 'expanded', Legality>>;
  regulationMark?: string;
  images: CardImages;
}

export type Supertype = Card['supertype'];
