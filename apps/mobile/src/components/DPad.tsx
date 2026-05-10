import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import type { Direction } from '@palnetaurus/shared';
import { DSText } from './DSText';

type Props = { onPress: (dir: Direction) => void };

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
};

export function DPad({ onPress }: Props) {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  const handleKey = (e: any) => {
    const dir = KEY_MAP[e.nativeEvent.key];
    if (dir) onPress(dir);
  };

  return (
    <View style={s.container}>
      <TextInput
        ref={inputRef}
        style={s.hidden}
        onKeyPress={handleKey}
        autoFocus
        showSoftInputOnFocus={false}
        caretHidden
      />
      <View style={s.cross}>
        <View style={s.vertical}>
          <TouchableOpacity style={s.btn} onPress={() => onPress('up')}>
            <DSText size="sm">▲</DSText>
          </TouchableOpacity>
          <View style={s.center} />
          <TouchableOpacity style={s.btn} onPress={() => onPress('down')}>
            <DSText size="sm">▼</DSText>
          </TouchableOpacity>
        </View>
        <View style={s.horizontal}>
          <TouchableOpacity style={s.btn} onPress={() => onPress('left')}>
            <DSText size="sm">◀</DSText>
          </TouchableOpacity>
          <View style={s.center} />
          <TouchableOpacity style={s.btn} onPress={() => onPress('right')}>
            <DSText size="sm">▶</DSText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const BTN = 44;
const s = StyleSheet.create({
  container: { position: 'absolute', bottom: 40, left: 24 },
  hidden: { position: 'absolute', width: 0, height: 0, opacity: 0 },
  cross: { width: BTN * 3, height: BTN * 3, position: 'relative' },
  vertical: { position: 'absolute', left: BTN, top: 0, alignItems: 'center' },
  horizontal: { position: 'absolute', top: BTN, left: 0, flexDirection: 'row' },
  btn: {
    width: BTN, height: BTN, backgroundColor: '#3a3a4a', borderWidth: 1,
    borderColor: '#555', justifyContent: 'center', alignItems: 'center',
  },
  center: { width: BTN, height: BTN, backgroundColor: '#4a4a5a', borderWidth: 1, borderColor: '#555' },
});
