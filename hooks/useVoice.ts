// Powered by OnSpace.AI
import { useState, useCallback, useRef } from 'react';
import { voiceService } from '@/services/voiceService';

export type VoiceStatus = 'idle' | 'listening' | 'processing' | 'done' | 'error';

export function useVoice() {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const listeningRef = useRef(false);

  const startListening = useCallback(async () => {
    setStatus('listening');
    setTranscript('');
    setError(null);
    listeningRef.current = true;
    try {
      await voiceService.startListening();
    } catch {
      setError('Could not start voice recording.');
      setStatus('error');
    }
  }, []);

  const stopListening = useCallback(async () => {
    if (!listeningRef.current) return;
    listeningRef.current = false;
    setStatus('processing');
    try {
      const text = await voiceService.stopAndTranscribe();
      setTranscript(text);
      setStatus('done');
    } catch {
      setError('Transcription failed.');
      setStatus('error');
    }
  }, []);

  const cancel = useCallback(async () => {
    listeningRef.current = false;
    await voiceService.cancelListening();
    setStatus('idle');
    setTranscript('');
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setTranscript('');
    setError(null);
  }, []);

  return { status, transcript, error, startListening, stopListening, cancel, reset };
}
