import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGameStore } from '../store/gameStore';
import { PLAY_ACTIONS, PlayAction, getBondLevel } from '../data/bond';
import { DSColors, DSSpacing } from '../theme/dsTheme';
import { DSPanel } from '../components/DSPanel';
import { DSText } from '../components/DSText';
import { DSButton } from '../components/DSButton';

export function PlayWithDinoScreen() {
  const navigation = useNavigation();
  const { dinos, updateDinoBond } = useGameStore();
  const dino = dinos.owned[0];
  const [log, setLog] = useState<string[]>([]);

  if (!dino) return (
    <View style={s.container}>
      <DSPanel variant="dialogue"><DSText size="sm">No dino.</DSText></DSPanel>
    </View>
  );

  const play = (action: PlayAction) => {
    const { label, delta } = PLAY_ACTIONS[action];
    updateDinoBond(dino.instanceId, delta);
    setLog((p) => [...p.slice(-3), `${label}: bond +${delta}`]);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <DSButton label="← BACK" onPress={() => navigation.goBack()} />
        <DSText size="lg" style={s.title}>PLAY</DSText>
      </View>
      <DSPanel style={s.dinoArea}>
        <DSText size="xl">🦕</DSText>
        <DSText size="sm">{(dino.nickname || dino.speciesId).toUpperCase()}</DSText>
        <DSText size="xs" style={s.sub}>Bond: {dino.bond}/100 ({getBondLevel(dino.bond)})</DSText>
      </DSPanel>
      <View style={s.btns}>
        {(Object.keys(PLAY_ACTIONS) as PlayAction[]).map((a) => (
          <DSButton key={a} label={`${PLAY_ACTIONS[a].label} (+${PLAY_ACTIONS[a].delta})`} onPress={() => play(a)} />
        ))}
      </View>
      <DSPanel variant="dialogue" style={s.logBox}>
        {log.length === 0 && <DSText size="xs" style={s.sub}>Interaction log...</DSText>}
        {log.map((l, i) => <DSText key={i} size="xs" style={s.logLine}>{l}</DSText>)}
      </DSPanel>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: DSColors.background, padding: DSSpacing.lg, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: DSSpacing.lg, gap: DSSpacing.md },
  title: { flex: 1 },
  dinoArea: { alignItems: 'center', marginBottom: DSSpacing.lg },
  sub: { color: DSColors.textSecondary, marginTop: 2 },
  btns: { gap: DSSpacing.sm, marginBottom: DSSpacing.lg },
  logBox: { marginTop: 'auto' as any },
  logLine: { color: DSColors.spBar, marginTop: 2 },
});
