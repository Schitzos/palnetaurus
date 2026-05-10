import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

// In-memory state
type Player = { playerId: string; socketId: string; name: string; selectedDinoId: string; x: number; y: number; direction: string };
type Room = { roomId: string; mapId: string; players: Record<string, Player>; createdAt: string };
type BattleSession = { roomId: string; players: string[]; turn: number };

const rooms: Record<string, Room> = {};
const battles: Record<string, BattleSession> = {};

// Simple map validation (10x8 grid, border is blocked)
const MAP_W = 10, MAP_H = 8;
function isWalkable(x: number, y: number): boolean {
  return x > 0 && y > 0 && x < MAP_W - 1 && y < MAP_H - 1;
}

function getNextPos(x: number, y: number, dir: string) {
  if (dir === 'up') return { x, y: y - 1 };
  if (dir === 'down') return { x, y: y + 1 };
  if (dir === 'left') return { x: x - 1, y };
  return { x: x + 1, y };
}

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return rooms[code] ? generateRoomCode() : code;
}

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

io.on('connection', (socket) => {
  console.log('connected:', socket.id);

  // Room create
  socket.on('room:create', (data: { playerId: string; playerName: string; selectedDinoId: string }) => {
    const roomId = generateRoomCode();
    const player: Player = { playerId: data.playerId, socketId: socket.id, name: data.playerName, selectedDinoId: data.selectedDinoId, x: 1, y: 1, direction: 'down' };
    rooms[roomId] = { roomId, mapId: 'starter_valley', players: { [data.playerId]: player }, createdAt: new Date().toISOString() };
    socket.join(roomId);
    socket.emit('room:created', { roomId });
  });

  // Room join
  socket.on('room:join', (data: { roomCode: string; playerId: string; playerName: string; selectedDinoId: string }) => {
    const room = rooms[data.roomCode];
    if (!room) { socket.emit('room:error', { message: 'Room not found' }); return; }
    if (Object.keys(room.players).length >= 2) { socket.emit('room:error', { message: 'Room full' }); return; }
    const player: Player = { playerId: data.playerId, socketId: socket.id, name: data.playerName, selectedDinoId: data.selectedDinoId, x: 8, y: 6, direction: 'down' };
    room.players[data.playerId] = player;
    socket.join(data.roomCode);
    socket.emit('room:joined', { roomId: data.roomCode });
    io.to(data.roomCode).emit('room:player_joined', { playerId: data.playerId, name: data.playerName, x: 8, y: 6 });
  });

  // Room leave
  socket.on('room:leave', (data: { roomId: string; playerId: string }) => {
    const room = rooms[data.roomId];
    if (!room) return;
    delete room.players[data.playerId];
    socket.leave(data.roomId);
    io.to(data.roomId).emit('room:player_left', { playerId: data.playerId });
    if (Object.keys(room.players).length === 0) delete rooms[data.roomId];
  });

  // Movement
  socket.on('player:move', (data: { roomId: string; playerId: string; direction: string }) => {
    const room = rooms[data.roomId];
    if (!room) return;
    const player = room.players[data.playerId];
    if (!player) return;
    const next = getNextPos(player.x, player.y, data.direction);
    if (!isWalkable(next.x, next.y)) return;
    player.x = next.x;
    player.y = next.y;
    player.direction = data.direction;
    io.to(data.roomId).emit('player:moved', { playerId: data.playerId, x: next.x, y: next.y, direction: data.direction });
  });

  // PvP request
  socket.on('battle:request', (data: { roomId: string; fromPlayerId: string; toPlayerId: string }) => {
    const room = rooms[data.roomId];
    if (!room) return;
    const target = room.players[data.toPlayerId];
    if (!target) return;
    io.to(target.socketId).emit('battle:request', { fromPlayerId: data.fromPlayerId });
  });

  // PvP accept
  socket.on('battle:accept', (data: { roomId: string; fromPlayerId: string; toPlayerId: string }) => {
    const battleId = `${data.roomId}_battle`;
    battles[battleId] = { roomId: data.roomId, players: [data.fromPlayerId, data.toPlayerId], turn: 0 };
    io.to(data.roomId).emit('battle:start', { battleId, players: [data.fromPlayerId, data.toPlayerId] });
  });

  // PvP reject
  socket.on('battle:reject', (data: { roomId: string; fromPlayerId: string }) => {
    const room = rooms[data.roomId];
    if (!room) return;
    const requester = room.players[data.fromPlayerId];
    if (requester) io.to(requester.socketId).emit('battle:rejected', { message: 'Battle request rejected' });
  });

  // PvP action
  socket.on('battle:action', (data: { battleId: string; playerId: string; action: string }) => {
    const battle = battles[data.battleId];
    if (!battle) return;
    io.to(battle.roomId).emit('battle:action_received', { playerId: data.playerId, action: data.action });
    battle.turn++;
  });

  // PvP end
  socket.on('battle:end', (data: { battleId: string }) => {
    delete battles[data.battleId];
  });

  socket.on('disconnect', () => {
    // Clean up player from rooms
    for (const [roomId, room] of Object.entries(rooms)) {
      for (const [pid, p] of Object.entries(room.players)) {
        if (p.socketId === socket.id) {
          delete room.players[pid];
          io.to(roomId).emit('room:player_left', { playerId: pid });
          if (Object.keys(room.players).length === 0) delete rooms[roomId];
          break;
        }
      }
    }
    console.log('disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
