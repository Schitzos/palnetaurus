import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useGameStore } from '../store/gameStore';
import { clearSave } from '../utils/storage';
import { DSColors, DSSpacing } from '../theme/dsTheme';
import { DSPanel } from '../components/DSPanel';
import { DSText } from '../components/DSText';
import { DSButton } from '../components/DSButton';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const { triggerAutoSave } = useGameStore();
  const [sfxVol, setSfxVol] = useState(80);
  const [bgmVol, setBgmVol] = useState(60);

  const deleteSave = () => {
    Alert.alert('Delete Save', 'Are you sure? This cannot be undone.', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { clearSave(); navigation.navigate('Title'); } },
    ]);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <DSButton label="← BACK" onPress={() => navigation.goBack()} />
        <DSText size="lg" style={s.title}>SETTINGS</DSText>
      </View>
      <DSPanel style={s.option}>
        <DSText size="xs" style={s.cursor}>▶</DSText>
        <DSText size="sm" style={{ flex: 1 }}>SFX: {sfxVol}%</DSText>
        <DSButton label="-" onPress={() => setSfxVol((v) => Math.max(0, v - 10))} style={s.volBtn} />
        <DSButton label="+" onPress={() => setSfxVol((v) => Math.min(100, v + 10))} style={s.volBtn} />
      </DSPanel>
      <DSPanel style={s.option}>
        <DSText size="xs" style={s.cursor}>▶</DSText>
        <DSText size="sm" style={{ flex: 1 }}>BGM: {bgmVol}%</DSText>
        <DSButton label="-" onPress={() => setBgmVol((v) => Math.max(0, v - 10))} style={s.volBtn} />
        <DSButton label="+" onPress={() => setBgmVol((v) => Math.min(100, v + 10))} style={s.volBtn} />
      </DSPanel>
      <View style={s.actions}>
        <DSButton label="MANUAL SAVE" onPress={() => { triggerAutoSave(); Alert.alert('Saved!'); }} />
        <DSButton label="DELETE SAVE" onPress={deleteSave} style={s.danger} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: DSColors.background, padding: DSSpacing.lg, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: DSSpacing.lg, gap: DSSpacing.md },
  title: { flex: 1 },
  option: { flexDirection: 'row', alignItems: 'center', marginBottom: DSSpacing.sm },
  cursor: { color: DSColors.menuCursor, marginRight: DSSpacing.sm },
  volBtn: { paddingVertical: 4, paddingHorizontal: 12, marginLeft: DSSpacing.xs },
  actions: { gap: DSSpacing.sm, marginTop: DSSpacing.xl },
  danger: { borderColor: DSColors.hpRed },
});
