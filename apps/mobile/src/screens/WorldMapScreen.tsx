import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { Direction } from '@palnetaurus/shared';
import { useGameStore } from '../store/gameStore';
import { MAPS, TERRAIN_CONFIG, getNextPosition, canMoveTo, TerrainType } from '../data/maps';
import { shouldTriggerEncounter, pickWeightedEncounter, generateWildDino } from '../data/encounters';
import { canRideDino } from '../data/ride';
import { DPad } from '../components/DPad';
import { DSColors, DSSpacing } from '../theme/dsTheme';
import { DSPanel } from '../components/DSPanel';
import { DSText } from '../components/DSText';
import { DSButton } from '../components/DSButton';

type Nav = NativeStackNavigationProp<RootStackParamList, 'WorldMap'>;

const TILE_SIZE = 32;

const TERRAIN_COLORS: Record<TerrainType, string> = {
  path: '#D4C088',
  grass: '#7CB342',
  wild_grass: '#558B2F',
  tree: '#2E7D32',
  rock: '#78909C',
  water: '#42A5F5',
  portal: '#AB47BC',
};

export function WorldMapScreen() {
  const navigation = useNavigation<Nav>();
  const { world, setWorld, player, dinos, isRiding, mountedDinoId, setRiding } = useGameStore();
  const map = MAPS[world.currentMapId];

  const rideableDino = dinos.owned.find((d) => canRideDino(d));

  const toggleRide = () => {
    if (isRiding) { setRiding(null); return; }
    if (rideableDino) setRiding(rideableDino.instanceId);
  };

  const handleMove = useCallback((direction: Direction) => {
    if (!map) return;
    const steps = isRiding ? 2 : 1;
    let pos = { x: world.x, y: world.y };
    for (let i = 0; i < steps; i++) {
      const next = getNextPosition(pos, direction);
      if (!canMoveTo(map, next.x, next.y)) break;
      pos = next;
    }
    if (pos.x === world.x && pos.y === world.y) return;

    const tile = map.tiles[pos.y][pos.x];
    const config = TERRAIN_CONFIG[tile];

    if (tile === 'portal' && config.transitionTo) {
      const targetMap = MAPS[config.transitionTo];
      if (targetMap) {
        setWorld({ currentMapId: targetMap.id, x: targetMap.defaultSpawn.x, y: targetMap.defaultSpawn.y });
      }
      return;
    }

    setWorld({ currentMapId: world.currentMapId, x: pos.x, y: pos.y });

    if (config.encounterEnabled && config.encounterTableId) {
      if (shouldTriggerEncounter(tile)) {
        const encounter = pickWeightedEncounter(config.encounterTableId);
        if (encounter) {
          const wildDino = generateWildDino(encounter);
          navigation.navigate('Battle', { wildDino } as any);
        }
      }
    }
  }, [world, map, setWorld, navigation, isRiding]);

  if (!map) return (
    <View style={s.container}>
      <DSPanel variant="dialogue"><DSText size="sm">Map not found</DSText></DSPanel>
    </View>
  );

  return (
    <View style={s.container}>
      <DSPanel style={s.hudBar}>
        <DSText size="xs">{player?.name}</DSText>
        <DSText size="xs">{map.name}</DSText>
        {isRiding && <DSText size="xs" style={s.ride}>🦕 RIDING</DSText>}
      </DSPanel>

      <View style={s.mapContainer}>
        {map.tiles.map((row, y) => (
          <View key={y} style={s.row}>
            {row.map((tile, x) => (
              <View key={`${x}-${y}`} style={[s.tile, { backgroundColor: TERRAIN_COLORS[tile] }]}>
                {x === world.x && y === world.y && <DSText size="xs">{isRiding ? '🦕' : '🧑'}</DSText>}
              </View>
            ))}
          </View>
        ))}
      </View>

      <DPad onPress={handleMove} />

      <View style={s.quickMenu}>
        {rideableDino && (
          <DSButton label="🐎" onPress={toggleRide} style={isRiding ? { ...s.qBtn, ...s.qBtnActive } : s.qBtn} />
        )}
        <DSButton label="🎒" onPress={() => navigation.navigate('Inventory')} style={s.qBtn} />
        <DSButton label="📖" onPress={() => navigation.navigate('Dinopedia')} style={s.qBtn} />
        <DSButton label="⚙️" onPress={() => navigation.navigate('Settings')} style={s.qBtn} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: DSColors.background },
  hudBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: DSSpacing.md, marginTop: 50, marginBottom: DSSpacing.sm },
  ride: { color: DSColors.accent },
  mapContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row' },
  tile: { width: TILE_SIZE, height: TILE_SIZE, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center' },
  quickMenu: { position: 'absolute', bottom: 40, right: 24, gap: DSSpacing.sm },
  qBtn: { width: 44, height: 44, paddingHorizontal: 0, paddingVertical: 0 },
  qBtnActive: { borderColor: DSColors.accent, backgroundColor: '#3d3520' },
});
