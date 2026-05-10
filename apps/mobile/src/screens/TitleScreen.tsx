import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Storage } from '../utils/storage';
import { useGameStore } from '../store/gameStore';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Title'>;

export function TitleScreen() {
  const navigation = useNavigation<Nav>();
  const loadSave = useGameStore((s) => s.loadSave);
  const hasSave = Storage.hasSave();

  const handleNewGame = () => navigation.navigate('StarterSelect');

  const handleContinue = () => {
    const save = Storage.load();
    if (save) {
      loadSave(save);
      navigation.navigate('WorldMap');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PLANETAURUS</Text>
      <Text style={styles.subtitle}>Dinosaur Catching RPG</Text>

      <TouchableOpacity style={styles.button} onPress={handleNewGame}>
        <Text style={styles.buttonText}>New Game</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, !hasSave && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={!hasSave}
      >
        <Text style={[styles.buttonText, !hasSave && styles.textDisabled]}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' },
  title: { fontSize: 36, fontWeight: 'bold', color: '#e94560', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#aaa', marginBottom: 48 },
  button: { backgroundColor: '#0f3460', paddingVertical: 14, paddingHorizontal: 48, borderRadius: 8, marginVertical: 8, minWidth: 200, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#333' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  textDisabled: { color: '#666' },
});
