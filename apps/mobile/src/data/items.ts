// Item drop system per GDD §13

const DROP_TABLE = [
  { id: 'basic_gene_fragment', weight: 35 },
  { id: 'power_gene', weight: 15 },
  { id: 'guard_gene', weight: 15 },
  { id: 'speed_gene', weight: 15 },
  { id: 'dino_gene_blueprint', weight: 5 },
  { id: 'mutation_core', weight: 2 },
  { id: null, weight: 13 },
];

export function rollDrop(): string | null {
  const total = DROP_TABLE.reduce((s, e) => s + e.weight, 0);
  let roll = Math.random() * total;
  for (const entry of DROP_TABLE) {
    roll -= entry.weight;
    if (roll <= 0) return entry.id;
  }
  return null;
}

export const ITEM_NAMES: Record<string, string> = {
  dino_ball: 'Dino Ball',
  strong_dino_ball: 'Strong Dino Ball',
  basic_gene_fragment: 'Gene Fragment',
  power_gene: 'Power Gene',
  guard_gene: 'Guard Gene',
  speed_gene: 'Speed Gene',
  dino_gene_blueprint: 'Dino Gene Blueprint',
  mutation_core: 'Mutation Core',
};
