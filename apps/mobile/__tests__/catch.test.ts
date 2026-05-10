import { calculateCatchChance } from '../src/data/catch';

describe('Catch Formula', () => {
  it('higher chance at lower HP', () => {
    const fullHp = calculateCatchChance({ currentHp: 100, maxHp: 100, baseCatchRate: 0.3, ballBonus: 0 });
    const halfHp = calculateCatchChance({ currentHp: 50, maxHp: 100, baseCatchRate: 0.3, ballBonus: 0 });
    const lowHp = calculateCatchChance({ currentHp: 10, maxHp: 100, baseCatchRate: 0.3, ballBonus: 0 });
    expect(halfHp).toBeGreaterThan(fullHp);
    expect(lowHp).toBeGreaterThan(halfHp);
  });

  it('respects min 5% and max 95%', () => {
    const min = calculateCatchChance({ currentHp: 100, maxHp: 100, baseCatchRate: 0.01, ballBonus: 0 });
    const max = calculateCatchChance({ currentHp: 1, maxHp: 100, baseCatchRate: 0.9, ballBonus: 0.5 });
    expect(min).toBe(0.05);
    expect(max).toBe(0.95);
  });

  it('ball bonus increases chance', () => {
    const noBall = calculateCatchChance({ currentHp: 50, maxHp: 100, baseCatchRate: 0.3, ballBonus: 0 });
    const withBall = calculateCatchChance({ currentHp: 50, maxHp: 100, baseCatchRate: 0.3, ballBonus: 0.15 });
    expect(withBall).toBeGreaterThan(noBall);
  });
});
