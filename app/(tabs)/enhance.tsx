// Powered by OnSpace.AI
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { ENHANCE_MODES } from '@/constants/config';
import { useEnhance } from '@/hooks/useEnhance';
import { GlassCard, GradientButton, ProgressBar, ScreenHeader } from '@/components';

export default function EnhanceScreen() {
  const {
    status, progress, result, selectedImage, selectedMode,
    setSelectedMode, pickMockImage, enhance, reset, error
  } = useEnhance();

  const isEnhancing = status === 'enhancing';
  const isSuccess = status === 'success';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="HQ Enhance"
          subtitle="Upscale and refine your images with AI"
        />

        {/* Upload area */}
        <GlassCard elevated style={styles.uploadCard}>
          <Text style={styles.sectionLabel}>Source Image</Text>
          {selectedImage ? (
            <View style={styles.imagePreview}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.previewImg}
                contentFit="cover"
                transition={300}
              />
              {!isEnhancing && !isSuccess ? (
                <Pressable
                  onPress={pickMockImage}
                  style={({ pressed }) => [styles.changeBtn, { opacity: pressed ? 0.7 : 1 }]}
                >
                  <MaterialIcons name="refresh" size={16} color={Colors.textSecondary} />
                  <Text style={styles.changeBtnText}>Change</Text>
                </Pressable>
              ) : null}
            </View>
          ) : (
            <Pressable
              onPress={pickMockImage}
              style={({ pressed }) => [styles.uploadBox, { opacity: pressed ? 0.7 : 1 }]}
            >
              <View style={styles.uploadIconWrapper}>
                <MaterialIcons name="add-photo-alternate" size={36} color={Colors.primaryLight} />
              </View>
              <Text style={styles.uploadTitle}>Select an image</Text>
              <Text style={styles.uploadHint}>Tap to load a sample image</Text>
            </Pressable>
          )}
        </GlassCard>

        {/* Enhancement modes */}
        {selectedImage && !isSuccess ? (
          <GlassCard style={styles.modesCard}>
            <Text style={styles.sectionLabel}>Enhancement Type</Text>
            <View style={styles.modesGrid}>
              {ENHANCE_MODES.map(em => (
                <Pressable
                  key={em.id}
                  onPress={() => setSelectedMode(em.id)}
                  disabled={isEnhancing}
                  style={({ pressed }) => [
                    styles.modeItem,
                    selectedMode === em.id ? styles.modeItemSelected : null,
                    { opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  <Text style={[
                    styles.modeLabel,
                    selectedMode === em.id ? styles.modeLabelSelected : null
                  ]}>
                    {em.label}
                  </Text>
                  <Text style={styles.modeDesc}>{em.description}</Text>
                </Pressable>
              ))}
            </View>
          </GlassCard>
        ) : null}

        {/* Progress */}
        {isEnhancing ? (
          <GlassCard style={styles.progressCard}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Enhancing...</Text>
              <Text style={styles.progressPct}>{Math.round(progress)}%</Text>
            </View>
            <ProgressBar progress={progress} height={6} />
            <Text style={styles.progressHint}>AI is analyzing and enhancing your image</Text>
          </GlassCard>
        ) : null}

        {error ? (
          <View style={styles.errorRow}>
            <MaterialIcons name="error-outline" size={16} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Result: before/after */}
        {isSuccess && result ? (
          <GlassCard elevated style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <MaterialIcons name="check-circle" size={20} color={Colors.success} />
              <Text style={styles.resultTitle}>Enhancement Complete</Text>
            </View>
            <View style={styles.compareRow}>
              <View style={styles.compareItem}>
                <Text style={styles.compareLabel}>Before</Text>
                <Image
                  source={{ uri: result.originalUrl }}
                  style={styles.compareImg}
                  contentFit="cover"
                  transition={300}
                />
              </View>
              <View style={styles.compareDivider} />
              <View style={styles.compareItem}>
                <Text style={[styles.compareLabel, styles.compareLabelAfter]}>After ✦</Text>
                <Image
                  source={{ uri: result.enhancedUrl }}
                  style={styles.compareImg}
                  contentFit="cover"
                  transition={400}
                />
              </View>
            </View>

            <View style={styles.resultMeta}>
              <MaterialIcons name="hd" size={14} color={Colors.primaryLight} />
              <Text style={styles.resultMetaText}>
                {ENHANCE_MODES.find(m => m.id === result.mode)?.label ?? 'Enhanced'} applied
              </Text>
            </View>

            <GradientButton
              label="Enhance Another"
              onPress={reset}
              variant="accent"
            />
          </GlassCard>
        ) : null}

        {/* CTA */}
        {selectedImage && !isEnhancing && !isSuccess ? (
          <GradientButton
            label="✦ Enhance Now"
            onPress={enhance}
            style={styles.enhanceBtn}
          />
        ) : null}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { gap: Spacing.md, paddingBottom: Spacing.xxl },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  uploadCard: { marginHorizontal: Spacing.md, gap: Spacing.md },
  imagePreview: { gap: Spacing.sm },
  previewImg: {
    width: '100%',
    height: 200,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceBorder,
  },
  changeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: Radius.md,
  },
  changeBtnText: { color: Colors.textSecondary, fontSize: FontSize.sm },
  uploadBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed' as const,
    borderColor: Colors.surfaceBorder,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  uploadIconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
  },
  uploadHint: { color: Colors.textSubtle, fontSize: FontSize.sm },
  modesCard: { marginHorizontal: Spacing.md, gap: Spacing.md },
  modesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap' as const,
    gap: Spacing.sm,
  },
  modeItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: 4,
  },
  modeItemSelected: {
    borderColor: Colors.primaryLight,
    backgroundColor: Colors.primaryGlow,
  },
  modeLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  modeLabelSelected: { color: Colors.primaryLight },
  modeDesc: { color: Colors.textSubtle, fontSize: FontSize.xs, lineHeight: 16 },
  progressCard: {
    marginHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  progressPct: { color: Colors.primaryLight, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  progressHint: { color: Colors.textSubtle, fontSize: FontSize.xs },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.errorGlow,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
  },
  errorText: { color: Colors.error, fontSize: FontSize.sm, flex: 1 },
  resultCard: { marginHorizontal: Spacing.md, gap: Spacing.md },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  resultTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  compareRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  compareItem: { flex: 1, gap: Spacing.xs },
  compareLabel: {
    color: Colors.textSubtle,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },
  compareLabelAfter: { color: Colors.primaryLight },
  compareImg: {
    width: '100%',
    height: 150,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceBorder,
  },
  compareDivider: {
    width: 1,
    height: 150,
    backgroundColor: Colors.surfaceBorder,
    alignSelf: 'center',
    marginTop: 22,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  resultMetaText: { color: Colors.textSecondary, fontSize: FontSize.xs },
  enhanceBtn: { marginHorizontal: Spacing.md },
});
