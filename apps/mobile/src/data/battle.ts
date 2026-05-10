import { MAX_SP, SP_GAIN_ATTACK, SP_GAIN_DEFEND, SP_GAIN_DAMAGE } from '@palnetaurus/shared';
import type { WildDino } from './encounters';

export type BattleState = 'action_select' | 'execute' | 'win' | 'lose' | 'catch' | 'run';

export type BattleDino = {
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
  isDefending: boolean;
};

export type BattleAction = 'attack' | 'defend' | 'special' | 'dino_ball' | 'run';

// BATTLE-002: Damage formula per GDD §7.4
export function calculateDamage(params: {
  attackerAttack: number;
  defenderDefense: number;
  movePower: number;
  isDefending: boolean;
  sameTypeBonus: boolean;
}): number {
  const rawDamage = params.movePower + params.attackerAttack - Math.floor(params.defenderDefense * 0.5);
  const typeBonus = params.sameTypeBonus ? 1.2 : 1;
  const defendReduction = params.isDefending ? 0.5 : 1;
  return Math.max(1, Math.floor(rawDamage * typeBonus * defendReduction));
}

// BATTLE-003: SP management
export function gainSp(current: number, amount: number): number {
  return Math.min(MAX_SP, current + amount);
}

export function canUseSpecial(sp: number): boolean {
  return sp >= MAX_SP;
}

// BATTLE-006: Wild dino AI
export function getAiAction(dino: BattleDino): BattleAction {
  if (canUseSpecial(dino.currentSp) && Math.random() < 0.1) return 'special';
  return Math.random() < 0.7 ? 'attack' : 'defend';
}

// Move power lookup
const MOVE_POWER: Record<string, number> = {
  scratch: 8, quick_bite: 10, tackle: 8, horn_bump: 10, bite: 10, roar: 6,
  tail_whip: 8, stomp: 10, vine_slap: 9, leaf_cut: 10, slam: 9, curl: 0,
  wing_slash: 10, dive: 12, sonic_claw: 25, ancient_guardian: 20, primal_crush: 28,
  plate_shield: 18, forest_fury: 22, iron_tail: 20, sky_strike: 24,
};

export function getMovePower(moveId: string): number {
  return MOVE_POWER[moveId] || 8;
}

// BATTLE-004/005: Execute a turn
export function executeTurn(
  attacker: BattleDino,
  defender: BattleDino,
  action: BattleAction,
): { damage: number; attackerSp: number; defenderSp: number; escaped: boolean } {
  if (action === 'run') {
    return { damage: 0, attackerSp: attacker.currentSp, defenderSp: defender.currentSp, escaped: Math.random() < 0.5 };
  }

  if (action === 'defend') {
    return { damage: 0, attackerSp: gainSp(attacker.currentSp, SP_GAIN_DEFEND), defenderSp: defender.currentSp, escaped: false };
  }

  const isSpecial = action === 'special';
  const moveId = isSpecial ? attacker.specialMoveId : attacker.moves[0];
  const movePower = isSpecial ? getMovePower(moveId) * 2 : getMovePower(moveId);

  const damage = calculateDamage({
    attackerAttack: attacker.attack,
    defenderDefense: defender.defense,
    movePower,
    isDefending: defender.isDefending,
    sameTypeBonus: false,
  });

  const attackerSp = isSpecial ? 0 : gainSp(attacker.currentSp, SP_GAIN_ATTACK);
  const defenderSp = gainSp(defender.currentSp, SP_GAIN_DAMAGE);

  return { damage, attackerSp, defenderSp, escaped: false };
}
