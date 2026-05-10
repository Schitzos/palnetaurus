export type DinoSpecies = {
  id: string;
  name: string;
  species: string;
  type: string;
  heightMeter: number;
  rideable: boolean;
  baseStats: { hp: number; sp: number; attack: number; defense: number; speed: number };
  moves: string[];
  specialMoveId: string;
};

export const STARTER_DINOS: DinoSpecies[] = [
  {
    id: 'raptiny',
    name: 'Raptiny',
    species: 'Raptor',
    type: 'speed',
    heightMeter: 1.2,
    rideable: false,
    baseStats: { hp: 38, sp: 100, attack: 12, defense: 7, speed: 15 },
    moves: ['scratch', 'quick_bite'],
    specialMoveId: 'sonic_claw',
  },
  {
    id: 'tricub',
    name: 'Tricub',
    species: 'Triceratops',
    type: 'earth',
    heightMeter: 1.5,
    rideable: true,
    baseStats: { hp: 50, sp: 100, attack: 9, defense: 14, speed: 6 },
    moves: ['tackle', 'horn_bump'],
    specialMoveId: 'ancient_guardian',
  },
  {
    id: 'rexlet',
    name: 'Rexlet',
    species: 'T-Rex',
    type: 'power',
    heightMeter: 1.8,
    rideable: true,
    baseStats: { hp: 44, sp: 100, attack: 15, defense: 8, speed: 9 },
    moves: ['bite', 'roar'],
    specialMoveId: 'primal_crush',
  },
];
