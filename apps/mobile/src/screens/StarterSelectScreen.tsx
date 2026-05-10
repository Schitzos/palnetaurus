import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { STARTER_DINOS, DinoSpecies } from '../data/starterDinos';
import { useGameStore } from '../store/gameStore';
import { Storage } from '../utils/storage';
import type { PlayerDino } from '@palnetaurus/shared';
import { DSColors, DSSpacing, DSTypography } from '../theme/dsTheme';
import { DSPanel } from '../components/DSPanel';
import { DSText } from '../components/DSText';
import { DSButton } from '../components/DSButton';

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
      instanceId: `${selected.id}_${playerId}`, speciesId: selected.id, source: 'starter',
      level: 5, exp: 0, currentHp: selected.baseStats.hp, maxHp: selected.baseStats.hp,
      currentSp: 0, maxSp: selected.baseStats.sp, attack: selected.baseStats.attack,
      defense: selected.baseStats.defense, speed: selected.baseStats.speed,
      heightMeter: selected.heightMeter, bond: 30, rideable: selected.rideable,
      moves: selected.moves, specialMoveId: selected.specialMoveId,
    };
    setPlayer({ id: playerId, name: playerName.trim() });
    setWorld({ currentMapId: 'starter_valley', x: 1, y: 1 });
    addDino(starterDino);
    Storage.save({
      version: 1, player: { id: playerId, name: playerName.trim() },
      world: { currentMapId: 'starter_valley', x: 1, y: 1 },
      dinos: { owned: [starterDino], teamIds: [starterDino.instanceId] },
      inventory: { dino_ball: 5 }, dinopedia: { [selected.id]: { dinoId: selected.id, status: 'caught' } },
    });
    navigation.navigate('WorldMap');
  };

  return (
    <View style={styles.container}>
      {/* Top Panel - Preview */}
      <DSPanel style={styles.topPanel}>
        {selected ? (
          <>
            <DSText size="lg" style={styles.dinoName}>{selected.name}</DSText>
            <DSText size="xs" style={styles.dinoType}>{`${selected.species} • ${selected.type}`}</DSText>
            <View style={styles.statsRow}>
              <DSText size="xs">{`HP:${selected.baseStats.hp}`}</DSText>
              <DSText size="xs">{`ATK:${selected.baseStats.attack}`}</DSText>
              <DSText size="xs">{`DEF:${selected.baseStats.defense}`}</DSText>
              <DSText size="xs">{`SPD:${selected.baseStats.speed}`}</DSText>
            </View>
            <DSText size="xs" style={styles.special}>{`Special: ${selected.specialMoveId.replace('_', ' ')}`}</DSText>
          </>
        ) : (
          <DSText size="sm" style={styles.placeholder}>Select a partner below</DSText>
        )}
      </DSPanel>

      {/* Bottom Panel - Selection */}
      <View style={styles.bottomPanel}>
        <DSPanel variant="dialogue" style={styles.dialogueBox}>
          <DSText size="xs" typewriter>Choose your partner dinosaur!</DSText>
        </DSPanel>

        <View style={styles.ballRow}>
          {STARTER_DINOS.map((dino) => (
            <TouchableOpacity
              key={dino.id}
              style={[styles.ball, selected?.id === dino.id && styles.ballSelected]}
              onPress={() => setSelected(dino)}
            >
              <Text style={styles.ballIcon}>⚪</Text>
              <DSText size="xs">{dino.name.slice(0, 4)}</DSText>
            </TouchableOpacity>
          ))}
        </View>

        {selected && (
          <View style={styles.nameSection}>
            <DSText size="xs" style={{ marginBottom: DSSpacing.xs }}>YOUR NAME:</DSText>
            <TextInput
              style={styles.input}
              value={playerName}
              onChangeText={setPlayerName}
              placeholder="Enter name"
              placeholderTextColor={DSColors.disabled}
              maxLength={16}
            />
            <DSButton label="CHOOSE!" onPress={handleConfirm} style={{ marginTop: DSSpacing.md }} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DSColors.background, paddingTop: 60 },
  topPanel: { flex: 0.45, margin: DSSpacing.md, justifyContent: 'center', alignItems: 'center' },
  dinoName: { color: DSColors.accent, marginBottom: DSSpacing.xs },
  dinoType: { color: DSColors.textSecondary, marginBottom: DSSpacing.sm },
  statsRow: { flexDirection: 'row', gap: DSSpacing.md, marginBottom: DSSpacing.sm },
  special: { color: DSColors.hpYellow, fontStyle: 'italic' },
  placeholder: { color: DSColors.textSecondary },
  bottomPanel: { flex: 0.55, padding: DSSpacing.md },
  dialogueBox: { marginBottom: DSSpacing.md },
  ballRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: DSSpacing.lg },
  ball: { alignItems: 'center', padding: DSSpacing.sm, borderWidth: 2, borderColor: 'transparent', borderRadius: 8 },
  ballSelected: { borderColor: DSColors.accent, backgroundColor: 'rgba(244,208,63,0.1)' },
  ballIcon: { fontSize: 32, marginBottom: DSSpacing.xs },
  nameSection: { alignItems: 'center' },
  input: {
    backgroundColor: DSColors.panelBg, color: DSColors.textPrimary,
    fontFamily: DSTypography.fontFamily, fontSize: DSTypography.sizes.sm,
    paddingHorizontal: DSSpacing.lg, paddingVertical: DSSpacing.sm,
    borderRadius: 6, borderWidth: 2, borderColor: DSColors.dialogueBorder,
    width: 200, textAlign: 'center',
  },
});
