// Powered by OnSpace.AI
import { useState, useCallback, useRef } from 'react';
import { aiService, GenerationResult } from '@/services/aiService';
import { useGallery } from './useGallery';
import { GenerationMode, GENERATION_MODES } from '@/constants/config';

export type GenerateStatus = 'idle' | 'generating' | 'success' | 'error';

export function useGenerate() {
  const { addItem } = useGallery();
  const [status, setStatus] = useState<GenerateStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<GenerationMode>(GENERATION_MODES.IMAGE);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoUploadedRef = useRef(false);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const generateImage = useCallback(async (prompt: string) => {
    // Animate progress up to 85% while waiting
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 3, 85));
    }, 400);

    try {
      const res = await aiService.generateImage(prompt);
      clearInterval(progressInterval);
      setProgress(100);
      setResult(res);
      setStatus('success');
      addItem(res);
    } catch (err) {
      clearInterval(progressInterval);
      throw err;
    }
  }, [addItem]);

  const generateVideo = useCallback(async (prompt: string) => {
    videoUploadedRef.current = false;

    // Start task and get prediction ID
    const predictionId = await aiService.createVideoTask(prompt);

    return new Promise<void>((resolve, reject) => {
      pollRef.current = setInterval(async () => {
        if (videoUploadedRef.current) return;

        try {
          const statusData = await aiService.checkVideoStatus(predictionId);

          if (statusData.error) {
            videoUploadedRef.current = true;
            stopPolling();
            reject(new Error(statusData.error));
            return;
          }

          if (statusData.status === 'starting' || statusData.status === 'processing') {
            const p = statusData.progress ?? 0;
            setProgress(Math.min(p > 0 ? p : 10, 90));
            return;
          }

          if (statusData.status === 'succeeded' && statusData.storage_url) {
            videoUploadedRef.current = true;
            stopPolling();
            setProgress(100);

            const res: GenerationResult = {
              id: predictionId,
              type: 'video',
              prompt,
              url: statusData.storage_url,
              thumbnail: statusData.storage_url,
              createdAt: new Date(),
              enhanced: false,
              predictionId,
            };

            setResult(res);
            setStatus('success');
            addItem(res);
            resolve();
          }
        } catch (err) {
          videoUploadedRef.current = true;
          stopPolling();
          reject(err);
        }
      }, 5000);
    });
  }, [addItem]);

  const generate = useCallback(async (prompt: string) => {
    if (!prompt.trim()) return;
    setStatus('generating');
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      if (mode === GENERATION_MODES.IMAGE) {
        await generateImage(prompt);
      } else {
        // For video: set initial progress and start polling
        setProgress(5);
        await generateVideo(prompt);
      }
    } catch (err) {
      stopPolling();
      setError((err as Error).message || 'Generation failed. Please try again.');
      setStatus('error');
    }
  }, [mode, generateImage, generateVideo]);

  const reset = useCallback(() => {
    stopPolling();
    setStatus('idle');
    setProgress(0);
    setResult(null);
    setError(null);
    videoUploadedRef.current = false;
  }, []);

  return { status, progress, result, error, mode, setMode, generate, reset };
}
