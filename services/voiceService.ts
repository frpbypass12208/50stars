// Powered by OnSpace.AI
import { Audio } from 'expo-av';
import { getSupabaseClient } from '@/template';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { Platform } from 'react-native';

let recording: Audio.Recording | null = null;

async function transcribeAudioBase64(base64: string, mimeType: string): Promise<string> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.functions.invoke('transcribe-voice', {
    body: { audioBase64: base64, mimeType },
  });

  if (error) {
    let msg = error.message;
    if (error instanceof FunctionsHttpError) {
      try {
        const text = await error.context?.text();
        msg = text || msg;
      } catch {
        // ignore
      }
    }
    throw new Error(msg);
  }

  return data?.transcript ?? '';
}

export const voiceService = {
  async startListening(): Promise<void> {
    try {
      // Request microphone permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Microphone permission not granted');
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: rec } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recording = rec;
    } catch (err) {
      throw new Error(`Could not start recording: ${(err as Error).message}`);
    }
  },

  async stopAndTranscribe(): Promise<string> {
    if (!recording) {
      throw new Error('No active recording');
    }

    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

      const uri = recording.getURI();
      recording = null;

      if (!uri) {
        throw new Error('No recording URI available');
      }

      // Read the recorded file as base64
      const { FileSystem } = await import('expo-file-system');
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Determine mime type
      const mimeType = Platform.OS === 'ios' ? 'audio/mp4' : 'audio/webm';

      // Transcribe via Edge Function
      const transcript = await transcribeAudioBase64(base64, mimeType);
      return transcript;
    } catch (err) {
      recording = null;
      throw new Error(`Transcription error: ${(err as Error).message}`);
    }
  },

  async cancelListening(): Promise<void> {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
      } catch {
        // ignore
      }
      recording = null;
    }
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
  },
};
