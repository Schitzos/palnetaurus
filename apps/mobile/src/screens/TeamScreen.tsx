import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useGameStore } from '../store/gameStore';
import { getBondLevel } from '../data/bond';
import { DSColors, DSSpacing } from '../theme/dsTheme';
import { DSPanel } from '../components/DSPanel';
import { DSText } from '../components/DSText';
import { DSButton } from '../components/DSButton';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function hpColor(ratio: number) {
  if (ratio > 0.5) return DSColors.hpGreen;
  if (ratio > 0.2) return DSColors.hpYellow;
  return DSColors.hpRed;
}

export function TeamScreen() {
  const navigation = useNavigation<Nav>();
  const { dinos } = useGameStore();

  return (
    <View style={s.container}>
      <View style={s.header}>
        <DSButton label="← BACK" onPress={() => navigation.goBack()} />
        <DSText size="lg" style={s.title}>TEAM ({dinos.owned.length}/6)</DSText>
      </View>
      <FlatList
        data={dinos.owned}
        keyExtractor={(d) => d.instanceId}
        numColumns={2}
        columnWrapperStyle={s.grid}
        renderItem={({ item }) => {
          const ratio = item.currentHp / item.maxHp;
          return (
            <DSPanel style={s.card}>
              <DSText size="sm">{(item.nickname || item.speciesId).toUpperCase()}</DSText>
              <DSText size="xs" style={s.level}>Lv.{item.level}</DSText>
              <View style={s.barBg}>
                <View style={[s.hpBar, { width: `${ratio * 100}%`, backgroundColor: hpColor(ratio) }]} />
              </View>
              <DSText size="xs" style={s.stats}>ATK:{item.attack} DEF:{item.defense} SPD:{item.speed}</DSText>
              <DSText size="xs" style={s.stats}>Bond: {getBondLevel(item.bond)}</DSText>
              <View style={s.btnRow}>
                <DSButton label="TRAIN" onPress={() => navigation.navigate('Training')} style={s.smallBtn} />
                <DSButton label="PLAY" onPress={() => navigation.navigate('PlayWithDino')} style={s.smallBtn} />
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
  grid: { gap: DSSpacing.sm },
  card: { flex: 1, marginBottom: DSSpacing.sm },
  level: { color: DSColors.textSecondary, marginTop: 2 },
  barBg: { height: 6, backgroundColor: DSColors.disabled, borderRadius: 3, marginVertical: DSSpacing.xs },
  hpBar: { height: 6, borderRadius: 3 },
  stats: { color: DSColors.textSecondary, marginTop: 2 },
  btnRow: { flexDirection: 'row', gap: DSSpacing.xs, marginTop: DSSpacing.sm },
  smallBtn: { paddingVertical: 4, paddingHorizontal: 8 },
});
