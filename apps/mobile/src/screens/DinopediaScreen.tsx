import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGameStore } from '../store/gameStore';
import { DSColors, DSSpacing } from '../theme/dsTheme';
import { DSPanel } from '../components/DSPanel';
import { DSText } from '../components/DSText';
import { DSButton } from '../components/DSButton';

const ALL_SPECIES = ['raptiny', 'tricub', 'rexlet', 'tiny_stego', 'leafy_saur', 'baby_ankylo', 'mini_ptera'];
const STATUS_COLORS = { unknown: DSColors.disabled, seen: DSColors.hpYellow, caught: DSColors.hpGreen, created: DSColors.spBar };

export function DinopediaScreen() {
  const navigation = useNavigation();
  const { dinopedia } = useGameStore();

  return (
    <View style={s.container}>
      <View style={s.header}>
        <DSButton label="← BACK" onPress={() => navigation.goBack()} />
        <DSText size="lg" style={s.title}>DINOPEDIA</DSText>
      </View>
      <FlatList
        data={ALL_SPECIES}
        keyExtractor={(id) => id}
        renderItem={({ item, index }) => {
          const entry = dinopedia[item];
          const status = entry?.status || 'unknown';
          return (
            <DSPanel style={s.row}>
              <DSText size="xs" style={s.num}>#{String(index + 1).padStart(3, '0')}</DSText>
              <DSText size="sm" style={s.icon}>{status === 'unknown' ? '⬛' : '🦕'}</DSText>
              <View style={{ flex: 1 }}>
                <DSText size="sm">{status === 'unknown' ? '???' : item.toUpperCase()}</DSText>
              </View>
              <View style={[s.badge, { backgroundColor: STATUS_COLORS[status] }]}>
                <DSText size="xs">{status.toUpperCase()}</DSText>
              </View>
            </DSPanel>
          );
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: DSColors.background, padding: DSSpacing.lg, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: DSSpacing.lg, gap: DSSpacing.md },
  title: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: DSSpacing.sm },
  num: { marginRight: DSSpacing.sm, color: DSColors.textSecondary },
  icon: { marginRight: DSSpacing.sm },
  badge: { paddingHorizontal: DSSpacing.sm, paddingVertical: 2, borderRadius: 4 },
});
