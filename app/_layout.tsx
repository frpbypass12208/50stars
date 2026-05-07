// Powered by OnSpace.AI
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';
import { GalleryProvider } from '@/contexts/GalleryContext';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <GalleryProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </GalleryProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
