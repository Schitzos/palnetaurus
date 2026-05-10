import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Storage } from '../utils/storage';
import { useGameStore } from '../store/gameStore';
import { DSColors, DSSpacing } from '../theme/dsTheme';
import { DSPanel } from '../components/DSPanel';
import { DSText } from '../components/DSText';
import { DSButton } from '../components/DSButton';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Title'>;

export function TitleScreen() {
  const navigation = useNavigation<Nav>();
  const loadSave = useGameStore((s) => s.loadSave);
  const hasSave = Storage.hasSave();
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleNewGame = () => navigation.navigate('StarterSelect');
  const handleContinue = () => {
    const save = Storage.load();
    if (save) { loadSave(save); navigation.navigate('WorldMap'); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoArea}>
        <DSPanel style={styles.logoPanel}>
          <DSText size="title" style={styles.title}>PLANETAURUS</DSText>
          <DSText size="xs" style={styles.subtitle}>Dinosaur Catching RPG</DSText>
        </DSPanel>
      </View>

      <Animated.View style={{ opacity: blinkAnim, marginBottom: DSSpacing.xxl }}>
        <DSText size="xs">PRESS START</DSText>
      </Animated.View>

      <View style={styles.menu}>
        <DSButton label="NEW GAME" onPress={handleNewGame} style={styles.menuBtn} />
        <DSButton label="CONTINUE" onPress={handleContinue} disabled={!hasSave} style={styles.menuBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DSColors.background, justifyContent: 'center', alignItems: 'center' },
  logoArea: { marginBottom: 48 },
  logoPanel: { alignItems: 'center', paddingVertical: 24, paddingHorizontal: 32 },
  title: { color: DSColors.accent, marginBottom: DSSpacing.sm },
  subtitle: { color: DSColors.textSecondary },
  menu: { gap: DSSpacing.md },
  menuBtn: { minWidth: 200 },
});
