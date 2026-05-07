// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { useVoice } from '@/hooks/useVoice';
import { useGenerate } from '@/hooks/useGenerate';
import { GENERATION_MODES, GenerationMode } from '@/constants/config';
import {
  GlassCard, GradientButton, VoiceVisualizer,
  ModeChip, GenerationResultCard, ScreenHeader, ProgressBar
} from '@/components';

export default function VoiceScreen() {
  const { status: voiceStatus, transcript, error: voiceError, startListening, stopListening, cancel, reset: resetVoice } = useVoice();
  const { status: genStatus, progress, result, mode, setMode, generate, reset: resetGen } = useGenerate();
  const [editedPrompt, setEditedPrompt] = useState('');

  const isListening = voiceStatus === 'listening';
  const isProcessing = voiceStatus === 'processing';
  const isDone = voiceStatus === 'done';
  const isGenerating = genStatus === 'generating';
  const isSuccess = genStatus === 'success';

  const handleMicPress = async () => {
    if (isListening) {
      await stopListening();
    } else {
      resetGen();
      await startListening();
    }
  };

  const handleGenerate = () => {
    const promptToUse = editedPrompt || transcript;
    generate(promptToUse);
  };

  const handleReset = () => {
    resetVoice();
    resetGen();
    setEditedPrompt('');
  };

  React.useEffect(() => {
    if (transcript) setEditedPrompt(transcript);
  }, [transcript]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ScreenHeader
            title="Voice to AI"
            subtitle="Speak your vision. AI brings it to life."
          />

          {/* Voice Orb */}
          <GlassCard elevated style={styles.orbCard}>
            <View style={styles.orbArea}>
              {/* Glow ring */}
              <View style={[
                styles.glowRing,
                isListening ? styles.glowRingActive : null,
                isProcessing ? styles.glowRingProcessing : null
              ]} />

              {/* Main mic button */}
              <Pressable
                onPress={handleMicPress}
                disabled={isProcessing || isGenerating || isSuccess}
                style={({ pressed }) => [styles.micBtn, { opacity: pressed ? 0.85 : 1 }]}
              >
                <LinearGradient
                  colors={
                    isListening
                      ? ['#EF4444', '#DB2777']
                      : [Colors.gradientPurple, Colors.gradientBlue]
                  }
                  style={styles.micGradient}
                >
                  <MaterialIcons
                    name={isListening ? 'stop' : (isProcessing ? 'hourglass-empty' : 'mic')}
                    size={40}
                    color="#fff"
                  />
                </LinearGradient>
              </Pressable>
            </View>

            {/* Visualizer */}
            <VoiceVisualizer isActive={isListening} />

            {/* Status text */}
            <Text style={[
              styles.statusText,
              isListening ? styles.statusListening : null,
              isProcessing ? styles.statusProcessing : null,
            ]}>
              {isListening
                ? 'Listening... tap to stop'
                : isProcessing
                  ? 'Transcribing...'
                  : isDone
                    ? 'Done! Edit or generate below'
                    : 'Tap the mic to start speaking'}
            </Text>

            {voiceError ? (
              <View style={styles.errorRow}>
                <MaterialIcons name="error-outline" size={14} color={Colors.error} />
                <Text style={styles.errorText}>{voiceError}</Text>
              </View>
            ) : null}
          </GlassCard>

          {/* Transcript editor */}
          {(isDone || isGenerating || isSuccess) ? (
            <GlassCard style={styles.transcriptCard}>
              <View style={styles.transcriptHeader}>
                <MaterialIcons name="record-voice-over" size={16} color={Colors.primaryLight} />
                <Text style={styles.transcriptTitle}>Your prompt</Text>
              </View>
              <TextInput
                style={styles.transcriptInput}
                value={editedPrompt}
                onChangeText={setEditedPrompt}
                multiline
                placeholderTextColor={Colors.textSubtle}
                editable={!isGenerating && !isSuccess}
              />

              {/* Mode */}
              <View style={styles.modeRow}>
                <ModeChip
                  label="✦ Image"
                  selected={mode === GENERATION_MODES.IMAGE}
                  onPress={() => setMode(GENERATION_MODES.IMAGE as GenerationMode)}
                />
                <ModeChip
                  label="▶ Video"
                  selected={mode === GENERATION_MODES.VIDEO}
                  onPress={() => setMode(GENERATION_MODES.VIDEO as GenerationMode)}
                />
              </View>

              {isGenerating ? (
                <View style={styles.progressArea}>
                  <View style={styles.progressRow}>
                    <Text style={styles.progressLabel}>Generating...</Text>
                    <Text style={styles.progressPct}>{Math.round(progress)}%</Text>
                  </View>
                  <ProgressBar progress={progress} height={4} />
                </View>
              ) : null}

              {!isSuccess && !isGenerating ? (
                <GradientButton
                  label="Generate from Voice"
                  onPress={handleGenerate}
                  disabled={!editedPrompt.trim()}
                />
              ) : null}
            </GlassCard>
          ) : null}

          {/* Result */}
          {isSuccess && result ? (
            <GenerationResultCard result={result} onNew={handleReset} />
          ) : null}

          {/* Tips */}
          {!isDone && !isGenerating && !isSuccess ? (
            <GlassCard style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>Voice Tips</Text>
              {[
                'Speak clearly and describe visual details',
                'Mention colors, mood, and style',
                'Include "image" or "video" in your prompt',
                'Hold the button for longer prompts',
              ].map((tip, i) => (
                <View key={i} style={styles.tipRow}>
                  <Text style={styles.tipBullet}>·</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </GlassCard>
          ) : null}

          <View style={{ height: Spacing.xxl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { gap: Spacing.md, paddingBottom: Spacing.xxl },
  orbCard: {
    marginHorizontal: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
  },
  orbArea: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: Colors.surfaceBorder,
  },
  glowRingActive: {
    borderColor: Colors.error,
    shadowColor: Colors.error,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  glowRingProcessing: {
    borderColor: Colors.warning,
    shadowColor: Colors.warning,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  micBtn: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  micGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  statusListening: { color: '#EF4444' },
  statusProcessing: { color: Colors.warning },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  errorText: { color: Colors.error, fontSize: FontSize.xs },
  transcriptCard: {
    marginHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  transcriptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  transcriptTitle: {
    color: Colors.primaryLight,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  transcriptInput: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    lineHeight: 24,
    padding: Spacing.md,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  modeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  progressArea: { gap: Spacing.sm },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { color: Colors.textSecondary, fontSize: FontSize.sm },
  progressPct: { color: Colors.primaryLight, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  tipsCard: {
    marginHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  tipsTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  tipRow: { flexDirection: 'row', gap: Spacing.sm },
  tipBullet: { color: Colors.primaryLight, fontSize: FontSize.md },
  tipText: { color: Colors.textSecondary, fontSize: FontSize.sm, lineHeight: 20, flex: 1 },
});
