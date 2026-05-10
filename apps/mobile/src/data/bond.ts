// Bond system per GDD §9.2-9.3

export type BondLevel = 'shy' | 'friendly' | 'loyal' | 'best_partner';

export function getBondLevel(bond: number): BondLevel {
  if (bond >= 75) return 'best_partner';
  if (bond >= 50) return 'loyal';
  if (bond >= 25) return 'friendly';
  return 'shy';
}

export type PlayAction = 'feed' | 'pet' | 'play_ball' | 'clean' | 'rest';

export const PLAY_ACTIONS: Record<PlayAction, { label: string; delta: number }> = {
  feed: { label: 'Feed', delta: 5 },
  pet: { label: 'Pet', delta: 3 },
  play_ball: { label: 'Play Ball', delta: 4 },
  clean: { label: 'Clean', delta: 3 },
  rest: { label: 'Rest', delta: 2 },
};
