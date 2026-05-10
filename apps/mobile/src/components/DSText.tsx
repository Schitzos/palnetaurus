import React, { useEffect, useState } from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { DSColors, DSTypography, DSTiming } from '../theme/dsTheme';

type Props = {
  children: React.ReactNode;
  style?: TextStyle;
  size?: keyof typeof DSTypography.sizes;
  typewriter?: boolean;
  onComplete?: () => void;
};

export function DSText({ children, style, size = 'md', typewriter, onComplete }: Props) {
  const text = typeof children === 'string' ? children : '';
  const [displayed, setDisplayed] = useState(typewriter ? '' : text);

  useEffect(() => {
    if (!typewriter || typeof children !== 'string') return;
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(interval); onComplete?.(); }
    }, DSTiming.typewriterChar);
    return () => clearInterval(interval);
  }, [children, typewriter]);

  return (
    <Text style={[styles.base, { fontSize: DSTypography.sizes[size] }, style]}>
      {typewriter ? displayed : children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: DSTypography.fontFamily,
    color: DSColors.textPrimary,
  },
});
