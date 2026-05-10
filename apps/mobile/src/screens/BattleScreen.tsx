import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useGameStore } from '../store/gameStore';
import { BattleDino, BattleAction, executeTurn, canUseSpecial, getAiAction } from '../data/battle';
import { attemptCatch } from '../data/catch';
import type { WildDino } from '../data/encounters';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Battle'>;

export function BattleScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const wildDinoData = (route.params as any)?.wildDino as WildDino | undefined;
  const { dinos, triggerAutoSave, inventory, updateInventory, addDino, updateDinopedia } = useGameStore();

  const playerDinoData = dinos.owned[0];
  if (!playerDinoData || !wildDinoData) {
    return <View style={s.container}><Text style={s.log}>No battle data</Text></View>;
  }

  const [playerDino, setPlayerDino] = useState<BattleDino>({
    speciesId: playerDinoData.speciesId,
    level: playerDinoData.level,
    currentHp: playerDinoData.currentHp,
    maxHp: playerDinoData.maxHp,
    currentSp: 0,
    maxSp: playerDinoData.maxSp,
    attack: playerDinoData.attack,
    defense: playerDinoData.defense,
    speed: playerDinoData.speed,
    moves: playerDinoData.moves,
    specialMoveId: playerDinoData.specialMoveId,
    isDefending: false,
  });

  const [wildDino, setWildDino] = useState<BattleDino>({
    ...wildDinoData,
    isDefending: false,
  });

  const [log, setLog] = useState<string[]>([`Wild ${wildDinoData.speciesId} appeared!`]);
  const [battleOver, setBattleOver] = useState(false);

  const addLog = (msg: string) => setLog((prev) => [...prev.slice(-4), msg]);

  const handleAction = useCallback((action: BattleAction) => {
    if (battleOver) return;

    // Player turn
    if (action === 'dino_ball') {
      const balls = inventory['dino_ball'] || 0;
      if (balls <= 0) { addLog('No Dino Balls!'); return; }
      updateInventory('dino_ball', -1);
      addLog('Threw a Dino Ball...');
      const caught = attemptCatch(wildDino.speciesId, wildDino.currentHp, wildDino.maxHp, 'dino_ball');
      if (caught) {
        addLog(`Caught ${wildDino.speciesId}!`);
        const newDino = { instanceId: `${wildDino.speciesId}_${Date.now()}`, speciesId: wildDino.speciesId, source: 'caught' as const, level: wildDino.level, exp: 0, currentHp: wildDino.currentHp, maxHp: wildDino.maxHp, currentSp: 0, maxSp: wildDino.maxSp, attack: wildDino.attack, defense: wildDino.defense, speed: wildDino.speed, heightMeter: 1.0, bond: 10, rideable: false, moves: wildDino.moves, specialMoveId: wildDino.specialMoveId };
        addDino(newDino);
        updateDinopedia({ dinoId: wildDino.speciesId, status: 'caught' });
        setBattleOver(true);
        triggerAutoSave();
        setTimeout(() => navigation.goBack(), 1500);
        return;
      }
      addLog('It broke free!');
      // Wild dino gets a turn after failed catch
      const aiAction = getAiAction(wildDino);
      const eResult = executeTurn({ ...wildDino, isDefending: false }, playerDino, aiAction);
      setPlayerDino((prev) => ({ ...prev, currentHp: Math.max(0, prev.currentHp - eResult.damage) }));
      if (aiAction === 'attack') addLog(`Wild dino attacks! -${eResult.damage} HP`);
      return;
    }

    const pResult = executeTurn(
      { ...playerDino, isDefending: false },
      wildDino,
      action,
    );

    if (action === 'run' && pResult.escaped) {
      addLog('Got away safely!');
      setBattleOver(true);
      setTimeout(() => navigation.goBack(), 1000);
      return;
    }
    if (action === 'run') {
      addLog("Couldn't escape!");
    }

    let newWild = { ...wildDino, currentHp: Math.max(0, wildDino.currentHp - pResult.damage), currentSp: pResult.defenderSp };
    let newPlayer = { ...playerDino, currentSp: pResult.attackerSp, isDefending: action === 'defend' };

    if (action === 'attack') addLog(`Your dino attacks! -${pResult.damage} HP`);
    if (action === 'defend') addLog('Your dino defends! SP +25');
    if (action === 'special') addLog(`SPECIAL MOVE! -${pResult.damage} HP`);

    // Check win
    if (newWild.currentHp <= 0) {
      addLog('You win!');
      setBattleOver(true);
      triggerAutoSave();
      setTimeout(() => navigation.goBack(), 1500);
      setWildDino(newWild);
      setPlayerDino(newPlayer);
      return;
    }

    // Enemy turn
    const aiAction = getAiAction(newWild);
    const eResult = executeTurn(
      { ...newWild, isDefending: false },
      newPlayer,
      aiAction,
    );

    newPlayer = { ...newPlayer, currentHp: Math.max(0, newPlayer.currentHp - eResult.damage), currentSp: eResult.defenderSp, isDefending: false };
    newWild = { ...newWild, currentSp: eResult.attackerSp, isDefending: aiAction === 'defend' };

    if (aiAction === 'attack') addLog(`Wild dino attacks! -${eResult.damage} HP`);
    if (aiAction === 'defend') addLog('Wild dino defends!');
    if (aiAction === 'special') addLog(`Wild dino uses SPECIAL! -${eResult.damage} HP`);

    // Check lose
    if (newPlayer.currentHp <= 0) {
      addLog('Your dino fainted...');
      setBattleOver(true);
      triggerAutoSave();
      setTimeout(() => navigation.goBack(), 1500);
    }

    setWildDino(newWild);
    setPlayerDino(newPlayer);
  }, [playerDino, wildDino, battleOver, navigation, triggerAutoSave]);

  return (
    <View style={s.container}>
      {/* Wild Dino */}
      <View style={s.dinoSection}>
        <Text style={s.dinoName}>Wild {wildDino.speciesId} Lv.{wildDino.level}</Text>
        <View style={s.barBg}><View style={[s.hpBar, { width: `${(wildDino.currentHp / wildDino.maxHp) * 100}%` }]} /></View>
        <Text style={s.statText}>HP: {wildDino.currentHp}/{wildDino.maxHp} | SP: {wildDino.currentSp}/100</Text>
      </View>

      {/* Player Dino */}
      <View style={s.dinoSection}>
        <Text style={s.dinoName}>{playerDino.speciesId} Lv.{playerDino.level}</Text>
        <View style={s.barBg}><View style={[s.hpBar, { width: `${(playerDino.currentHp / playerDino.maxHp) * 100}%` }]} /></View>
        <View style={s.barBg}><View style={[s.spBar, { width: `${(playerDino.currentSp / playerDino.maxSp) * 100}%` }]} /></View>
        <Text style={s.statText}>HP: {playerDino.currentHp}/{playerDino.maxHp} | SP: {playerDino.currentSp}/100</Text>
      </View>

      {/* Battle Log */}
      <View style={s.logBox}>
        {log.map((l, i) => <Text key={i} style={s.log}>{l}</Text>)}
      </View>

      {/* Actions */}
      {!battleOver && (
        <View style={s.actions}>
          <TouchableOpacity style={s.btn} onPress={() => handleAction('attack')}>
            <Text style={s.btnText}>Attack</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.btn} onPress={() => handleAction('defend')}>
            <Text style={s.btnText}>Defend</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.btn, !canUseSpecial(playerDino.currentSp) && s.btnDisabled]} onPress={() => handleAction('special')} disabled={!canUseSpecial(playerDino.currentSp)}>
            <Text style={s.btnText}>Special</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.btn, !(inventory['dino_ball'] > 0) && s.btnDisabled]} onPress={() => handleAction('dino_ball')} disabled={!(inventory['dino_ball'] > 0)}>
            <Text style={s.btnText}>Ball ({inventory['dino_ball'] || 0})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.btn} onPress={() => handleAction('run')}>
            <Text style={s.btnText}>Run</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', padding: 20, paddingTop: 60 },
  dinoSection: { marginBottom: 16 },
  dinoName: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  barBg: { height: 12, backgroundColor: '#333', borderRadius: 6, marginBottom: 4 },
  hpBar: { height: 12, backgroundColor: '#27ae60', borderRadius: 6 },
  spBar: { height: 12, backgroundColor: '#f39c12', borderRadius: 6 },
  statText: { color: '#aaa', fontSize: 12 },
  logBox: { flex: 1, justifyContent: 'flex-end', marginBottom: 16 },
  log: { color: '#ccc', fontSize: 13, marginBottom: 2 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  btn: { backgroundColor: '#0f3460', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, minWidth: '45%', alignItems: 'center' },
  btnDisabled: { backgroundColor: '#333' },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
