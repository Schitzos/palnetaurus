import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGameStore } from '../store/gameStore';
import { canCreateDino, createCustomDino, ELEMENT_GENES, STAT_GENES } from '../data/dinoLab';
import { ITEM_NAMES } from '../data/items';
import { DSColors, DSSpacing } from '../theme/dsTheme';
import { DSPanel } from '../components/DSPanel';
import { DSText } from '../components/DSText';
import { DSButton } from '../components/DSButton';

export function DinoLabScreen() {
  const navigation = useNavigation();
  const { inventory, updateInventory, addDino, updateDinopedia } = useGameStore();
  const [name, setName] = useState('');
  const [element, setElement] = useState('');
  const [stats, setStats] = useState<string[]>([]);

  const toggleStat = (g: string) => {
    setStats((p) => p.includes(g) ? p.filter((x) => x !== g) : p.length < 2 ? [...p, g] : p);
  };

  const create = () => {
    if (!name.trim()) { Alert.alert('Enter a name'); return; }
    if (!element || stats.length < 2) { Alert.alert('Select 1 element + 2 stat genes'); return; }
    if (!canCreateDino(inventory)) { Alert.alert('Not enough materials'); return; }
    updateInventory('dino_gene_blueprint', -1);
    updateInventory(element, -1);
    stats.forEach((g) => updateInventory(g, -1));
    const dino = createCustomDino(name, element, stats);
    addDino(dino);
    updateDinopedia({ dinoId: dino.speciesId, status: 'created' });
    Alert.alert('Created!', `${name} has been born!`);
    navigation.goBack();
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.header}>
        <DSButton label="← BACK" onPress={() => navigation.goBack()} />
        <DSText size="lg" style={s.title}>DINO LAB</DSText>
      </View>
      <DSPanel style={s.info}>
        <DSText size="xs">Blueprint: {inventory['dino_gene_blueprint'] || 0}</DSText>
      </DSPanel>
      <TextInput
        style={s.input}
        placeholder="DINO NAME"
        placeholderTextColor={DSColors.disabled}
        value={name}
        onChangeText={setName}
      />
      <DSText size="xs" style={s.label}>ELEMENT GENE (pick 1):</DSText>
      <View style={s.chips}>
        {ELEMENT_GENES.map((g) => (
          <DSButton
            key={g}
            label={`${(ITEM_NAMES[g] || g).toUpperCase()} (${inventory[g] || 0})`}
            onPress={() => setElement(g)}
            style={element === g ? s.chipActive : s.chip}
          />
        ))}
      </View>
      <DSText size="xs" style={s.label}>STAT GENES (pick 2):</DSText>
      <View style={s.chips}>
        {STAT_GENES.map((g) => (
          <DSButton
            key={g}
            label={`${(ITEM_NAMES[g] || g).toUpperCase()} (${inventory[g] || 0})`}
            onPress={() => toggleStat(g)}
            style={stats.includes(g) ? s.chipActive : s.chip}
          />
        ))}
      </View>
      <DSButton label="CREATE DINO" onPress={create} style={s.createBtn} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: DSColors.background },
  content: { padding: DSSpacing.lg, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: DSSpacing.lg, gap: DSSpacing.md },
  title: { flex: 1 },
  info: { marginBottom: DSSpacing.md },
  input: {
    backgroundColor: DSColors.panelBg, color: DSColors.textPrimary,
    borderWidth: 2, borderColor: DSColors.panelBorder, borderRadius: 6,
    padding: DSSpacing.md, marginBottom: DSSpacing.md, fontSize: 12,
    fontFamily: 'PressStart2P-Regular',
  },
  label: { color: DSColors.textSecondary, marginBottom: DSSpacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: DSSpacing.sm, marginBottom: DSSpacing.lg },
  chip: { paddingVertical: 4, paddingHorizontal: 8 },
  chipActive: { paddingVertical: 4, paddingHorizontal: 8, backgroundColor: DSColors.accent, borderColor: DSColors.accent },
  createBtn: { marginTop: DSSpacing.md },
});
