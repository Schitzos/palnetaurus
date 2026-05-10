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
