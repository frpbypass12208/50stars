// Powered by OnSpace.AI
export const Colors = {
  // Base
  background: '#08080F',
  surface: '#10101A',
  surfaceElevated: '#161625',
  surfaceBorder: '#1E1E30',
  overlay: 'rgba(0,0,0,0.7)',

  // Brand
  primary: '#7C3AED',
  primaryLight: '#9F67F5',
  primaryGlow: 'rgba(124,58,237,0.25)',
  accent: '#3B82F6',
  accentLight: '#60A5FA',
  accentGlow: 'rgba(59,130,246,0.2)',

  // Gradient stops
  gradientPurple: '#7C3AED',
  gradientBlue: '#2563EB',
  gradientPink: '#DB2777',

  // Text
  textPrimary: '#F0F0FF',
  textSecondary: '#9090B0',
  textSubtle: '#505070',
  textInverse: '#08080F',

  // Semantic
  success: '#10B981',
  successGlow: 'rgba(16,185,129,0.2)',
  warning: '#F59E0B',
  error: '#EF4444',
  errorGlow: 'rgba(239,68,68,0.2)',

  // Tabs
  tabActive: '#9F67F5',
  tabInactive: '#505070',
  tabBar: '#0D0D1A',
  tabBorder: '#1A1A2E',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};
