import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import type { Direction } from '@palnetaurus/shared';

type Props = { onPress: (dir: Direction) => void };

export function DPad({ onPress }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.btn} onPress={() => onPress('up')}>
          <Text style={styles.arrow}>▲</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.btn} onPress={() => onPress('left')}>
          <Text style={styles.arrow}>◀</Text>
        </TouchableOpacity>
        <View style={styles.center} />
        <TouchableOpacity style={styles.btn} onPress={() => onPress('right')}>
          <Text style={styles.arrow}>▶</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.btn} onPress={() => onPress('down')}>
          <Text style={styles.arrow}>▼</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 40, left: 24 },
  row: { flexDirection: 'row', justifyContent: 'center' },
  btn: { width: 48, height: 48, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, justifyContent: 'center', alignItems: 'center', margin: 2 },
  center: { width: 48, height: 48 },
  arrow: { fontSize: 20, color: '#fff' },
});
