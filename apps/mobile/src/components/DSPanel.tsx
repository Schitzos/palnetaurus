import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { DSColors, DSSpacing } from '../theme/dsTheme';

type Props = { children: React.ReactNode; style?: ViewStyle; variant?: 'panel' | 'dialogue' };

export function DSPanel({ children, style, variant = 'panel' }: Props) {
  return <View style={[styles.base, variant === 'dialogue' && styles.dialogue, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: DSColors.panelBg,
    borderWidth: 2,
    borderColor: DSColors.panelBorder,
    borderRadius: 8,
    padding: DSSpacing.md,
  },
  dialogue: {
    backgroundColor: DSColors.dialogueBg,
    borderColor: DSColors.dialogueBorder,
  },
});
