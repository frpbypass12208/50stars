// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable, Dimensions, Modal, ActivityIndicator
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { useGallery } from '@/hooks/useGallery';
import { GenerationResult } from '@/services/aiService';
import { GlassCard, ScreenHeader } from '@/components';
import { useAlert } from '@/template';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - Spacing.md * 2 - Spacing.sm) / 2;

export default function GalleryScreen() {
  const { items, removeItem, clearAll } = useGallery();
  const { showAlert } = useAlert();
  const [selected, setSelected] = useState<GenerationResult | null>(null);
  const [actionLoading, setActionLoading] = useState<'download' | 'share' | null>(null);

  const downloadFile = async (url: string, type: 'image' | 'video') => {
    const ext = type === 'video' ? 'mp4' : 'png';
    const localUri = `${FileSystem.cacheDirectory}auraai_${Date.now()}.${ext}`;
    const { uri } = await FileSystem.downloadAsync(url, localUri);
    return uri;
  };

  const handleDownload = async () => {
    if (!selected) return;
    setActionLoading('download');
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        showAlert('Permission denied', 'Allow media library access to save files.');
        return;
      }
      const localUri = await downloadFile(selected.url, selected.type);
      await MediaLibrary.saveToLibraryAsync(localUri);
      showAlert('Saved!', 'Your creation has been saved to the camera roll.');
    } catch (err) {
      showAlert('Download failed', (err as Error).message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleShare = async () => {
    if (!selected) return;
    setActionLoading('share');
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        showAlert('Sharing unavailable', 'Your device does not support sharing.');
        return;
      }
      const localUri = await downloadFile(selected.url, selected.type);
      await Sharing.shareAsync(localUri, {
        mimeType: selected.type === 'video' ? 'video/mp4' : 'image/png',
        dialogTitle: 'Share your AuraAI creation',
      });
    } catch (err) {
      showAlert('Share failed', (err as Error).message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = (id: string) => {
    showAlert('Delete item?', 'This will remove it from your gallery.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeItem(id) },
    ]);
  };

  const handleClearAll = () => {
    if (items.length === 0) return;
    showAlert('Clear gallery?', 'All generated items will be removed.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearAll },
    ]);
  };

  const renderItem = ({ item }: { item: GenerationResult }) => (
    <Pressable
      onPress={() => setSelected(item)}
      style={({ pressed }) => [styles.gridItem, { opacity: pressed ? 0.85 : 1 }]}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.gridImg}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.gridOverlay}>
        <View style={styles.typeBadge}>
          <MaterialIcons
            name={item.type === 'image' ? 'image' : 'videocam'}
            size={11}
            color={Colors.textPrimary}
          />
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
        <Pressable
          onPress={() => handleDelete(item.id)}
          hitSlop={8}
          style={({ pressed }) => [styles.deleteBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <MaterialIcons name="close" size={14} color={Colors.textPrimary} />
        </Pressable>
      </View>
      <Text style={styles.gridPrompt} numberOfLines={2}>{item.prompt}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={items}
        keyExtractor={i => i.id}
        numColumns={2}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={
          <View>
            <ScreenHeader
              title="Gallery"
              subtitle={`${items.length} creation${items.length !== 1 ? 's' : ''}`}
            />
            {items.length > 0 ? (
              <Pressable
                onPress={handleClearAll}
                style={({ pressed }) => [styles.clearBtn, { opacity: pressed ? 0.7 : 1 }]}
              >
                <MaterialIcons name="delete-sweep" size={16} color={Colors.error} />
                <Text style={styles.clearBtnText}>Clear All</Text>
              </Pressable>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Image
              source={require('@/assets/images/empty-gallery.png')}
              style={styles.emptyImg}
              contentFit="contain"
              transition={300}
            />
            <Text style={styles.emptyTitle}>No creations yet</Text>
            <Text style={styles.emptyHint}>Generate images or videos to see them here</Text>
          </View>
        }
      />

      {/* Detail Modal */}
      <Modal visible={!!selected} transparent animationType="fade">
        <Pressable style={styles.modalBg} onPress={() => setSelected(null)}>
          <View style={styles.modalContent}>
            <Image
              source={{ uri: selected?.url }}
              style={styles.modalImg}
              contentFit="contain"
              transition={300}
            />
            <GlassCard style={styles.modalMeta}>
              <View style={styles.modalHeader}>
                <View style={styles.typeBadge}>
                  <MaterialIcons
                    name={selected?.type === 'image' ? 'image' : 'videocam'}
                    size={12}
                    color={Colors.textPrimary}
                  />
                  <Text style={styles.typeText}>{selected?.type}</Text>
                </View>
                <Pressable onPress={() => setSelected(null)}>
                  <MaterialIcons name="close" size={22} color={Colors.textSecondary} />
                </Pressable>
              </View>
              <Text style={styles.modalPrompt}>{selected?.prompt}</Text>
              <Text style={styles.modalDate}>
                {selected?.createdAt ? new Date(selected.createdAt).toLocaleString() : ''}
              </Text>
              <View style={styles.actionRow}>
                <Pressable
                  onPress={handleDownload}
                  disabled={!!actionLoading}
                  style={({ pressed }) => [styles.actionBtn, { opacity: pressed || actionLoading ? 0.7 : 1 }]}
                >
                  {actionLoading === 'download' ? (
                    <ActivityIndicator size="small" color={Colors.primaryLight} />
                  ) : (
                    <MaterialIcons name="file-download" size={18} color={Colors.primaryLight} />
                  )}
                  <Text style={styles.actionBtnText}>Save</Text>
                </Pressable>
                <Pressable
                  onPress={handleShare}
                  disabled={!!actionLoading}
                  style={({ pressed }) => [styles.actionBtn, { opacity: pressed || actionLoading ? 0.7 : 1 }]}
                >
                  {actionLoading === 'share' ? (
                    <ActivityIndicator size="small" color={Colors.primaryLight} />
                  ) : (
                    <MaterialIcons name="share" size={18} color={Colors.primaryLight} />
                  )}
                  <Text style={styles.actionBtnText}>Share</Text>
                </Pressable>
              </View>
            </GlassCard>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  listContent: {
    paddingBottom: Spacing.xxl,
  },
  columnWrapper: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    alignSelf: 'flex-end',
    marginRight: Spacing.md,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.round,
    borderWidth: 1,
    borderColor: Colors.errorGlow,
    backgroundColor: Colors.errorGlow,
  },
  clearBtnText: {
    color: Colors.error,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  gridItem: {
    width: ITEM_SIZE,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  gridImg: {
    width: '100%',
    height: ITEM_SIZE,
    backgroundColor: Colors.surfaceBorder,
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xs,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Radius.round,
  },
  typeText: {
    color: Colors.textPrimary,
    fontSize: 10,
    fontWeight: FontWeight.semibold,
  },
  deleteBtn: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridPrompt: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    padding: Spacing.sm,
    lineHeight: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  emptyImg: {
    width: 200,
    height: 200,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
  },
  emptyHint: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  modalContent: {
    gap: Spacing.md,
  },
  modalImg: {
    width: '100%',
    height: 320,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
  },
  modalMeta: {
    gap: Spacing.sm,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalPrompt: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    lineHeight: 22,
  },
  modalDate: {
    color: Colors.textSubtle,
    fontSize: FontSize.xs,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    backgroundColor: Colors.primaryGlow,
  },
  actionBtnText: {
    color: Colors.primaryLight,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
});
