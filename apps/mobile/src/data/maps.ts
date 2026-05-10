import type { Direction } from '@palnetaurus/shared';

export type TerrainType = 'path' | 'grass' | 'wild_grass' | 'tree' | 'rock' | 'water' | 'portal';

export type TerrainConfig = {
  walkable: boolean;
  encounterEnabled: boolean;
  encounterChance?: number;
  encounterTableId?: string;
  requiredRideType?: string;
  transitionTo?: string;
};

export const TERRAIN_CONFIG: Record<TerrainType, TerrainConfig> = {
  path: { walkable: true, encounterEnabled: false },
  grass: { walkable: true, encounterEnabled: false },
  wild_grass: { walkable: true, encounterEnabled: true, encounterChance: 0.15, encounterTableId: 'starter_valley_grass' },
  tree: { walkable: false, encounterEnabled: false },
  rock: { walkable: false, encounterEnabled: false },
  water: { walkable: false, encounterEnabled: false, requiredRideType: 'water' },
  portal: { walkable: true, encounterEnabled: false, transitionTo: 'forest_entrance' },
};

export type GameMap = {
  id: string;
  name: string;
  width: number;
  height: number;
  defaultSpawn: { x: number; y: number };
  tiles: TerrainType[][];
};

export const STARTER_VALLEY_MAP: GameMap = {
  id: 'starter_valley',
  name: 'Starter Valley',
  width: 10,
  height: 8,
  defaultSpawn: { x: 1, y: 1 },
  tiles: [
    ['tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree'],
    ['tree', 'path', 'path', 'path', 'grass', 'grass', 'grass', 'path', 'path', 'tree'],
    ['tree', 'path', 'wild_grass', 'wild_grass', 'grass', 'rock', 'grass', 'path', 'path', 'tree'],
    ['tree', 'path', 'wild_grass', 'wild_grass', 'grass', 'grass', 'grass', 'path', 'path', 'tree'],
    ['tree', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'tree'],
    ['tree', 'water', 'water', 'path', 'path', 'grass', 'grass', 'grass', 'path', 'tree'],
    ['tree', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'portal', 'tree'],
    ['tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree'],
  ],
};

export const MAPS: Record<string, GameMap> = {
  starter_valley: STARTER_VALLEY_MAP,
};

export function getNextPosition(current: { x: number; y: number }, direction: Direction) {
  switch (direction) {
    case 'up': return { x: current.x, y: current.y - 1 };
    case 'down': return { x: current.x, y: current.y + 1 };
    case 'left': return { x: current.x - 1, y: current.y };
    case 'right': return { x: current.x + 1, y: current.y };
  }
}

export function canMoveTo(map: GameMap, x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) return false;
  const tile = map.tiles[y][x];
  return TERRAIN_CONFIG[tile].walkable;
}
