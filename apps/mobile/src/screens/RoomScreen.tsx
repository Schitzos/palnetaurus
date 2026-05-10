import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { Direction } from '@palnetaurus/shared';
import { useGameStore } from '../store/gameStore';
import { socket, disconnectSocket } from '../utils/socket';
import { DPad } from '../components/DPad';
import { DSColors, DSSpacing } from '../theme/dsTheme';
import { DSPanel } from '../components/DSPanel';
import { DSText } from '../components/DSText';
import { DSButton } from '../components/DSButton';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const MAP_W = 10, MAP_H = 8;

export function RoomScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const roomId = (route.params as any)?.roomId;
  const { player } = useGameStore();
  const [myPos, setMyPos] = useState({ x: 1, y: 1 });
  const [otherPlayer, setOtherPlayer] = useState<{ id: string; x: number; y: number } | null>(null);

  useEffect(() => {
    socket.on('player:moved', (data: { playerId: string; x: number; y: number }) => {
      if (data.playerId === player?.id) setMyPos({ x: data.x, y: data.y });
      else setOtherPlayer({ id: data.playerId, x: data.x, y: data.y });
    });
    socket.on('room:player_joined', (data: { playerId: string }) => {
      if (data.playerId !== player?.id) setOtherPlayer({ id: data.playerId, x: 1, y: 1 });
    });
    socket.on('room:player_left', () => setOtherPlayer(null));
    socket.on('battle:request', (data: { fromPlayerId: string }) => {
      Alert.alert('PvP Request', `${data.fromPlayerId} wants to battle!`, [
        { text: 'Reject', onPress: () => socket.emit('battle:reject', { roomId, fromPlayerId: data.fromPlayerId, toPlayerId: player?.id }) },
        { text: 'Accept', onPress: () => socket.emit('battle:accept', { roomId, fromPlayerId: data.fromPlayerId, toPlayerId: player?.id }) },
      ]);
    });
    socket.on('battle:start', () => navigation.navigate('Battle', {} as any));
    return () => { socket.off('player:moved'); socket.off('room:player_joined'); socket.off('room:player_left'); socket.off('battle:request'); socket.off('battle:start'); };
  }, [player, roomId, navigation]);

  const handleMove = useCallback((direction: Direction) => {
    socket.emit('player:move', { roomId, playerId: player?.id, direction });
  }, [roomId, player]);

  const leave = () => {
    socket.emit('room:leave', { roomId, playerId: player?.id });
    disconnectSocket();
    navigation.goBack();
  };

  const requestPvP = () => {
    if (!otherPlayer) return;
    socket.emit('battle:request', { roomId, fromPlayerId: player?.id, toPlayerId: otherPlayer.id });
  };

  return (
    <View style={s.container}>
      <DSPanel style={s.hud}>
        <DSText size="xs">ROOM: {roomId}</DSText>
        <DSButton label="LEAVE" onPress={leave} style={s.leaveBtn} />
      </DSPanel>
      <View style={s.map}>
        {Array.from({ length: MAP_H }).map((_, y) => (
          <View key={y} style={s.row}>
            {Array.from({ length: MAP_W }).map((_, x) => {
              const isWall = x === 0 || y === 0 || x === MAP_W - 1 || y === MAP_H - 1;
              const isMe = x === myPos.x && y === myPos.y;
              const isOther = otherPlayer && x === otherPlayer.x && y === otherPlayer.y;
              return (
                <View key={`${x}-${y}`} style={[s.tile, isWall && s.wall]}>
                  {isMe && <DSText size="xs">🧑</DSText>}
                  {isOther && <DSText size="xs">👤</DSText>}
                </View>
              );
            })}
          </View>
        ))}
      </View>
      <DPad onPress={handleMove} />
      <DSButton
        label="⚔️ PVP BATTLE"
        onPress={requestPvP}
        disabled={!otherPlayer}
        style={s.pvpBtn}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: DSColors.background, paddingTop: 50 },
  hud: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: DSSpacing.lg, marginBottom: DSSpacing.sm },
  leaveBtn: { paddingVertical: 4, paddingHorizontal: 8, borderColor: DSColors.hpRed },
  map: { alignItems: 'center', marginBottom: DSSpacing.lg },
  row: { flexDirection: 'row' },
  tile: { width: 32, height: 32, backgroundColor: '#6B8E23', borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.15)', justifyContent: 'center', alignItems: 'center' },
  wall: { backgroundColor: '#4a6741' },
  pvpBtn: { position: 'absolute', bottom: 40, right: 24, borderColor: DSColors.hpRed },
});
