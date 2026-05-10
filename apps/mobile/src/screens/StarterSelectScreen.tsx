import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { STARTER_DINOS, DinoSpecies } from '../data/starterDinos';
import { useGameStore } from '../store/gameStore';
import { Storage } from '../utils/storage';
import type { PlayerDino } from '@palnetaurus/shared';

type Nav = NativeStackNavigationProp<RootStackParamList, 'StarterSelect'>;

export function StarterSelectScreen() {
  const navigation = useNavigation<Nav>();
  const [selected, setSelected] = useState<DinoSpecies | null>(null);
  const [playerName, setPlayerName] = useState('');
  const { setPlayer, setWorld, addDino } = useGameStore();

  const handleConfirm = () => {
    if (!selected || !playerName.trim()) {
      Alert.alert('Missing info', 'Choose a dinosaur and enter your name.');
      return;
    }

    const playerId = Date.now().toString();
    const starterDino: PlayerDino = {
      instanceId: `${selected.id}_${playerId}`,
      speciesId: selected.id,
      source: 'starter',
      level: 5,
      exp: 0,
      currentHp: selected.baseStats.hp,
      maxHp: selected.baseStats.hp,
      currentSp: 0,
      maxSp: selected.baseStats.sp,
      attack: selected.baseStats.attack,
      defense: selected.baseStats.defense,
      speed: selected.baseStats.speed,
      heightMeter: selected.heightMeter,
      bond: 30,
      rideable: selected.rideable,
      moves: selected.moves,
      specialMoveId: selected.specialMoveId,
    };

    setPlayer({ id: playerId, name: playerName.trim() });
    setWorld({ currentMapId: 'starter_valley', x: 1, y: 1 });
    addDino(starterDino);

    Storage.save({
      version: 1,
      player: { id: playerId, name: playerName.trim() },
      world: { currentMapId: 'starter_valley', x: 1, y: 1 },
      dinos: { owned: [starterDino], teamIds: [starterDino.instanceId] },
      inventory: { dino_ball: 5 },
      dinopedia: { [selected.id]: { dinoId: selected.id, status: 'caught' } },
    });

    navigation.navigate('WorldMap');
  };

  const renderDino = ({ item }: { item: DinoSpecies }) => (
    <TouchableOpacity
      style={[styles.card, selected?.id === item.id && styles.cardSelected]}
      onPress={() => setSelected(item)}
    >
      <Text style={styles.dinoName}>{item.name}</Text>
      <Text style={styles.dinoInfo}>{item.species} • {item.type}</Text>
      <Text style={styles.stats}>
        HP:{item.baseStats.hp} ATK:{item.baseStats.attack} DEF:{item.baseStats.defense} SPD:{item.baseStats.speed}
      </Text>
      <Text style={styles.move}>Special: {item.specialMoveId.replace('_', ' ')}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Starter</Text>

      <FlatList
        data={STARTER_DINOS}
        renderItem={renderDino}
        keyExtractor={(item) => item.id}
        horizontal
        contentContainerStyle={styles.list}
      />

      {selected && (
        <View style={styles.nameSection}>
          <Text style={styles.label}>Your Name:</Text>
          <TextInput
            style={styles.input}
            value={playerName}
            onChangeText={setPlayerName}
            placeholder="Enter name"
            placeholderTextColor="#666"
            maxLength={16}
          />
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmText}>Start Adventure!</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', paddingTop: 60, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 24 },
  list: { paddingHorizontal: 16 },
  card: { backgroundColor: '#16213e', padding: 20, borderRadius: 12, marginHorizontal: 8, width: 160, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  cardSelected: { borderColor: '#e94560' },
  dinoName: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  dinoInfo: { fontSize: 12, color: '#aaa', marginBottom: 8 },
  stats: { fontSize: 11, color: '#ccc', marginBottom: 4 },
  move: { fontSize: 11, color: '#e94560', fontStyle: 'italic' },
  nameSection: { marginTop: 32, alignItems: 'center' },
  label: { color: '#fff', fontSize: 16, marginBottom: 8 },
  input: { backgroundColor: '#16213e', color: '#fff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, width: 200, textAlign: 'center', fontSize: 16 },
  confirmButton: { backgroundColor: '#e94560', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8, marginTop: 16 },
  confirmText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
