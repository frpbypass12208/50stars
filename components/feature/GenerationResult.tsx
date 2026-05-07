// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { GenerationResult as ResultType } from '@/services/aiService';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { GlassCard } from '../ui/GlassCard';

interface Props {
  result: ResultType;
  onNew: () => void;
}

export function GenerationResultCard({ result, onNew }: Props) {
  return (
    <GlassCard elevated style={styles.card}>
      <View style={styles.header}>
        <View style={styles.typeBadge}>
          <MaterialIcons
            name={result.type === 'image' ? 'image' : 'videocam'}
            size={14}
            color={Colors.primaryLight}
          />
          <Text style={styles.typeText}>{result.type === 'image' ? 'Image' : 'Video'}</Text>
        </View>
        <MaterialIcons name="check-circle" size={20} color={Colors.success} />
      </View>

      <Image
        source={{ uri: result.url }}
        style={styles.image}
        contentFit="cover"
        transition={400}
      />

      <Text style={styles.prompt} numberOfLines={2}>{result.prompt}</Text>

      <Pressable
        onPress={onNew}
        style={({ pressed }) => [styles.newBtn, { opacity: pressed ? 0.8 : 1 }]}
      >
        <MaterialIcons name="add" size={16} color={Colors.textSecondary} />
        <Text style={styles.newBtnText}>Generate Another</Text>
      </Pressable>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryGlow,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.round,
  },
  typeText: {
    color: Colors.primaryLight,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceBorder,
  },
  prompt: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
    marginTop: Spacing.xs,
  },
  newBtnText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
});
