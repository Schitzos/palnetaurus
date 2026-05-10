export type Direction = 'up' | 'down' | 'left' | 'right';

export type PlayerDino = {
  instanceId: string;
  speciesId: string;
  nickname?: string;
  source: 'starter' | 'caught' | 'created';
  level: number;
  exp: number;
  currentHp: number;
  maxHp: number;
  currentSp: number;
  maxSp: number;
  attack: number;
  defense: number;
  speed: number;
  heightMeter: number;
  bond: number;
  rideable: boolean;
  moves: string[];
  specialMoveId: string;
  caughtAt?: string;
  createdAt?: string;
};

export type DinopediaEntry = {
  dinoId: string;
  status: 'unknown' | 'seen' | 'caught' | 'created';
  firstSeenAt?: string;
  firstCaughtAt?: string;
  imageAsset?: string;
  silhouetteAsset?: string;
};

export type GameSave = {
  version: number;
  player: {
    id: string;
    name: string;
  };
  world: {
    currentMapId: string;
    x: number;
    y: number;
  };
  dinos: {
    owned: PlayerDino[];
    teamIds: string[];
  };
  inventory: Record<string, number>;
  dinopedia: Record<string, DinopediaEntry>;
};

export type MultiplayerRoom = {
  roomId: string;
  mapId: string;
  players: Record<string, MultiplayerPlayer>;
  createdAt: string;
};

export type MultiplayerPlayer = {
  playerId: string;
  socketId: string;
  name: string;
  selectedDinoId: string;
  x: number;
  y: number;
  direction: Direction;
  isConnected: boolean;
};
