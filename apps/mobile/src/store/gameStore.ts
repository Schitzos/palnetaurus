import { create } from 'zustand';
import type { GameSave, PlayerDino, DinopediaEntry } from '@palnetaurus/shared';

type GameState = {
  player: { id: string; name: string } | null;
  world: { currentMapId: string; x: number; y: number };
  dinos: { owned: PlayerDino[]; teamIds: string[] };
  inventory: Record<string, number>;
  dinopedia: Record<string, DinopediaEntry>;
  setPlayer: (player: { id: string; name: string }) => void;
  setWorld: (world: { currentMapId: string; x: number; y: number }) => void;
  addDino: (dino: PlayerDino) => void;
  loadSave: (save: GameSave) => void;
};

export const useGameStore = create<GameState>((set) => ({
  player: null,
  world: { currentMapId: 'starter_valley', x: 1, y: 1 },
  dinos: { owned: [], teamIds: [] },
  inventory: {},
  dinopedia: {},
  setPlayer: (player) => set({ player }),
  setWorld: (world) => set({ world }),
  addDino: (dino) =>
    set((state) => ({
      dinos: { ...state.dinos, owned: [...state.dinos.owned, dino] },
    })),
  loadSave: (save) =>
    set({
      player: save.player,
      world: save.world,
      dinos: save.dinos,
      inventory: save.inventory,
      dinopedia: save.dinopedia,
    }),
}));
