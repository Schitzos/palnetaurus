// Dino Lab per GDD §12
import type { PlayerDino } from '@palnetaurus/shared';

const ELEMENT_GENES = ['fire_gene', 'water_gene', 'earth_gene', 'air_gene'];
const STAT_GENES = ['power_gene', 'guard_gene', 'speed_gene'];

export function canCreateDino(inventory: Record<string, number>): boolean {
  if ((inventory['dino_gene_blueprint'] || 0) < 1) return false;
  const hasElement = ELEMENT_GENES.some((g) => (inventory[g] || 0) >= 1);
  const statCount = STAT_GENES.reduce((s, g) => s + Math.min(inventory[g] || 0, 2), 0);
  return hasElement && statCount >= 2;
}

export function createCustomDino(
  name: string,
  elementGene: string,
  statGenes: string[],
): PlayerDino {
  const typeMap: Record<string, string> = { fire_gene: 'fire', water_gene: 'water', earth_gene: 'earth', air_gene: 'air' };
  let attack = 10, defense = 10, speed = 10, hp = 40;
  for (const g of statGenes) {
    if (g === 'power_gene') attack += 5;
    if (g === 'guard_gene') defense += 5;
    if (g === 'speed_gene') speed += 5;
  }
  return {
    instanceId: `custom_${Date.now()}`,
    speciesId: `custom_${name.toLowerCase().replace(/\s/g, '_')}`,
    nickname: name,
    source: 'created',
    level: 1,
    exp: 0,
    currentHp: hp,
    maxHp: hp,
    currentSp: 0,
    maxSp: 100,
    attack,
    defense,
    speed,
    heightMeter: 1.4,
    bond: 30,
    rideable: true,
    moves: ['tackle', 'bite'],
    specialMoveId: 'primal_crush',
    createdAt: new Date().toISOString(),
  };
}

export { ELEMENT_GENES, STAT_GENES };
