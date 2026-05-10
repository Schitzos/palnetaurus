// Ride system per GDD §10
import type { PlayerDino } from '@palnetaurus/shared';

export function canRideDino(dino: PlayerDino): boolean {
  return dino.heightMeter >= 1.4 && dino.bond >= 50 && dino.currentHp > 0;
}
