// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  Pressable, KeyboardAvoidingView, Platform
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { GENERATION_MODES, GenerationMode } from '@/constants/config';
import { useGenerate } from '@/hooks/useGenerate';
import { aiService } from '@/services/aiService';
import {
  GradientButton, GlassCard, ProgressBar,
  ModeChip, GenerationResultCard, ScreenHeader
} from '@/components';

export default function GenerateScreen() {
  const [prompt, setPrompt] = useState('');
  const { status, progress, result, error, mode, setMode, generate, reset } = useGenerate();
  const suggestions = aiService.getSuggestedPrompts();

  const isGenerating = status === 'generating';
  const isSuccess = status === 'success';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <Image
              source={require('@/assets/images/hero-banner.png')}
              style={styles.heroBanner}
              contentFit="cover"
              transition={300}
            />
            <LinearGradient
              colors={['transparent', Colors.background]}
              style={styles.heroBannerFade}
            />
            <View style={styles.headerOverlay}>
              <Text style={styles.appName}>AuraAI</Text>
              <Text style={styles.tagline}>Create anything with AI</Text>
            </View>
          </View>

          {/* Mode selector */}
          <GlassCard style={styles.modeCard}>
            <Text style={styles.sectionLabel}>Generation Mode</Text>
            <View style={styles.modeRow}>
              <ModeChip
                label="✦ Image"
                selected={mode === GENERATION_MODES.IMAGE}
                onPress={() => setMode(GENERATION_MODES.IMAGE as GenerationMode)}
                style={styles.chip}
              />
              <ModeChip
                label="▶ Video"
                selected={mode === GENERATION_MODES.VIDEO}
                onPress={() => setMode(GENERATION_MODES.VIDEO as GenerationMode)}
                style={styles.chip}
              />
            </View>
          </GlassCard>

          {/* Prompt input */}
          {!isSuccess ? (
            <GlassCard elevated style={styles.promptCard}>
              <Text style={styles.sectionLabel}>Describe your creation</Text>
              <TextInput
                style={styles.input}
                value={prompt}
                onChangeText={setPrompt}
                placeholder="A cyberpunk city at night with neon lights..."
                placeholderTextColor={Colors.textSubtle}
                multiline
                numberOfLines={3}
                maxLength={500}
                editable={!isGenerating}
              />
              <Text style={styles.charCount}>{prompt.length}/500</Text>

              {/* Suggestions */}
              {!isGenerating && (
                <View style={styles.suggestionsArea}>
                  <Text style={styles.suggestLabel}>Quick suggestions</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestScroll}>
                    <View style={styles.suggestRow}>
                      {suggestions.map((s, i) => (
                        <Pressable
                          key={i}
                          onPress={() => setPrompt(s)}
                          style={({ pressed }) => [styles.suggestChip, { opacity: pressed ? 0.7 : 1 }]}
                        >
                          <Text style={styles.suggestText} numberOfLines={1}>{s}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              )}

              {/* Progress */}
              {isGenerating && (
                <View style={styles.progressArea}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>
                      {mode === GENERATION_MODES.VIDEO ? 'Generating video...' : 'Generating image...'}
                    </Text>
                    <Text style={styles.progressPct}>{Math.round(progress)}%</Text>
                  </View>
                  <ProgressBar progress={progress} height={6} />
                  <Text style={styles.progressHint}>
                    {mode === GENERATION_MODES.VIDEO
                      ? 'Video generation takes 30–60s on average'
                      : 'Image generation takes 5–10s on average'}
                  </Text>
                </View>
              )}

              {error ? (
                <View style={styles.errorRow}>
                  <MaterialIcons name="error-outline" size={16} color={Colors.error} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <GradientButton
                label={isGenerating
                  ? (mode === GENERATION_MODES.VIDEO ? 'Generating Video...' : 'Generating Image...')
                  : (mode === GENERATION_MODES.VIDEO ? '▶ Generate Video' : '✦ Generate Image')}
                onPress={() => generate(prompt)}
                loading={isGenerating}
                disabled={!prompt.trim() || isGenerating}
                style={styles.generateBtn}
              />
            </GlassCard>
          ) : null}

          {/* Result */}
          {isSuccess && result ? (
            <GenerationResultCard result={result} onNew={reset} />
          ) : null}

          <View style={{ height: Spacing.xxl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: { flex: 1 },
  content: {
    gap: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  headerRow: {
    height: 180,
    overflow: 'hidden',
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    marginBottom: Spacing.xs,
  },
  heroBanner: {
    width: '100%',
    height: '100%',
  },
  heroBannerFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  headerOverlay: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
  },
  appName: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  modeCard: {
    marginHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  chip: { flex: 1, alignItems: 'center' as const },
  promptCard: {
    marginHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    lineHeight: 24,
    padding: Spacing.md,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: FontSize.xs,
    color: Colors.textSubtle,
    textAlign: 'right',
    marginTop: -Spacing.sm,
  },
  suggestionsArea: {
    gap: Spacing.sm,
  },
  suggestLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSubtle,
    fontWeight: FontWeight.medium,
  },
  suggestScroll: { marginHorizontal: -Spacing.md },
  suggestRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  suggestChip: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: Radius.round,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    maxWidth: 200,
  },
  suggestText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  progressArea: {
    gap: Spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  progressPct: {
    color: Colors.primaryLight,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  progressHint: {
    color: Colors.textSubtle,
    fontSize: FontSize.xs,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.errorGlow,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSize.sm,
    flex: 1,
  },
  generateBtn: {
    width: '100%',
  },
});
