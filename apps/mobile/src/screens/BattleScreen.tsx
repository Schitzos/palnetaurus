import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useGameStore } from '../store/gameStore';
import { BattleDino, BattleAction, executeTurn, canUseSpecial, getAiAction } from '../data/battle';
import { attemptCatch } from '../data/catch';
import { rollDrop, ITEM_NAMES } from '../data/items';
import type { WildDino } from '../data/encounters';
import { DSColors, DSSpacing } from '../theme/dsTheme';
import { DSPanel } from '../components/DSPanel';
import { DSText } from '../components/DSText';
import { DSButton } from '../components/DSButton';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Battle'>;

function HPBar({ current, max }: { current: number; max: number }) {
  const pct = Math.max(0, current / max);
  const color = pct > 0.5 ? DSColors.hpGreen : pct > 0.25 ? DSColors.hpYellow : DSColors.hpRed;
  return (
    <View style={styles.barBg}>
      <View style={[styles.barFill, { width: `${pct * 100}%`, backgroundColor: color }]} />
    </View>
  );
}

function SPBar({ current, max }: { current: number; max: number }) {
  return (
    <View style={styles.barBg}>
      <View style={[styles.barFill, { width: `${Math.max(0, current / max) * 100}%`, backgroundColor: DSColors.spBar }]} />
    </View>
  );
}

export function BattleScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const wildDinoData = (route.params as any)?.wildDino as WildDino | undefined;
  const { dinos, triggerAutoSave, inventory, updateInventory, addDino, updateDinopedia } = useGameStore();

  const playerDinoData = dinos.owned[0];
  if (!playerDinoData || !wildDinoData) {
    return <View style={styles.container}><DSText>No battle data</DSText></View>;
  }

  const [playerDino, setPlayerDino] = useState<BattleDino>({
    speciesId: playerDinoData.speciesId, level: playerDinoData.level,
    currentHp: playerDinoData.currentHp, maxHp: playerDinoData.maxHp,
    currentSp: 0, maxSp: playerDinoData.maxSp,
    attack: playerDinoData.attack, defense: playerDinoData.defense, speed: playerDinoData.speed,
    moves: playerDinoData.moves, specialMoveId: playerDinoData.specialMoveId, isDefending: false,
  });
  const [wildDino, setWildDino] = useState<BattleDino>({ ...wildDinoData, isDefending: false });
  const [log, setLog] = useState<string[]>([`Wild ${wildDinoData.speciesId} appeared!`]);
  const [battleOver, setBattleOver] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const addLog = (msg: string) => setLog((prev) => [...prev.slice(-3), msg]);

  const handleAction = useCallback((action: BattleAction) => {
    if (battleOver) return;

    if (action === 'dino_ball') {
      const balls = inventory['dino_ball'] || 0;
      if (balls <= 0) { addLog('No Dino Balls!'); return; }
      updateInventory('dino_ball', -1);
      addLog('Threw a Dino Ball...');
      const caught = attemptCatch(wildDino.speciesId, wildDino.currentHp, wildDino.maxHp, 'dino_ball');
      if (caught) {
        addLog(`Caught ${wildDino.speciesId}!`);
        addDino({ instanceId: `${wildDino.speciesId}_${Date.now()}`, speciesId: wildDino.speciesId, source: 'caught', level: wildDino.level, exp: 0, currentHp: wildDino.currentHp, maxHp: wildDino.maxHp, currentSp: 0, maxSp: wildDino.maxSp, attack: wildDino.attack, defense: wildDino.defense, speed: wildDino.speed, heightMeter: 1.0, bond: 10, rideable: false, moves: wildDino.moves, specialMoveId: wildDino.specialMoveId });
        updateDinopedia({ dinoId: wildDino.speciesId, status: 'caught' });
        setBattleOver(true); setResult('CAUGHT!');
        triggerAutoSave();
        setTimeout(() => navigation.goBack(), 2000);
        return;
      }
      addLog('It broke free!');
      const aiAction = getAiAction(wildDino);
      const eResult = executeTurn({ ...wildDino, isDefending: false }, playerDino, aiAction);
      setPlayerDino((prev) => ({ ...prev, currentHp: Math.max(0, prev.currentHp - eResult.damage) }));
      if (aiAction === 'attack') addLog(`Wild dino attacks! -${eResult.damage} HP`);
      return;
    }

    const pResult = executeTurn({ ...playerDino, isDefending: false }, wildDino, action);

    if (action === 'run' && pResult.escaped) {
      addLog('Got away safely!'); setBattleOver(true);
      setTimeout(() => navigation.goBack(), 1000);
      return;
    }
    if (action === 'run') addLog("Couldn't escape!");

    let newWild = { ...wildDino, currentHp: Math.max(0, wildDino.currentHp - pResult.damage), currentSp: pResult.defenderSp };
    let newPlayer = { ...playerDino, currentSp: pResult.attackerSp, isDefending: action === 'defend' };

    if (action === 'attack') addLog(`Your dino attacks! -${pResult.damage} HP`);
    if (action === 'defend') addLog('Your dino defends! SP +25');
    if (action === 'special') addLog(`SPECIAL MOVE! -${pResult.damage} HP`);

    if (newWild.currentHp <= 0) {
      addLog('You win!');
      const drop = rollDrop();
      if (drop) { updateInventory(drop, 1); addLog(`Dropped: ${ITEM_NAMES[drop] || drop}`); }
      updateDinopedia({ dinoId: wildDino.speciesId, status: 'seen' });
      setBattleOver(true); setResult('YOU WIN!');
      triggerAutoSave();
      setTimeout(() => navigation.goBack(), 2000);
      setWildDino(newWild); setPlayerDino(newPlayer);
      return;
    }

    const aiAction = getAiAction(newWild);
    const eResult = executeTurn({ ...newWild, isDefending: false }, newPlayer, aiAction);
    newPlayer = { ...newPlayer, currentHp: Math.max(0, newPlayer.currentHp - eResult.damage), currentSp: eResult.defenderSp, isDefending: false };
    newWild = { ...newWild, currentSp: eResult.attackerSp, isDefending: aiAction === 'defend' };

    if (aiAction === 'attack') addLog(`Wild dino attacks! -${eResult.damage} HP`);
    if (aiAction === 'defend') addLog('Wild dino defends!');
    if (aiAction === 'special') addLog(`Wild dino SPECIAL! -${eResult.damage} HP`);

    if (newPlayer.currentHp <= 0) {
      addLog('Your dino fainted...');
      setBattleOver(true); setResult('DEFEATED...');
      triggerAutoSave();
      setTimeout(() => navigation.goBack(), 2000);
    }

    setWildDino(newWild); setPlayerDino(newPlayer);
  }, [playerDino, wildDino, battleOver, navigation, triggerAutoSave, inventory, updateInventory, addDino, updateDinopedia]);

  return (
    <View style={styles.container}>
      {/* Top: Battle Scene */}
      <View style={styles.battleScene}>
        {/* Enemy - top right */}
        <DSPanel style={styles.enemyInfo}>
          <DSText size="xs">{`${wildDino.speciesId}  Lv.${wildDino.level}`}</DSText>
          <HPBar current={wildDino.currentHp} max={wildDino.maxHp} />
        </DSPanel>
        <View style={styles.enemySprite}>
          <Text style={styles.spriteEmoji}>🦕</Text>
        </View>

        {/* Player - bottom left */}
        <View style={styles.playerSprite}>
          <Text style={styles.spriteEmoji}>🦖</Text>
        </View>
        <DSPanel style={styles.playerInfo}>
          <DSText size="xs">{`${playerDino.speciesId}  Lv.${playerDino.level}`}</DSText>
          <View style={styles.barRow}><DSText size="xs" style={styles.barLabel}>HP</DSText><HPBar current={playerDino.currentHp} max={playerDino.maxHp} /></View>
          <View style={styles.barRow}><DSText size="xs" style={styles.barLabel}>SP</DSText><SPBar current={playerDino.currentSp} max={playerDino.maxSp} /></View>
        </DSPanel>
      </View>

      {/* Bottom: Actions */}
      <View style={styles.bottomSection}>
        <DSPanel variant="dialogue" style={styles.logBox}>
          {log.map((l, i) => <DSText key={i} size="xs" style={styles.logText}>{l}</DSText>)}
        </DSPanel>

        {result && (
          <View style={styles.overlay}>
            <DSPanel style={styles.resultPanel}>
              <DSText size="lg" style={{ color: DSColors.accent }}>{result}</DSText>
            </DSPanel>
          </View>
        )}

        {!battleOver && (
          <View style={styles.actionGrid}>
            <DSButton label="ATTACK" onPress={() => handleAction('attack')} style={styles.actionBtn} />
            <DSButton label="DEFEND" onPress={() => handleAction('defend')} style={styles.actionBtn} />
            <DSButton label="SPECIAL" onPress={() => handleAction('special')} disabled={!canUseSpecial(playerDino.currentSp)} style={styles.actionBtn} />
            <DSButton label={`BALL(${inventory['dino_ball'] || 0})`} onPress={() => handleAction('dino_ball')} disabled={!(inventory['dino_ball'] > 0)} style={styles.actionBtn} />
            <DSButton label="RUN" onPress={() => handleAction('run')} style={styles.actionBtn} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DSColors.background },
  battleScene: { flex: 0.55, backgroundColor: DSColors.battleBgGrass, padding: DSSpacing.md, paddingTop: 60, justifyContent: 'space-between' },
  enemyInfo: { alignSelf: 'flex-start', width: '60%', padding: DSSpacing.sm },
  enemySprite: { alignSelf: 'flex-end', marginRight: 40 },
  playerSprite: { alignSelf: 'flex-start', marginLeft: 40 },
  spriteEmoji: { fontSize: 64 },
  playerInfo: { alignSelf: 'flex-end', width: '65%', padding: DSSpacing.sm },
  barRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  barLabel: { width: 20, fontSize: 8 },
  barBg: { flex: 1, height: 6, backgroundColor: '#3d3d56', borderRadius: 3 },
  barFill: { height: 6, borderRadius: 3 },
  bottomSection: { flex: 0.45, padding: DSSpacing.md },
  logBox: { marginBottom: DSSpacing.sm, minHeight: 60 },
  logText: { color: DSColors.textSecondary, marginBottom: 2 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: DSSpacing.sm, justifyContent: 'center' },
  actionBtn: { width: '45%' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 10 },
  resultPanel: { paddingHorizontal: 32, paddingVertical: 20 },
});
