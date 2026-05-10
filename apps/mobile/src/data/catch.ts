// Catch system per GDD §8

export function calculateCatchChance(params: {
  currentHp: number;
  maxHp: number;
  baseCatchRate: number;
  ballBonus: number;
}): number {
  const hpRatio = params.currentHp / params.maxHp;
  const hpBonus = 1 - hpRatio;
  const chance = params.baseCatchRate + hpBonus * 0.5 + params.ballBonus;
  return Math.min(0.95, Math.max(0.05, chance));
}

// Base catch rates per species rarity
export const BASE_CATCH_RATES: Record<string, number> = {
  tiny_stego: 0.4,
  leafy_saur: 0.35,
  baby_ankylo: 0.25,
  mini_ptera: 0.15,
};

// Ball bonuses
export const BALL_BONUS: Record<string, number> = {
  dino_ball: 0.0,
  strong_dino_ball: 0.15,
  ultra_dino_ball: 0.3,
};

export function attemptCatch(wildSpeciesId: string, currentHp: number, maxHp: number, ballType: string): boolean {
  const baseCatchRate = BASE_CATCH_RATES[wildSpeciesId] || 0.3;
  const ballBonus = BALL_BONUS[ballType] || 0;
  const chance = calculateCatchChance({ currentHp, maxHp, baseCatchRate, ballBonus });
  return Math.random() < chance;
}
