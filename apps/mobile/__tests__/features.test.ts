import { getTrainingGain, TRAINING_MAP } from '../src/data/training';
import { getBondLevel, PLAY_ACTIONS } from '../src/data/bond';
import { canRideDino } from '../src/data/ride';
import { rollDrop, ITEM_NAMES } from '../src/data/items';
import { canCreateDino, createCustomDino } from '../src/data/dinoLab';

describe('Training', () => {
  it('returns gain between 1-3 for low bond', () => {
    const gains = Array.from({ length: 50 }, () => getTrainingGain(20));
    expect(gains.every((g) => g >= 1 && g <= 3)).toBe(true);
  });

  it('returns gain between 2-4 for high bond (>=50)', () => {
    const gains = Array.from({ length: 50 }, () => getTrainingGain(60));
    expect(gains.every((g) => g >= 2 && g <= 4)).toBe(true);
  });

  it('has 5 training types', () => {
    expect(Object.keys(TRAINING_MAP)).toHaveLength(5);
  });
});

describe('Bond', () => {
  it('returns correct bond levels', () => {
    expect(getBondLevel(0)).toBe('shy');
    expect(getBondLevel(24)).toBe('shy');
    expect(getBondLevel(25)).toBe('friendly');
    expect(getBondLevel(50)).toBe('loyal');
    expect(getBondLevel(75)).toBe('best_partner');
    expect(getBondLevel(100)).toBe('best_partner');
  });

  it('has 5 play actions', () => {
    expect(Object.keys(PLAY_ACTIONS)).toHaveLength(5);
  });
});

describe('Ride', () => {
  const baseDino = { instanceId: '1', speciesId: 'tricub', source: 'starter' as const, level: 5, exp: 0, currentHp: 50, maxHp: 50, currentSp: 0, maxSp: 100, attack: 9, defense: 14, speed: 6, heightMeter: 1.5, bond: 60, rideable: true, moves: ['tackle'], specialMoveId: 'ancient_guardian' };

  it('allows ride when all conditions met', () => {
    expect(canRideDino(baseDino)).toBe(true);
  });

  it('rejects ride when height too low', () => {
    expect(canRideDino({ ...baseDino, heightMeter: 1.2 })).toBe(false);
  });

  it('rejects ride when bond too low', () => {
    expect(canRideDino({ ...baseDino, bond: 30 })).toBe(false);
  });

  it('rejects ride when fainted', () => {
    expect(canRideDino({ ...baseDino, currentHp: 0 })).toBe(false);
  });
});

describe('Items', () => {
  it('rollDrop returns string or null', () => {
    const results = Array.from({ length: 100 }, () => rollDrop());
    expect(results.some((r) => r !== null)).toBe(true);
    results.filter(Boolean).forEach((r) => expect(typeof r).toBe('string'));
  });

  it('ITEM_NAMES has entries', () => {
    expect(Object.keys(ITEM_NAMES).length).toBeGreaterThan(5);
  });
});

describe('DinoLab', () => {
  it('canCreateDino returns false without materials', () => {
    expect(canCreateDino({})).toBe(false);
  });

  it('canCreateDino returns true with sufficient materials', () => {
    const inv = { dino_gene_blueprint: 1, fire_gene: 1, power_gene: 1, guard_gene: 1 };
    expect(canCreateDino(inv)).toBe(true);
  });

  it('createCustomDino returns valid dino', () => {
    const dino = createCustomDino('TestDino', 'fire_gene', ['power_gene', 'guard_gene']);
    expect(dino.nickname).toBe('TestDino');
    expect(dino.source).toBe('created');
    expect(dino.attack).toBe(15); // 10 + 5
    expect(dino.defense).toBe(15); // 10 + 5
  });
});
