import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { Direction } from '@palnetaurus/shared';
import { useGameStore } from '../store/gameStore';
import { MAPS, TERRAIN_CONFIG, getNextPosition, canMoveTo, TerrainType } from '../data/maps';
import { DPad } from '../components/DPad';

type Nav = NativeStackNavigationProp<RootStackParamList, 'WorldMap'>;

const TILE_SIZE = 32;

const TERRAIN_COLORS: Record<TerrainType, string> = {
  path: '#c8b88a',
  grass: '#4a7c3f',
  wild_grass: '#2d5a1e',
  tree: '#1a3a0a',
  rock: '#5a5a5a',
  water: '#2980b9',
  portal: '#9b59b6',
};

export function WorldMapScreen() {
  const navigation = useNavigation<Nav>();
  const { world, setWorld, player } = useGameStore();
  const map = MAPS[world.currentMapId];

  const handleMove = useCallback((direction: Direction) => {
    if (!map) return;
    const next = getNextPosition({ x: world.x, y: world.y }, direction);

    if (!canMoveTo(map, next.x, next.y)) return;

    const tile = map.tiles[next.y][next.x];
    const config = TERRAIN_CONFIG[tile];

    // Portal transition (MAP-005)
    if (tile === 'portal' && config.transitionTo) {
      const targetMap = MAPS[config.transitionTo];
      if (targetMap) {
        setWorld({ currentMapId: targetMap.id, x: targetMap.defaultSpawn.x, y: targetMap.defaultSpawn.y });
      }
      return;
    }

    setWorld({ currentMapId: world.currentMapId, x: next.x, y: next.y });

    // Encounter check (will be implemented in Phase 5)
    if (config.encounterEnabled && config.encounterChance) {
      if (Math.random() < config.encounterChance) {
        navigation.navigate('Battle');
      }
    }
  }, [world, map, setWorld, navigation]);

  if (!map) return <View style={styles.container}><Text style={styles.hud}>Map not found</Text></View>;

  return (
    <View style={styles.container}>
      {/* HUD */}
      <View style={styles.hudBar}>
        <Text style={styles.hud}>{player?.name} • {map.name}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Team')}>
          <Text style={styles.menuBtn}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Map Renderer */}
      <View style={styles.mapContainer}>
        {map.tiles.map((row, y) => (
          <View key={y} style={styles.row}>
            {row.map((tile, x) => (
              <View key={`${x}-${y}`} style={[styles.tile, { backgroundColor: TERRAIN_COLORS[tile] }]}>
                {x === world.x && y === world.y && <Text style={styles.player}>🧑</Text>}
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* D-Pad */}
      <DPad onPress={handleMove} />

      {/* Quick Menu */}
      <View style={styles.quickMenu}>
        <TouchableOpacity style={styles.qBtn} onPress={() => navigation.navigate('Inventory')}>
          <Text style={styles.qText}>🎒</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.qBtn} onPress={() => navigation.navigate('Dinopedia')}>
          <Text style={styles.qText}>📖</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.qBtn} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.qText}>⚙️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  hudBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 8 },
  hud: { color: '#fff', fontSize: 14 },
  menuBtn: { color: '#fff', fontSize: 24 },
  mapContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row' },
  tile: { width: TILE_SIZE, height: TILE_SIZE, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center' },
  player: { fontSize: 18 },
  quickMenu: { position: 'absolute', bottom: 40, right: 24, gap: 8 },
  qBtn: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  qText: { fontSize: 20 },
});
