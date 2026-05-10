import { TERRAIN_CONFIG, TerrainType } from './maps';

export type EncounterEntry = {
  dinoId: string;
  minLevel: number;
  maxLevel: number;
  weight: number;
};

export type WildDino = {
  speciesId: string;
  level: number;
  currentHp: number;
  maxHp: number;
  currentSp: number;
  maxSp: number;
  attack: number;
  defense: number;
  speed: number;
  moves: string[];
  specialMoveId: string;
};

// DISCOVER-003: Encounter tables per GDD §6.6
export const ENCOUNTER_TABLES: Record<string, EncounterEntry[]> = {
  starter_valley_grass: [
    { dinoId: 'tiny_stego', minLevel: 2, maxLevel: 4, weight: 40 },
    { dinoId: 'leafy_saur', minLevel: 2, maxLevel: 5, weight: 35 },
    { dinoId: 'baby_ankylo', minLevel: 3, maxLevel: 5, weight: 20 },
    { dinoId: 'mini_ptera', minLevel: 4, maxLevel: 6, weight: 5 },
  ],
};

// Wild dino base stats (simple scaling)
const WILD_DINO_BASE: Record<string, { hp: number; attack: number; defense: number; speed: number; moves: string[]; specialMoveId: string }> = {
  tiny_stego: { hp: 35, attack: 8, defense: 12, speed: 5, moves: ['tail_whip', 'stomp'], specialMoveId: 'plate_shield' },
  leafy_saur: { hp: 32, attack: 10, defense: 8, speed: 9, moves: ['vine_slap', 'leaf_cut'], specialMoveId: 'forest_fury' },
  baby_ankylo: { hp: 45, attack: 7, defense: 15, speed: 4, moves: ['slam', 'curl'], specialMoveId: 'iron_tail' },
  mini_ptera: { hp: 28, attack: 13, defense: 6, speed: 14, moves: ['wing_slash', 'dive'], specialMoveId: 'sky_strike' },
};

// DISCOVER-001: Check if encounter should trigger
export function shouldTriggerEncounter(tileType: TerrainType): boolean {
  const config = TERRAIN_CONFIG[tileType];
  if (!config?.encounterEnabled) return false;
  return Math.random() < (config.encounterChance || 0);
}

// DISCOVER-002: Pick weighted encounter
export function pickWeightedEncounter(tableId: string): EncounterEntry | null {
  const table = ENCOUNTER_TABLES[tableId];
  if (!table || table.length === 0) return null;

  const totalWeight = table.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const entry of table) {
    roll -= entry.weight;
    if (roll <= 0) return entry;
  }
  return table[0];
}

// DISCOVER-004: Generate wild dino instance
export function generateWildDino(encounter: EncounterEntry): WildDino {
  const level = Math.floor(Math.random() * (encounter.maxLevel - encounter.minLevel + 1)) + encounter.minLevel;
  const base = WILD_DINO_BASE[encounter.dinoId] || { hp: 30, attack: 8, defense: 8, speed: 8, moves: ['tackle'], specialMoveId: 'struggle' };

  const scale = 1 + (level - 1) * 0.1;
  const hp = Math.floor(base.hp * scale);

  return {
    speciesId: encounter.dinoId,
    level,
    currentHp: hp,
    maxHp: hp,
    currentSp: 0,
    maxSp: 100,
    attack: Math.floor(base.attack * scale),
    defense: Math.floor(base.defense * scale),
    speed: Math.floor(base.speed * scale),
    moves: base.moves,
    specialMoveId: base.specialMoveId,
  };
}
