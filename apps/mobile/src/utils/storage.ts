import { MMKV } from 'react-native-mmkv';
import type { GameSave } from '@palnetaurus/shared';

const storage = new MMKV();
const SAVE_KEY = 'game_save';

export const Storage = {
  save(data: GameSave): void {
    storage.set(SAVE_KEY, JSON.stringify(data));
  },
  load(): GameSave | null {
    const raw = storage.getString(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  clear(): void {
    storage.delete(SAVE_KEY);
  },
  hasSave(): boolean {
    return storage.contains(SAVE_KEY);
  },
};

/**
 * Auto-save helper — call after key events:
 * - Map transition
 * - After catching a dinosaur
 * - After battle ends
 */
export function autoSave(getState: () => {
  player: { id: string; name: string } | null;
  world: { currentMapId: string; x: number; y: number };
  dinos: { owned: any[]; teamIds: string[] };
  inventory: Record<string, number>;
  dinopedia: Record<string, any>;
}): void {
  const state = getState();
  if (!state.player) return;

  const save: GameSave = {
    version: 1,
    player: state.player,
    world: state.world,
    dinos: state.dinos,
    inventory: state.inventory,
    dinopedia: state.dinopedia,
  };
  Storage.save(save);
}
