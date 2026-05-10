import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGameStore } from '../store/gameStore';
import { ITEM_NAMES } from '../data/items';
import { DSColors, DSSpacing } from '../theme/dsTheme';
import { DSPanel } from '../components/DSPanel';
import { DSText } from '../components/DSText';
import { DSButton } from '../components/DSButton';

export function InventoryScreen() {
  const navigation = useNavigation();
  const { inventory } = useGameStore();
  const items = Object.entries(inventory).filter(([, v]) => v > 0);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <DSButton label="← BACK" onPress={() => navigation.goBack()} />
        <DSText size="lg" style={s.title}>BAG</DSText>
      </View>
      {items.length === 0 && (
        <DSPanel variant="dialogue"><DSText size="sm">No items yet.</DSText></DSPanel>
      )}
      <FlatList
        data={items}
        keyExtractor={([id]) => id}
        renderItem={({ item: [id, count] }) => (
          <DSPanel style={s.row}>
            <DSText size="sm" style={{ flex: 1 }}>{(ITEM_NAMES[id] || id).toUpperCase()}</DSText>
            <DSText size="sm" style={s.count}>x{count}</DSText>
          </DSPanel>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: DSColors.background, padding: DSSpacing.lg, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: DSSpacing.lg, gap: DSSpacing.md },
  title: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: DSSpacing.sm },
  count: { color: DSColors.accent },
});
