// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function ScreenHeader({ title, subtitle, icon }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      {icon ? (
        <View style={styles.iconWrapper}>{icon}</View>
      ) : null}
      <LinearGradient
        colors={[Colors.gradientPurple, Colors.gradientBlue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.titleGradient}
      >
        <Text style={styles.title}>{title}</Text>
      </LinearGradient>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  iconWrapper: {
    marginBottom: Spacing.xs,
  },
  titleGradient: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingRight: 2,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
    backgroundColor: 'transparent',
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
