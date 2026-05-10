export const DSColors = {
  panelBg: '#2C3E50',
  panelBorder: '#F4D03F',
  dialogueBg: '#1B2631',
  dialogueBorder: '#ECF0F1',
  textPrimary: '#FFFFFF',
  textSecondary: '#BDC3C7',
  hpGreen: '#27AE60',
  hpYellow: '#F39C12',
  hpRed: '#E74C3C',
  spBar: '#8E44AD',
  battleBgGrass: '#6B8E23',
  menuCursor: '#FFFFFF',
  background: '#1B2631',
  accent: '#F4D03F',
  disabled: '#3d3d56',
} as const;

export const DSTypography = {
  fontFamily: 'PressStart2P-Regular',
  sizes: { xs: 8, sm: 10, md: 12, lg: 14, xl: 16, title: 20 },
} as const;

export const DSSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const DSTiming = {
  menuOpen: 150,
  cursorMove: 80,
  typewriterChar: 30,
  battleTransition: 1200,
  attackAnim: 400,
  hpDrain: 600,
  ballShake: 300,
  screenFade: 300,
  spriteSlide: 500,
} as const;

export const DSPresets = {
  panel: {
    backgroundColor: DSColors.panelBg,
    borderWidth: 2,
    borderColor: DSColors.panelBorder,
    borderRadius: 8,
    padding: DSSpacing.md,
  },
  dialogue: {
    backgroundColor: DSColors.dialogueBg,
    borderWidth: 2,
    borderColor: DSColors.dialogueBorder,
    borderRadius: 8,
    padding: DSSpacing.md,
  },
  hpBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3d3d56',
  },
  menuCursor: {
    color: DSColors.menuCursor,
    fontSize: DSTypography.sizes.sm,
  },
} as const;
