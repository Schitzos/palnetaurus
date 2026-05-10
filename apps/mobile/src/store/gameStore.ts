import { create } from 'zustand';
import type { GameSave, PlayerDino, DinopediaEntry } from '@palnetaurus/shared';
import { autoSave } from '../utils/storage';

type GameState = {
  player: { id: string; name: string } | null;
  world: { currentMapId: string; x: number; y: number };
  dinos: { owned: PlayerDino[]; teamIds: string[] };
  inventory: Record<string, number>;
  dinopedia: Record<string, DinopediaEntry>;
  setPlayer: (player: { id: string; name: string }) => void;
  setWorld: (world: { currentMapId: string; x: number; y: number }) => void;
  addDino: (dino: PlayerDino) => void;
  updateInventory: (itemId: string, delta: number) => void;
  updateDinopedia: (entry: DinopediaEntry) => void;
  loadSave: (save: GameSave) => void;
  triggerAutoSave: () => void;
};

export const useGameStore = create<GameState>((set, get) => ({
  player: null,
  world: { currentMapId: 'starter_valley', x: 1, y: 1 },
  dinos: { owned: [], teamIds: [] },
  inventory: {},
  dinopedia: {},
  setPlayer: (player) => set({ player }),
  setWorld: (world) => {
    set({ world });
    autoSave(get);
  },
  addDino: (dino) => {
    set((state) => ({
      dinos: { ...state.dinos, owned: [...state.dinos.owned, dino] },
    }));
    autoSave(get);
  },
  updateInventory: (itemId, delta) => {
    set((state) => ({
      inventory: {
        ...state.inventory,
        [itemId]: (state.inventory[itemId] || 0) + delta,
      },
    }));
  },
  updateDinopedia: (entry) => {
    set((state) => ({
      dinopedia: { ...state.dinopedia, [entry.dinoId]: entry },
    }));
  },
  loadSave: (save) =>
    set({
      player: save.player,
      world: save.world,
      dinos: save.dinos,
      inventory: save.inventory,
      dinopedia: save.dinopedia,
    }),
  triggerAutoSave: () => autoSave(get),
}));
