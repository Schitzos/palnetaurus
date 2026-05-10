import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useGameStore } from '../store/gameStore';
import { socket, connectSocket } from '../utils/socket';
import { DSColors, DSSpacing } from '../theme/dsTheme';
import { DSPanel } from '../components/DSPanel';
import { DSText } from '../components/DSText';
import { DSButton } from '../components/DSButton';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function MultiplayerLobbyScreen() {
  const navigation = useNavigation<Nav>();
  const { player, dinos } = useGameStore();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    connectSocket();
    socket.on('room:created', (data: { roomId: string }) => {
      navigation.navigate('Room', { roomId: data.roomId } as any);
    });
    socket.on('room:joined', (data: { roomId: string }) => {
      navigation.navigate('Room', { roomId: data.roomId } as any);
    });
    socket.on('room:error', (data: { message: string }) => setError(data.message));
    return () => { socket.off('room:created'); socket.off('room:joined'); socket.off('room:error'); };
  }, [navigation]);

  const createRoom = () => {
    socket.emit('room:create', { playerId: player?.id, playerName: player?.name, selectedDinoId: dinos.owned[0]?.speciesId });
  };

  const joinRoom = () => {
    if (code.length < 4) { setError('Enter 4-char code'); return; }
    socket.emit('room:join', { roomCode: code.toUpperCase(), playerId: player?.id, playerName: player?.name, selectedDinoId: dinos.owned[0]?.speciesId });
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <DSButton label="← BACK" onPress={() => navigation.goBack()} />
        <DSText size="lg" style={s.title}>UNION ROOM</DSText>
      </View>
      {error ? <DSPanel variant="dialogue" style={s.err}><DSText size="xs" style={{ color: DSColors.hpRed }}>{error}</DSText></DSPanel> : null}
      <DSPanel style={s.section}>
        <DSText size="sm">CREATE A ROOM</DSText>
        <DSButton label="CREATE ROOM" onPress={createRoom} style={s.btn} />
      </DSPanel>
      <DSPanel variant="dialogue" style={s.divider}>
        <DSText size="xs" style={s.or}>— OR JOIN —</DSText>
      </DSPanel>
      <DSPanel style={s.section}>
        <DSText size="sm">ENTER CODE</DSText>
        <TextInput
          style={s.input}
          placeholder="CODE"
          placeholderTextColor={DSColors.disabled}
          value={code}
          onChangeText={setCode}
          maxLength={4}
          autoCapitalize="characters"
        />
        <DSButton label="JOIN ROOM" onPress={joinRoom} style={s.btn} />
      </DSPanel>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: DSColors.background, padding: DSSpacing.lg, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: DSSpacing.lg, gap: DSSpacing.md },
  title: { flex: 1 },
  err: { marginBottom: DSSpacing.sm },
  section: { marginBottom: DSSpacing.md },
  btn: { marginTop: DSSpacing.sm },
  divider: { marginBottom: DSSpacing.md, alignItems: 'center' },
  or: { color: DSColors.textSecondary },
  input: {
    backgroundColor: DSColors.panelBg, color: DSColors.textPrimary,
    borderWidth: 2, borderColor: DSColors.panelBorder, borderRadius: 6,
    padding: DSSpacing.md, marginTop: DSSpacing.sm, fontSize: 14,
    fontFamily: 'PressStart2P-Regular', textAlign: 'center', letterSpacing: 4,
  },
});
