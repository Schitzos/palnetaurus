import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGameStore } from '../store/gameStore';
import { TRAINING_MAP, TrainingType, getTrainingGain } from '../data/training';
import { DSColors, DSSpacing } from '../theme/dsTheme';
import { DSPanel } from '../components/DSPanel';
import { DSText } from '../components/DSText';
import { DSButton } from '../components/DSButton';

export function TrainingScreen() {
  const navigation = useNavigation();
  const { dinos, energy, useEnergy, updateDinoStats } = useGameStore();
  const dino = dinos.owned[0];
  const [log, setLog] = useState<string[]>([]);

  if (!dino) return (
    <View style={s.container}>
      <DSPanel variant="dialogue"><DSText size="sm">No dino to train.</DSText></DSPanel>
    </View>
  );

  const train = (type: TrainingType) => {
    if (!useEnergy()) { Alert.alert('No energy left!'); return; }
    const { stat, label } = TRAINING_MAP[type];
    const gain = getTrainingGain(dino.bond);
    const update: any = {};
    if (stat === 'hp') { update.maxHp = dino.maxHp + gain; update.currentHp = dino.currentHp + gain; }
    else if (stat === 'sp') { update.maxSp = (dino.maxSp || 100) + gain; }
    else { update[stat] = (dino as any)[stat] + gain; }
    updateDinoStats(dino.instanceId, update);
    setLog((p) => [...p.slice(-3), `${label}: +${gain} ${stat}`]);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <DSButton label="← BACK" onPress={() => navigation.goBack()} />
        <DSText size="lg" style={s.title}>TRAINING</DSText>
      </View>
      <DSPanel style={s.info}>
        <DSText size="sm">{(dino.nickname || dino.speciesId).toUpperCase()}</DSText>
        <DSText size="xs" style={s.sub}>Energy: {energy}/5</DSText>
      </DSPanel>
      <View style={s.btns}>
        {(Object.keys(TRAINING_MAP) as TrainingType[]).map((t) => (
          <DSButton key={t} label={`${TRAINING_MAP[t].label} → ${TRAINING_MAP[t].stat.toUpperCase()}`} onPress={() => train(t)} />
        ))}
      </View>
      <DSPanel variant="dialogue" style={s.logBox}>
        {log.length === 0 && <DSText size="xs" style={s.sub}>Training log will appear here...</DSText>}
        {log.map((l, i) => <DSText key={i} size="xs" style={s.logLine}>{l}</DSText>)}
      </DSPanel>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: DSColors.background, padding: DSSpacing.lg, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: DSSpacing.lg, gap: DSSpacing.md },
  title: { flex: 1 },
  info: { marginBottom: DSSpacing.md },
  sub: { color: DSColors.textSecondary, marginTop: 2 },
  btns: { gap: DSSpacing.sm, marginBottom: DSSpacing.lg },
  logBox: { marginTop: 'auto' as any },
  logLine: { color: DSColors.hpGreen, marginTop: 2 },
});
