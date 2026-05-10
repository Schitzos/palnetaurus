import { create } from 'zustand';
import type { GameSave, PlayerDino, DinopediaEntry } from '@palnetaurus/shared';
import { autoSave } from '../utils/storage';

type GameState = {
  player: { id: string; name: string } | null;
  world: { currentMapId: string; x: number; y: number };
  dinos: { owned: PlayerDino[]; teamIds: string[] };
  inventory: Record<string, number>;
  dinopedia: Record<string, DinopediaEntry>;
  energy: number;
  isRiding: boolean;
  mountedDinoId: string | null;
  setPlayer: (player: { id: string; name: string }) => void;
  setWorld: (world: { currentMapId: string; x: number; y: number }) => void;
  addDino: (dino: PlayerDino) => void;
  updateInventory: (itemId: string, delta: number) => void;
  updateDinopedia: (entry: DinopediaEntry) => void;
  updateDinoStats: (instanceId: string, stats: Partial<Pick<PlayerDino, 'attack' | 'defense' | 'speed' | 'maxHp' | 'maxSp' | 'currentHp'>>) => void;
  updateDinoBond: (instanceId: string, delta: number) => void;
  setRiding: (dinoId: string | null) => void;
  useEnergy: () => boolean;
  loadSave: (save: GameSave) => void;
  triggerAutoSave: () => void;
};

export const useGameStore = create<GameState>((set, get) => ({
  player: null,
  world: { currentMapId: 'starter_valley', x: 1, y: 1 },
  dinos: { owned: [], teamIds: [] },
  inventory: {},
  dinopedia: {},
  energy: 5,
  isRiding: false,
  mountedDinoId: null,
  setPlayer: (player) => set({ player }),
  setWorld: (world) => {
    set({ world, energy: 5 });
    autoSave(get);
  },
  addDino: (dino) => {
    set((state) => ({
      dinos: { ...state.dinos, owned: [...state.dinos.owned, dino] },
    }));
    autoSave(get);
  },
  updateInventory: (itemId, delta) => {
    set((state) => {
      const newVal = (state.inventory[itemId] || 0) + delta;
      const inv = { ...state.inventory };
      if (newVal <= 0) delete inv[itemId];
      else inv[itemId] = newVal;
      return { inventory: inv };
    });
  },
  updateDinopedia: (entry) => {
    set((state) => ({
      dinopedia: { ...state.dinopedia, [entry.dinoId]: entry },
    }));
  },
  updateDinoStats: (instanceId, stats) => {
    set((state) => ({
      dinos: {
        ...state.dinos,
        owned: state.dinos.owned.map((d) =>
          d.instanceId === instanceId ? { ...d, ...stats } : d,
        ),
      },
    }));
    autoSave(get);
  },
  updateDinoBond: (instanceId, delta) => {
    set((state) => ({
      dinos: {
        ...state.dinos,
        owned: state.dinos.owned.map((d) =>
          d.instanceId === instanceId ? { ...d, bond: Math.min(100, Math.max(0, d.bond + delta)) } : d,
        ),
      },
    }));
    autoSave(get);
  },
  setRiding: (dinoId) => set({ isRiding: !!dinoId, mountedDinoId: dinoId }),
  useEnergy: () => {
    const { energy } = get();
    if (energy <= 0) return false;
    set({ energy: energy - 1 });
    return true;
  },
  loadSave: (save) =>
    set({
      player: save.player,
      world: save.world,
      dinos: save.dinos,
      inventory: save.inventory,
      dinopedia: save.dinopedia,
      energy: 5,
    }),
  triggerAutoSave: () => autoSave(get),
}));
