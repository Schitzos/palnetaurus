import { calculateDamage, gainSp, canUseSpecial } from '../src/data/battle';

describe('Battle Formulas', () => {
  describe('calculateDamage', () => {
    it('calculates basic damage', () => {
      const dmg = calculateDamage({ attackerAttack: 12, defenderDefense: 8, movePower: 10, isDefending: false, sameTypeBonus: false });
      expect(dmg).toBe(18); // 10 + 12 - floor(8*0.5) = 18
    });

    it('applies defend reduction', () => {
      const dmg = calculateDamage({ attackerAttack: 12, defenderDefense: 8, movePower: 10, isDefending: true, sameTypeBonus: false });
      expect(dmg).toBe(9); // floor(18 * 0.5) = 9
    });

    it('applies type bonus', () => {
      const dmg = calculateDamage({ attackerAttack: 12, defenderDefense: 8, movePower: 10, isDefending: false, sameTypeBonus: true });
      expect(dmg).toBe(21); // floor(18 * 1.2) = 21
    });

    it('minimum damage is 1', () => {
      const dmg = calculateDamage({ attackerAttack: 1, defenderDefense: 100, movePower: 1, isDefending: true, sameTypeBonus: false });
      expect(dmg).toBe(1);
    });
  });

  describe('SP system', () => {
    it('gains SP up to max', () => {
      expect(gainSp(0, 15)).toBe(15);
      expect(gainSp(90, 15)).toBe(100);
      expect(gainSp(95, 25)).toBe(100);
    });

    it('canUseSpecial only at 100', () => {
      expect(canUseSpecial(99)).toBe(false);
      expect(canUseSpecial(100)).toBe(true);
    });
  });
});
