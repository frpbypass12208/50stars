// Powered by OnSpace.AI
import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, FontSize, FontWeight, Spacing } from '@/constants/theme';

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'accent' | 'danger';
}

const GRADIENTS = {
  primary: [Colors.gradientPurple, Colors.gradientBlue] as [string, string],
  accent: [Colors.accent, Colors.primaryLight] as [string, string],
  danger: ['#EF4444', '#DB2777'] as [string, string],
};

export function GradientButton({
  label, onPress, loading, disabled, style,
  size = 'md', variant = 'primary'
}: GradientButtonProps) {
  const heights = { sm: 40, md: 52, lg: 60 };
  const fontSizes = { sm: FontSize.sm, md: FontSize.md, lg: FontSize.lg };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.wrapper,
        { height: heights[size], opacity: pressed || disabled ? 0.7 : 1 },
        style,
      ]}
    >
      <LinearGradient
        colors={GRADIENTS[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={[styles.label, { fontSize: fontSizes[size] }]}>{label}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius.round,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  label: {
    color: Colors.textPrimary,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
});
