import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { DSColors, DSSpacing, DSTypography } from '../theme/dsTheme';
import { DSText } from './DSText';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export function DSButton({ label, onPress, disabled, style }: Props) {
  return (
    <TouchableOpacity
      style={[styles.base, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <DSText size="sm" style={disabled ? styles.textDisabled : undefined}>
        {label}
      </DSText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: DSColors.panelBg,
    borderWidth: 2,
    borderColor: DSColors.panelBorder,
    borderRadius: 6,
    paddingVertical: DSSpacing.sm,
    paddingHorizontal: DSSpacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    borderColor: DSColors.disabled,
    backgroundColor: '#1a2030',
  },
  textDisabled: {
    color: DSColors.disabled,
  },
});
